export namespace Logger{
  export function log(text: string) {
    const time = new Date();
    console.log("[" + time.toLocaleTimeString() + "] " + text ? text.toString() : `unsupported message received-${text}`);
  }
}