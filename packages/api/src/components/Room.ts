import { v4 as uuidV4 } from "uuid";
import { WebSocket } from "ws";
import { FastMap, Game } from "@battle-of-intertubes/core";
import { PlayerSocket } from "./PlayerSocket";
import { container } from "tsyringe";

export class Room {
  private readonly members = new FastMap<PlayerSocket>();
  //private readonly game = container.resolve<Game>("Game");

  constructor(private readonly id: string = uuidV4()) {
    //this.game.init();
  }

  join(socket: WebSocket) {
    const playerSocket = new PlayerSocket(socket);
    this.members.set(playerSocket.id, playerSocket);
  }
}
