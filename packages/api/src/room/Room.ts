import "reflect-metadata";
import { MessagePort } from "node:worker_threads";
import { container } from "tsyringe";
import {
  AnyMessage,
  FastMap,
  Game,
  Parser,
  StateUpdateMessage,
} from "@battle-of-intertubes/core";

/**
 * Each Room will be executed on a new worker thread
 */
export class Room {
  //private readonly game = container.resolve<Game>("Game");

  constructor(private readonly id: string) {
    //this.game.init();
  }

  onConnect(userId: string, port: MessagePort) {
    port.postMessage(new StateUpdateMessage().serialize());

    port.on("message", (data) => {
      const message = Parser.parse(data);
      console.log(message);
      port.postMessage(new StateUpdateMessage().serialize());
    });
  }
}
