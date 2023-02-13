import { EVENT, IEventType } from "../event/event";
import { CharListModel } from "../model/chatModel";

class ConnectBridge<T> {
  private model: T | any;
  private static instance: ConnectBridge<any>;
  constructor() {
    this.model = null;
  }

  public static getInstance(): ConnectBridge<any> {
    if (!ConnectBridge.instance) {
      ConnectBridge.instance = new ConnectBridge();
    }

    return ConnectBridge.instance;
  }

  public init() {
    this.registerModel<CharListModel>(new CharListModel());
  }

  public registerModel<T>(model: T) {
    this.model = model;
  }

  public andMessage(toWhom: string, fromWhom: string, message: string) {
    if (!this.model || !this.model.addMessage) {
      return;
    }

    this.model.addMessage(toWhom, fromWhom, message);
    this.emit('update', [{user: fromWhom, message: message}]);
  }

  public on<T>(action: IEventType, listner: T) {
    EVENT.on(action, listner);
  }

  public emit(action: IEventType, payload: any) {
    const data: any = {};
    switch(action) {
      case 'update': {
        data.data = payload;
        break;
      }
      case 'userChange': {
        data.user = payload.user;
        data.data = this.model.getMessageList(payload.user, true);
        break;
      }

      default: {
        /* nothing to do */
      }
    }
    EVENT.emit(action, data);
  }
}

export const CON_BRIDGE = ConnectBridge.getInstance();
