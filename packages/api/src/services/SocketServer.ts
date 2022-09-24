import { singleton } from "tsyringe";
import { WebSocketServer, WebSocket } from "ws";
import {
  ConnectionRequestMessage,
  KeyHandler,
  Parser,
} from "@battle-of-intertubes/core";
import { RoomStore } from "./RoomStore";

@singleton()
export class SocketServer {
  private readonly keyHandler = new KeyHandler();
  private readonly port = parseInt(process.env.PORT!) || 8080;
  private readonly server?: WebSocketServer;

  constructor(private readonly roomStore: RoomStore) {
    this.server = new WebSocketServer({ port: this.port }, () =>
      console.log(`Websocket server listening at ws://localhost:${this.port}`)
    );
    this.server.on("connection", this.handleConnection.bind(this));
  }

  private handleConnection(socket: WebSocket) {
    socket.once("message", (data) => {
      const message = Parser.parse(data.toString());

      if (
        message instanceof ConnectionRequestMessage &&
        this.keyHandler.keyIsValid(message.key)
      ) {
        this.roomStore.get(message.room).join(socket);
      } else {
        socket.close();
      }
    });
  }
}
