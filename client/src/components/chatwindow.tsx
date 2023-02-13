import React from "react";
import { CON_BRIDGE } from "../connect/bridge";
import { InputEngine } from "../widget/inputEng/inputEng";
import { MessageInfo } from "../widget/message/message";
import './styles.css';

export class ChatWindow extends React.Component {
  private user: string;
  private owner: string;
  private newMsg: string;
  private messageList: any[];
  private msgListWin: HTMLDivElement | null;
  private inputElement: HTMLElement  | null;

  constructor(props: any = {}) {
    super(props);
    this.user = '';
    this.owner = 'A';
    this.messageList = [];
    this.newMsg = '';
    this.msgListWin = null;
    this.inputElement = null;
  }

  componentDidMount(): void {
    this.updateUI();
    window.onresize = () => {
        this.updateUI();
    }
    CON_BRIDGE.on('update', this);
    CON_BRIDGE.on('userChange', this);
    this.inputElement?.focus();
  }

  update(data: any) {
    if (!data) {
      return;
    }

    const type    = data.type;
    const payload = data.data;
    if (!type || !payload) {
      return;
    }

    switch(type) {
      case 'update': {
        this.messageList = payload.data ? this.messageList.concat(payload.data) : this.messageList;
        break;
      }
      case 'userChange': {
        if (payload.user === this.user) {
          return;
        }
        this.user = payload.user;
        this.messageList = payload.data;
        break;
      }
      default: {
        /* Nothing to do so far */
      }
    }

    this.setState({});
  }

  updateUI = () => {
    if (!this.inputElement) {
      if (!document.getElementById('type-area')) {
        return;
      }
      this.inputElement = document.getElementById('type-area') as HTMLElement;
    }

    const w = window.innerWidth - 405;
    this.inputElement.style.width = w + 'px';

    if (!this.msgListWin) {
      this.msgListWin = document.getElementById('msg-list-win') as HTMLDivElement;
    }

    const h = window.innerHeight - 160;
    this.msgListWin.style.height = h + 'px';
  }

  onkeydown = (e: KeyboardEvent) => {
    e.stopPropagation();
    if (e && (e.keyCode === 13 || (e.key && e.key.toLocaleUpperCase() === 'ENTER'))) {
      e.preventDefault();
      (this.inputElement as HTMLInputElement).value = '';
      CON_BRIDGE.andMessage(this.user, this.owner, this.newMsg);

      this.newMsg = '';
      this.inputElement?.focus();
    }
  }

  onChange = (text: any) => {
    this.newMsg = text;
  }

  isShowInputBox = (): boolean => {
    return !!this.user && !!this.owner;
  }

  render(): React.ReactNode {
    return (
      <div className="window-box">
        <div className="chat-win">
          <div className="message-list" id="msg-list-win">
            {this.messageList.map((msg, index) => {
              return <MessageInfo key={`msg-list-${index}`} user={this.user} owner={this.owner} msg={msg} />;
            })}
          </div>
          <div style={{display: this.isShowInputBox() ? '' : 'none'}} className="type-area">
            <InputEngine key='chat-input-engine' onChange={this.onChange} onkeydown={this.onkeydown} />
          </div>
        </div>
        <div className="tool-win"></div>
      </div>
    );
  }
}
