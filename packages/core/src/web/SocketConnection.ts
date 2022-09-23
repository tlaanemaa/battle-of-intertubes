import { ActionPerformedMessage } from "../network/messages/ActionPerformedMessage";
import { BaseMessage } from "../network/messages/BaseMessage";
import { ConnectionApprovedMessage } from "../network/messages/ConnectionApprovedMessage";
import { ConnectionRequestMessage } from "../network/messages/ConnectionRequestMessage";
import { StateUpdateMessage } from "../network/messages/StateUpdateMessage";
import { Parser } from "../network/Parser";

export class SocketConnection {
  private ready = false;
  private readonly socket = new WebSocket("ws://localhost:8080");

  constructor() {
    this.socket.addEventListener("open", this.handleOpen.bind(this));
    this.socket.addEventListener("message", this.handleMessage.bind(this));
    this.socket.addEventListener("close", this.handleClose.bind(this));
    this.socket.addEventListener("error", this.handleError.bind(this));
  }

  public send(message: BaseMessage) {
    this.socket.send(message.serialize());
  }

  private handleOpen() {
    this.socket.send(new ConnectionRequestMessage("default").serialize());
  }

  private handleMessage(event: MessageEvent) {
    const message = Parser.parse(event.data.toString());
    switch (message.constructor) {
      case ConnectionRequestMessage:

      case ConnectionApprovedMessage:
        this.ready = true;
        break;

      case ActionPerformedMessage:

      case StateUpdateMessage:
    }
  }

  private handleClose() {}

  private handleError() {}
}
