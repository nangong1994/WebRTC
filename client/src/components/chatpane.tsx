import React from "react";
import { CON_BRIDGE } from "../connect/bridge";
import './styles.css';

const USERS = [
  {name: 'James John'},
  {name: 'Elon Musk'},
  {name: 'Steven Tornado'},
  {name: 'Tim Cook'},
  {name: '马云'},
  {name: '马化腾'},
]
export class ChatPanel extends React.Component {
  private selectedIdx: number;

  constructor(props: any = {}) {
    super(props);
    this.selectedIdx = NaN;
  }

  componentDidMount(): void {
    CON_BRIDGE.init();
  }

  changeUser(name: string, index: number) {
    if (index === this.selectedIdx) {
      return;
    }
    this.selectedIdx = index;
    CON_BRIDGE.emit('userChange', { user: name });
  }

  render(): React.ReactNode {
    return (
      <div className="panel-box">
        { USERS.map((user: any, index: number) => {
            return (
              <div key={`chatlist-${index}`} className="user-info" onClick={this.changeUser.bind(this, user.name, index)}>
                <div className="chatlist-alias">{String(user.name[0]).toLocaleUpperCase()}</div>
                <li>{user.name}</li>
              </div>
            )
        }) }
      </div>
    );
  }
}
