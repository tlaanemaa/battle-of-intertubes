import { BaseMessage } from "../network/messages/BaseMessage";
import { ConnectionApprovedMessage } from "../network/messages/ConnectionApprovedMessage";
import { ConnectionRequestMessage } from "../network/messages/ConnectionRequestMessage";
import { StateUpdateMessage } from "../network/messages/StateUpdateMessage";
import { Parser } from "../network/Parser";

export class ServerConnection {
  private ready = false;
  private readonly messageQueue: BaseMessage[] = [];
  private readonly socket: WebSocket;

  constructor(url: string) {
    this.socket = new WebSocket(url);
    this.socket.addEventListener("open", this.handleOpen.bind(this));
    this.socket.addEventListener("message", this.handleMessage.bind(this));
    this.socket.addEventListener("close", this.handleClose.bind(this));
    this.socket.addEventListener("error", this.handleError.bind(this));
  }

  public send(message: BaseMessage) {
    if (!this.ready) {
      this.messageQueue.push(message);
    } else {
      this.socket.send(message.serialize());
    }
  }

  private flushQueue() {
    let message: BaseMessage | undefined;
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
