import { Message } from "./message";

export class CharListModel {
  private messageList: Map<string, Message[]>;

  constructor() {
    this.messageList = new Map();
  }

  addMessage(user: string, message: string) {
    if (!user) {
      return;
    }
    if (!this.messageList.get(user)) {
      this.messageList.set(user, []);
    }
    this.messageList.get(user)?.push(new Message(message));
  }

  getMessageList(user: string, bString: boolean = true) {
    const emptyMsg = `Hi, I am ${user}`;
    if (!bString) {
      return this.messageList.get(user) || [new Message(emptyMsg)];
    }

    const ret  = [];
    const list: Message[] = this.messageList.get(user) as Message[];
    if (!list || !list.length) {
      return [emptyMsg];
    }

    for (const msg of list) {
      if (msg && msg.getText()) {
        ret.push(msg.getText());
      }
    }

    return ret;
  }
}