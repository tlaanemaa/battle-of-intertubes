import "reflect-metadata";
import { container } from "tsyringe";
import {
  AnyMessage,
  FastMap,
  Game,
  StateUpdateMessage,
} from "@battle-of-intertubes/core";
import { SendMessage } from "./types";

/**
 * Each Room will be executed on a new worker thread
 */
export class Room {
  //private readonly game = container.resolve<Game>("Game");

  constructor(
    private readonly id: string,
    private readonly sendMessage: SendMessage
  ) {
    //this.game.init();
  }

  onMessage(connectionId: string, message: AnyMessage) {
    console.log(connectionId, message);
    this.sendMessage(connectionId, new StateUpdateMessage());
  }
}
