import { Entity } from "../components";

export interface Game {
  init(): void;
  addPlayer(player: Entity): void;
  removePlayer(player: Entity): void;
}
