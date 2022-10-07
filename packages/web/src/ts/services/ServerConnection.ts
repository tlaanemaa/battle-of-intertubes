import { container } from "@moose-rocket/container";
import {
  AnyMessage,
  ConnectionApprovedMessage,
  ConnectionRequestMessage,
  StateUpdateMessage,
  Parser,
  ActionPerformedMessage,
} from "@moose-rocket/messaging";
import { injectable } from "inversify";

@injectable()
export class ServerConnection {
  private ready = false;
  private readonly messageQueue: AnyMessage[] = [];
  private readonly socket: WebSocket;

  constructor(
    url: string,
    private readonly onMessage: (message: AnyMessage) => void
  ) {
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
    }

    this.onMessage(message);
  }

  private handleClose() {
    console.log("CLOSEEED");
  }

  private handleError() {
    console.error("ERRUR");
  }
}

container.bind(ServerConnection).toSelf().inSingletonScope();
