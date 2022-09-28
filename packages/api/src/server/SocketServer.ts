import { IncomingMessage } from "http";
import { singleton } from "tsyringe";
import { WebSocketServer, WebSocket } from "ws";
import { Logger } from "@battle-of-intertubes/logger";
import { RoomManager } from "./RoomManager";
import { KeyHandler, Parser } from "@battle-of-intertubes/core";
import { ConnectionStore } from "./ConnectionStore";

@singleton()
export class SocketServer {
  private connectionCount = 0;
  private readonly port = parseInt(process.env.PORT!) || 8080;
  private readonly server?: WebSocketServer;

  constructor(
    private readonly logger: Logger,
    private readonly connectionStore: ConnectionStore,
    private readonly roomManager: RoomManager
  ) {
    this.server = new WebSocketServer({ port: this.port }, () =>
      this.logger.info(
        `Websocket server listening at ws://localhost:${this.port}`
      )
    );
    this.server.on("connection", this.handleConnection.bind(this));
  }

  private handleConnection(socket: WebSocket, req: IncomingMessage) {
    let connectionAuthorized = false;
    const connectionId = String(this.connectionCount++);
    this.connectionStore.register(connectionId, socket);

    this.logger.info("Client connected", {
      connectionId,
      url: req.url,
      ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
    });

    socket.on("message", (data) => {
      const message = Parser.parse(data.toString());
      try {
        if (message.type === "connection-request") {
          connectionAuthorized = KeyHandler.keyIsValid(message.key);
        }
        if (!connectionAuthorized) return;

        this.roomManager.handleMessage(connectionId, message);
      } catch (e) {
        console.error(e);
        socket.close();
      }
    });

    socket.on("close", () => {
      this.connectionStore.deregister(connectionId);
      this.roomManager.handleDisconnect(connectionId);

      this.logger.info("Client disconnected", {
        connectionId,
      });
    });
  }
}
