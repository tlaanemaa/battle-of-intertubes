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
  private connectionCount = 0;
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
    const connectionId = this.connectionCount++;

    this.logger.info("Client connected", {
      connectionId,
      url: req.url,
      ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
    });

    socket.once("message", (data) => {
      try {
        const message = Parser.parse(data.toString());

        if (
          message instanceof ConnectionRequestMessage &&
          this.keyHandler.keyIsValid(message.key)
        ) {
          this.roomStore.get(message.room).join(socket);
          this.logger.info("Player joined room", {
            connectionId,
            playerId: message.playerId,
            room: message.room,
          });
        } else {
          socket.close();
        }
      } catch (e) {
        this.logger.error("Client error", { connectionId, error: e });
        socket.close();
      }
    });

    socket.on("close", () => {
      this.logger.info("Client disconnected", {
        connectionId,
      });
    });
  }
}
