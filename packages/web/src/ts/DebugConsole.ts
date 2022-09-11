export class DebugConsole {
  private element = document.createElement("div");

  constructor() {
    this.element.className = "debug-console";
    window.document.body.append(this.element);
  }

  public write(...data: unknown[]) {
    const line = document.createElement("div");
    const date = new Date();
    const datePrefix = [
      date.toTimeString().slice(0, 8),
      date.getMilliseconds(),
    ].join(".");
    line.innerText = [datePrefix, JSON.stringify(data)].join(" ");
    this.element.prepend(line);
  }
}
