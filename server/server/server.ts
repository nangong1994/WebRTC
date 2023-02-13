"use strict";

import fs from 'fs';
import http from 'http';
import https from 'https';
import { LOGGER } from '../logger/index';
import { WSServer } from './socket-server/index';

// Pathnames of the SSL key and certificate files to use for
// HTTPS connections.
const keyFilePath = "/etc/pki/tls/private/mdn-samples.mozilla.org.key";
const certFilePath = "/etc/pki/tls/certs/mdn-samples.mozilla.org.crt";

// Used for managing the text chat user list.
let nextID = Date.now();
let appendToMakeUnique = 1;
let connectionArray: any[] = [];

/**
 * @description
 * Output logging information to console
 */
LOGGER.log('Server staring logging checking...')

/**
 * @description
 * Origin checking if in need
 * 
 * @param origin 
 * @returns { boolean }
 */
function originIsAllowed<T>(origin: T): boolean {
  return true;    // We will accept all connections
}

/**
 * @description
 * check user name is unique or not. Each name is expected to be unique
 * 
 * @param { string } name
 * @returns { boolean }
 */
function isUsernameUnique(name: string): boolean {
  let isUnique = true;

  for (let i = 0; i < connectionArray.length; i++) {
    if (connectionArray[i].username === name) {
      isUnique = false;
      break;
    }
  }
  return isUnique;
}

/**
 * @description
 * Sends a message (which is already stringified JSON) to a single
 * user, given their username. We use this for the WebRTC signaling,
 * and we could use it for private text messaging.
 * 
 * @param target
 * @param msgString 
 */
function sendToOneUser(target: string, msgString: string) {
  connectionArray.find((conn) => conn.username === target).send(msgString);
}

/**
 * @description
 * Scan the list of connections and return the one for the specified
 * clientID. Each login gets an ID that doesn't change during the session,
 * so it can be tracked across username changes.
 * 
 * @param id 
 * @returns 
 */
function getConnectionByID(id: string) {
  let connect = null;
  for (let i = 0; i < connectionArray.length; i++) {
    if (connectionArray[i].clientID === id) {
      connect = connectionArray[i];
      break;
    }
  }

  return connect;
}

/**
 * @description
 * Builds a message object of type "userlist" which contains the names of
 * all connected users. 
 * Used to ramp up newly logged-in users
 * Handle name change notifications (inefficiently).
 * 
 * @returns 
 */
function makeUserListMessage() {
  const userListMsg: /* IUserListMessaage */any = {
    type: "userlist",
    users: []
  };

  // Add the users to the list
  for (let i = 0; i < connectionArray.length; i++) {
    userListMsg.users.push(connectionArray[i].username);
  }

  return userListMsg;
}

/**
 * @description
 * Sends a "userlist" message to all chat members. This is a cheesy way
 * to ensure that every join/drop is reflected everywhere. It would be more
 * efficient to send simple join/drop messages to each user, but this is
 * good enough for this simple example.
 * 
 */
function sendUserListToAll() {
  const userListMsg = makeUserListMessage();
  const userListMsgStr = JSON.stringify(userListMsg);

  for (let i = 0; i < connectionArray.length; i++) {
    connectionArray[i].sendUTF(userListMsgStr);
  }
}


// load the key and certificate files for SSL so we can
// do HTTPS (required for non-local WebRTC).
const httpsOptions: any = { key: null, cert: null };

try {
  httpsOptions.key = fs.readFileSync(keyFilePath);
  try {
    httpsOptions.cert = fs.readFileSync(certFilePath);
  } catch(err) {
    httpsOptions.key = null;
    httpsOptions.cert = null;
    LOGGER.log(`Loading SSL key failed with error: ${err}`);
  }
} catch(err) {
  httpsOptions.key = null;
  httpsOptions.cert = null;
  LOGGER.log(`Loading SSL certification failed with error: ${err}`);
}

// If we were able to get the key and certificate files, try to start up an HTTPS server.
let webServer: any = null;
try {
  if (httpsOptions.key && httpsOptions.cert) {
    webServer = https.createServer(httpsOptions, handleWebRequest);
  }
} catch(err) {
  webServer = null;
  LOGGER.log(`web server staring failed with error: ${err}`);
}

if (!webServer) {
  try {
    webServer = http.createServer({}, handleWebRequest);
  } catch(err: any) {
    webServer = null;
    LOGGER.log(`Error attempting to create HTTP(s) server: ${err.toString()}`);
  }
}

/**
 * @description
 * Our HTTPS server does nothing but service WebSocket
 * connections, so every request just returns 404. Real Web
 * requests are handled by the main server on the box. If you
 * want to, you can return real HTML here and serve Web content.
 * 
 * @param request 
 * @param response 
 */
function handleWebRequest(request: any, response: any) {
  LOGGER.log('Received request for ' + request.url);
  // response.writeHead(404);
  response.write('Hello, welcome!');
  response.end();
}

/**
 * @description
 * Spin up the HTTPS server on the port assigned to this sample.
 * This will be turned into a WebSocket port very shortly.
 * 
 */
const PORT = 8848;
webServer.listen(PORT, function() {
  LOGGER.log(`Server is listening on port ${PORT}`);
});

// Create the WebSocket server by converting the HTTPS server into one.

const wsServer = WSServer({
  httpServer: webServer,
  autoAcceptConnections: false
});

if (!wsServer) {
  LOGGER.log(`ERROR: Unable to create WbeSocket server!`);
}

/**
 * @description
 * Set up a "connect" message handler on our WebSocket server. This is
 * called whenever a user connects to the server's port using the
 * WebSocket protocol.
 * 
 */
wsServer.on('request', function(request: any) {
  if (!originIsAllowed(request.origin)) {
    request.reject();
    LOGGER.log("Connection from " + request.origin + " rejected.");
    return;
  }

  // Accept the request and get a connection.
  const connection = request.accept("json", request.origin);

  // Add the new connection to our list of connections.
  LOGGER.log('Connection accepted from ' + connection.remoteAddress + '.');
  connectionArray.push(connection);

  connection.clientID = nextID;
  nextID++;

  // Send the new client its token; it send back a "username" message to
  // tell us what username they want to use.
  let msg: any = {
    type: "id",
    id: connection.clientID
  };
  connection.sendUTF(JSON.stringify(msg));

  // Set up a handler for the "message" event received over WebSocket. This
  // is a message sent by a client, and may be text to share with other
  // users, a private message (text or signaling) for one user, or a command
  // to the server.

  connection.on('message', function(message: any) {
    if (message.type === 'utf8') {
      LOGGER.log('Received Message: ' + message.utf8Data);

      // Process incoming data.
      let sendToClients = true;
      msg = JSON.parse(message.utf8Data);
      const connect = getConnectionByID(msg.id);

      // Take a look at the incoming object and act on it based
      // on its type. Unknown message types are passed through,
      // since they may be used to implement client-side features.
      // Messages with a "target" property are sent only to a user
      // by that name.

      switch(msg.type) {
        // Public, textual message
        case "message":
          msg.name = connect.username;
          msg.text = msg.text.replace(/(<([^>]+)>)/ig, "");
          break;

        // Username change
        case "username":
          let nameChanged = false;
          const origName = msg.name;

          // Ensure the name is unique by appending a number to it
          // if it's not; keep trying that until it works.
          while (!isUsernameUnique(msg.name)) {
            msg.name = origName + appendToMakeUnique;
            appendToMakeUnique++;
            nameChanged = true;
          }

          // If the name had to be changed, we send a "rejectusername"
          // message back to the user so they know their name has been
          // altered by the server.
          if (nameChanged) {
            const changeMsg = {
              id: msg.id,
              type: "rejectusername",
              name: msg.name
            };
            connect.sendUTF(JSON.stringify(changeMsg));
          }

          // Set this connection's final username and send out the
          // updated user list to all users. Yeah, we're sending a full
          // list instead of just updating. It's horribly inefficient
          // but this is a demo. Don't do this in a real app.
          connect.username = msg.name;
          sendUserListToAll();
          sendToClients = false;  // We already sent the proper responses
          break;
      }

      // Convert the revised message back to JSON and send it out
      // to the specified client or all clients, as appropriate. We
      // pass through any messages not specifically handled
      // in the select block above. This allows the clients to
      // exchange signaling and other control objects unimpeded.
      if (sendToClients) {
        const msgString = JSON.stringify(msg);

        // If the message specifies a target username, only send the
        // message to them. Otherwise, send it to every user.
        if (msg.target && msg.target !== undefined && msg.target.length !== 0) {
          sendToOneUser(msg.target, msgString);
        } else {
          for (let i = 0; i < connectionArray.length; i++) {
            connectionArray[i].sendUTF(msgString);
          }
        }
      }
    }
  });

  // Handle the WebSocket "close" event; this means a user has logged off
  // or has been disconnected.
  connection.on('close', function(reason: any, description: any) {
    // First, remove the connection from the list of connections.
    connectionArray = connectionArray.filter(function(el, idx, ar) {
      return el.connected;
    });

    // Now send the updated user list. Again, please don't do this in a
    // real application. Your users won't like you very much.
    sendUserListToAll();

    // Build and output log output for close information.

    let logMessage = "Connection closed: " + connection.remoteAddress + " (" +
                     reason;
    if (description !== null && description.length !== 0) {
      logMessage += ": " + description;
    }
    logMessage += ")";
    LOGGER.log(logMessage);
  });
});