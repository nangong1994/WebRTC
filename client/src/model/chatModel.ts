import { Message } from "./message";

export class CharListModel {
  private messageList: Map<string, Message[]>;

  constructor() {
    this.messageList = new Map();
  }

  addMessage(toWhom: string, fromWhom: string, message: string) {
    if (!toWhom) {
      return;
    }
    if (!this.messageList.get(toWhom)) {
      this.messageList.set(toWhom, []);
    }
    this.messageList.get(toWhom)?.push(new Message(message, fromWhom));
  }

  getMessageList(user: string, bJSON: boolean = true) {
    const emptyMsg = `Hi, I am ${user}`;
    if (!bJSON) {
      return this.messageList.get(user) || [new Message(emptyMsg, user)];
    }

    const ret  = [];
    let list: Message[] = this.messageList.get(user) as Message[];
    if (!list || !list.length) {
      this.messageList.set(user, [new Message(emptyMsg, user)]);
    }

    list = this.messageList.get(user) as Message[];
    for (const msg of list) {
      if (msg && msg.getJson()) {
        ret.push(msg.getJson());
      }
    }

    return ret;
  }
}