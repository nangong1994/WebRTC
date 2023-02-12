export class Message {
  private value: string;
  private style: string;

  constructor(message: string, style: string = '') {
    this.value = message || '';
    this.style = style;
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

  updateStyle(style: string, bReplace: boolean = false) {
    if (bReplace) {
      this.style = style;
      return;
    }
    this.style += ' ' + style;
  }
}