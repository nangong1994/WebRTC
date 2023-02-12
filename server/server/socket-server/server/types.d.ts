 declare interface IWebRTCSocketServer {
  public on: (event: string, callback: (...args: any) => void) => void;
}