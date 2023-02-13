export declare type IEventType = 'update' | 'userChange';
class EventBus<T> {
  private listers: Map<string | T, any>;
  private static instance: EventBus<any>;

  constructor() {
    this.listers = new Map();
  }

  public static getInstance() {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }

    return EventBus.instance;
  }

  on(event: IEventType | T, listener: any) {
    if (!event || !listener) {
      return;
    }
    this.listers.set(event, listener);
  }

  emit(event: IEventType | T, data?: any) {
    if (!event || !this.listers.get(event)) {
      return;
    }

    // each listener has update method
    this.listers.get(event).update({type: event, data});
  }
}

export const EVENT = EventBus.getInstance();
