import { inject, singleton } from "tsyringe";
import {
  EntityStore,
  Camera,
  GameRunner,
  UserInput,
  INTENT,
  Game,
} from "@moose-rocket/core";
import { Moose } from "../entities/Moose";
import { Player } from "../entities/Player";

@singleton()
export class MooseGame implements Game {
  constructor(
    @inject("UserInput")
    private readonly userInput: UserInput,
    private readonly camera: Camera,
    private readonly gameRunner: GameRunner,
    private readonly store: EntityStore,
    private readonly player: Player
  ) {}

  init() {
    this.store.add(this.player);
    const spaceFactor = 3;
    const count = 1000;
    new Array(count).fill(1).map(() => {
      const entity = new Moose(
        Math.round(
          Math.random() * count * spaceFactor * 2 - count * spaceFactor
        ),
        Math.round(
          Math.random() * count * spaceFactor * 2 - count * spaceFactor
        ),
        this.player
      );

      this.store.add(entity);
      return entity;
    });

    this.userInput.on(INTENT.ZOOM_IN, (x) => {
      this.camera.zoom *= 1 + x / 1000;
    });
    this.userInput.on(INTENT.ZOOM_OUT, (x) => {
      this.camera.zoom *= 1 - x / 1000;
    });

    this.userInput.on(INTENT.MOVE_UP, (x) => {
      this.player.applyForce({ x: 0, y: -x * this.player.mass * 10 });
    });
    this.userInput.on(INTENT.MOVE_RIGHT, (x) => {
      this.player.applyForce({ x: x * this.player.mass * 10, y: 0 });
    });
    this.userInput.on(INTENT.MOVE_DOWN, (x) => {
      this.player.applyForce({ x: 0, y: x * this.player.mass * 10 });
    });
    this.userInput.on(INTENT.MOVE_LEFT, (x) => {
      this.player.applyForce({ x: -x * this.player.mass * 10, y: 0 });
    });
    this.userInput.on(INTENT.SHOOT, () => {
      this.player.shoot();
    });

    this.gameRunner.start();
  }
}
