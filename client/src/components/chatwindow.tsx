import React from "react";
import { EVENT } from "../event/event";
import './styles.css';

const msgBoxStyle: React.CSSProperties = {
  padding: '5px',
  display: 'flex',
  alignItems: 'center',
  minHeight: '20px'
}

const msgStyle: React.CSSProperties = {
  right: '5px',
  padding: '5px',
  borderRadius: '5px',
  maxWidth: '350px',
  wordBreak: 'break-all',
  whiteSpace: 'pre-wrap',
  border: '0.5px solid rgb(201, 198, 198)'
}

const aliaStyle: React.CSSProperties = {
  width: '30px',
  height: '30px',
  display: 'flex',
  alignItems: 'center',
  borderRadius: '50%',
  justifyContent: 'center',
  alignSelf: 'baseline',
  border: '1px solid rgb(201, 198, 198)'
}

export class ChatWindow extends React.Component {
  private owner: string;
  private newMsg: string;
  private messageList: any[];
  private msgListWin: HTMLDivElement | null;
  private inputElement: HTMLElement  | null;
  constructor(props: any = {}) {
    super(props);
    this.owner = 'A';
    this.messageList = [
      {user: 'X', message: 'Hi, bro'},
      {user: 'A', message: 'Hi, Nice to meet you!'},
    ];
    this.newMsg = '';
    this.msgListWin = null;
    this.inputElement = null;
  }

  componentDidMount(): void {
    this.updateUI();
    window.onresize = () => {
        this.updateUI();
    }
    EVENT.on('update', this);
    this.inputElement?.focus();
  }

  update(data: any) {
    if (!data) {
      return;
    }

    console.log(data);
    
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
      this.messageList.push({user: 'A', message: this.newMsg});
      this.setState({});
      this.newMsg = '';
      this.inputElement?.focus();
    }
  }

  onChange = (text: any) => {
    this.newMsg = text;
  }

  formatMsg = (msg: any, index: number): JSX.Element => {
    return (
      <div style={{position: 'relative', minHeight: '20px'}} key={`chat-msg-${index}`}>
        {
          msg.user === this.owner ? (
            <div style={{right: '5px', justifyContent: 'end', ...msgBoxStyle}}>
              <div style={{background: '#5fdc5f', ...msgStyle, marginRight: '5px'}}>{msg.message}</div>
              <div style={{...aliaStyle}}>{String(msg.user[0]).toLocaleUpperCase()}</div>
            </div>
          ) : (
            <div style={{left: '5px', justifyContent: 'left', ...msgBoxStyle}}>
              <div style={{...aliaStyle}}>{String(msg.user[0]).toLocaleUpperCase()}</div>
              <div style={{background: 'transparent', ...msgStyle, marginLeft: '5px'}}>{msg.message}</div>
            </div>
          )
        }
      </div>
    );
  }

  render(): React.ReactNode {
    return (
      <div className="window-box">
        <div className="chat-win">
          <div className="message-list" id="msg-list-win">
            {this.messageList.map((msg, index) => {
              return this.formatMsg(msg, index);
            })}
          </div>
          <div className="type-area">
            <textarea name="" id="type-area"
                      onChange={(e: any) => {this.onChange(e.target.value)}}
                      onKeyDown={(e: any) => {this.onkeydown(e)}}>        
            </textarea>
          </div>
        </div>
        <div className="tool-win"></div>
      </div>
    );
  }
}
