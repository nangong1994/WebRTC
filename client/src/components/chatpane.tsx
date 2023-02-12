import React from "react";
import { EVENT } from "../event/event";
import './styles.css';

const USERS = [
  {name: 'James John'},
  {name: 'Elon Musk'},
  {name: 'Steven Tornado'},
  {name: 'Tim Cook'},
]
export class ChatPanel extends React.Component {
  private selectedIdx: number;

  constructor(props: any = {}) {
    super(props);
    this.selectedIdx = NaN;
  }

  changeUser(name: string, index: number) {
    if (index === this.selectedIdx) {
      return;
    }
    EVENT.emit('update', { name });
    this.selectedIdx = index;
  }

  render(): React.ReactNode {
    return (
      <div className="panel-box">
        { USERS.map((user: any, index: number) => {
            return (
              <div key={`chatlist-${index}`} className="user-info" onClick={this.changeUser.bind(this, user, index)}>
                <div className="chatlist-alias">{String(user.name[0]).toLocaleUpperCase()}</div>
                <li>{user.name}</li>
              </div>
            )
        }) }
      </div>
    );
  }
}
