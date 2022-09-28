import { singleton } from "tsyringe";
import { WebSocket } from "ws";
import { AnyMessage, FastMap } from "@battle-of-intertubes/core";

@singleton()
export class ConnectionStore {
  private readonly connections = new FastMap<WebSocket>();

  public register(id: string, socket: WebSocket) {
    this.connections.set(id, socket);
  }

  public deregister(id: string) {
    this.connections.delete(id);
  }

  public sendMessage(id: string, message: AnyMessage) {
    const socket = this.connections.get(id);
    if (socket) socket.send(message.serialize());
  }
}
