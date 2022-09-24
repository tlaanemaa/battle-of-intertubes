import { v4 as uuidV4 } from "uuid";
import { WebSocket } from "ws";
import { FastMap } from "@battle-of-intertubes/core";
import { PlayerSocket } from "./PlayerSocket";

export class Room {
  private readonly members = new FastMap<PlayerSocket>();

  constructor(private readonly id: string = uuidV4()) {}

  join(socket: WebSocket) {
    const playerSocket = new PlayerSocket(socket);
    this.members.set(playerSocket.id, playerSocket);
  }
}
