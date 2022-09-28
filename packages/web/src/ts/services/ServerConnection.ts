import {
  AnyMessage,
  ConnectionApprovedMessage,
  ConnectionRequestMessage,
  StateUpdateMessage,
  Parser,
} from "@battle-of-intertubes/core";

export class ServerConnection {
  private ready = false;
  private readonly messageQueue: AnyMessage[] = [];
  private readonly socket: WebSocket;

  constructor(url: string) {
    this.socket = new WebSocket(url);
    this.socket.addEventListener("open", this.handleOpen.bind(this));
    this.socket.addEventListener("message", this.handleMessage.bind(this));
    this.socket.addEventListener("close", this.handleClose.bind(this));
    this.socket.addEventListener("error", this.handleError.bind(this));
  }

  public send(message: AnyMessage) {
    if (!this.ready) {
      this.messageQueue.push(message);
    } else {
      this.socket.send(message.serialize());
    }
  }

  public close() {
    this.socket.close();
  }

  private flushQueue() {
    let message: AnyMessage | undefined;
    while ((message = this.messageQueue.shift())) {
      this.send(message);
    }
  }

  private setReady(ready: boolean) {
    this.ready = ready;
    if (ready) this.flushQueue();
  }

  private handleOpen() {
    this.socket.send(new ConnectionRequestMessage("default").serialize());
  }

  private handleMessage(event: MessageEvent) {
    const message = Parser.parse(event.data.toString());
    switch (message.constructor) {
      case ConnectionApprovedMessage:
        this.setReady(true);
        break;

      case StateUpdateMessage:
    }
  }

  private handleClose() {}

  private handleError() {}
}

// FIXME: Remove after testing
(window as any).ServerConnection = ServerConnection;
