import "reflect-metadata";
import { MessagePort } from "node:worker_threads";
import { injectable } from "inversify";
import "@moose-rocket/game";
import {
  AnyMessage,
  ConnectionApprovedMessage,
  Parser,
  StateUpdateMessage,
} from "@moose-rocket/messaging";
import "./components";
import { container } from "@moose-rocket/container";
import { Application } from "./Application";

/**
 * Each Room will be executed on a new worker thread
 */
@injectable()
export class Room {
  private readonly players = new Map<string, MessagePort>();
  private readonly application = container.get(Application);

  constructor(private readonly id: string) {
    setInterval(() => this.sendGameState(), 500);
  }

  public onConnect(playerId: string, port: MessagePort) {
    port.on("close", () => this.handlePlayerLeave(playerId));
    port.on("message", (data) => {
      try {
        this.handlePlayerMessage(playerId, port, Parser.parse(data));
      } catch (e) {
        console.error(e);
      }
    });

    this.players.set(playerId, port);
    this.application.createPlayer(playerId);
    port.postMessage(new ConnectionApprovedMessage(this.id).serialize());
  }

  private handlePlayerMessage(
    playerId: string,
    port: MessagePort,
    message: AnyMessage
  ) {
    switch (message.type) {
      case "action-performed":
        this.application.onPlayerAction(playerId, message);
    }
  }

  private handlePlayerLeave(playerId: string) {
    this.application.removePlayer(playerId);
    this.players.delete(playerId);
  }

  private sendGameState() {
    const state = this.application.getState();
    const message = new StateUpdateMessage(state).serialize();
    this.players.forEach((port) => {
      port.postMessage(message);
    });
  }
}

container.bind(Room).toSelf();
