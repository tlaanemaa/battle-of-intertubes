import { singleton } from "tsyringe";
import { WebSocketServer, WebSocket } from "ws";
import {
  ConnectionRequestMessage,
  KeyHandler,
  Parser,
} from "@battle-of-intertubes/core";
import { Logger } from "@battle-of-intertubes/logger";
import { RoomStore } from "./RoomStore";
import { IncomingMessage } from "http";

@singleton()
export class SocketServer {
  private readonly keyHandler = new KeyHandler();
  private readonly port = parseInt(process.env.PORT!) || 8080;
  private readonly server?: WebSocketServer;

  constructor(
    private readonly logger: Logger,
    private readonly roomStore: RoomStore
  ) {
    this.server = new WebSocketServer({ port: this.port }, () =>
      this.logger.info(
        `Websocket server listening at ws://localhost:${this.port}`
      )
    );
    this.server.on("connection", this.handleConnection.bind(this));
  }

  private handleConnection(socket: WebSocket, req: IncomingMessage) {
    const socketMeta = {
      url: req.url,
      ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
    };

    this.logger.info("Client connected", socketMeta);

    socket.once("message", (data) => {
      try {
        const message = Parser.parse(data.toString());

        if (
          message instanceof ConnectionRequestMessage &&
          this.keyHandler.keyIsValid(message.key)
        ) {
          this.roomStore.get(message.room).join(socket);
        } else {
          socket.close();
        }
      } catch (e) {
        this.logger.error("Client error", { ...socketMeta, error: e });
        socket.close();
      }
    });
  }
}
