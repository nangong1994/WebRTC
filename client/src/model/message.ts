interface IMessageObject {
  user: string,
  message: string,
}
export class Message {
  private value: string;
  private style: string;
  private owner: string;

  constructor(message: string, owner: string = '', style: string = '') {
    this.value = message || '';
    this.style = style;
    this.owner = owner;
  }

  update(text: string, bReplace: boolean = false) {
    if (bReplace) {
      this.value = text;
      return;
    }
    this.value += text;
  }

  getText(): string {
    return this.value;
  }

  getJson(): IMessageObject {
    return { user: this.owner, message: this.getText() };
  }

  updateStyle(style: string, bReplace: boolean = false) {
    if (bReplace) {
      this.style = style;
      return;
    }
    this.style += ' ' + style;
  }
}