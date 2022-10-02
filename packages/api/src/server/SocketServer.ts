import { IncomingMessage } from "node:http";
import { WebSocketServer, WebSocket, RawData } from "ws";
import { singleton } from "tsyringe";
import { Logger } from "@battle-of-intertubes/logger";
import { Parser } from "@battle-of-intertubes/messaging";
import { RoomManager } from "./RoomManager";
import { Authentication } from "./Authentication";

@singleton()
export class SocketServer {
  private connectionCount = 0;
  private readonly port = parseInt(process.env.PORT!) || 8080;
  private readonly server: WebSocketServer;

  constructor(
    private readonly logger: Logger,
    private readonly roomManager: RoomManager,
    private readonly authentication: Authentication
  ) {
    this.server = new WebSocketServer({ port: this.port }, () =>
      this.logger.info(
        `Websocket server listening at ws://localhost:${this.port}`
      )
    );

    this.server.on("connection", this.handleConnection.bind(this));
  }

  private createConnectionId() {
    return String(this.connectionCount++);
  }

  private handleConnection(socket: WebSocket, req: IncomingMessage) {
    const connectionId = this.createConnectionId();

    this.logger.info("Client connected", {
      connectionId,
      url: req.url,
      ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
    });

    socket.on("close", () => {
      this.logger.info("Client disconnected", { connectionId });
    });

    const authTimeout = setTimeout(() => socket.close(), 60000);
    socket.once("message", (data) => {
      try {
        this.handleAuthorizationMessage(socket, connectionId, data);
      } catch (e) {
        this.logger.error("Error!", { connectionId, e });
        socket.close();
      } finally {
        clearTimeout(authTimeout);
      }
    });
  }

  public handleAuthorizationMessage(
    socket: WebSocket,
    connectionId: string,
    data: RawData
  ) {
    const message = Parser.parse(data.toString());

    if (message.type !== "connection-request") {
      this.logger.info("Invalid initial message type!", {
        connectionId,
        type: message.type,
      });
      socket.close();
      return;
    }

    const userName = this.authentication.authenticateUser(
      message.authorization
    );

    if (userName == null) {
      this.logger.info("Invalid credentials!", {
        connectionId,
        authorization: message.authorization,
      });
      socket.close();
      return;
    }

    this.roomManager.connectSocket(userName, message.room, socket);
  }
}
