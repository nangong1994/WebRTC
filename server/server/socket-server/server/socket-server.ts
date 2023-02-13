// import socket server module
const WebSocketServer = require('websocket').server;

class WebRTCSocketServer {
  private socketServer: typeof WebSocketServer;
  constructor(options: any) {
    this.socketServer = new WebSocketServer(options);
  }

  public on (event: string, callback: (...args: any) => void) {
    if (!event || !callback) {
        return;
    }

    this.socketServer.on(event, callback);
  }
}

export const WSServer = function (options: any = {}) {
    return new WebRTCSocketServer(options);
}
