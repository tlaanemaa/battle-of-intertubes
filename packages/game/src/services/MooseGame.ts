import { inject, injectable } from "inversify";
import {
  EntityStore,
  Camera,
  GameRunner,
  UserInput,
  INTENT,
  Game,
  DEPENDENCIES,
} from "@moose-rocket/core";
import { MooseFactory } from "../entities/Moose";
import { Player } from "../entities/Player";
import { container } from "@moose-rocket/container";

@injectable()
export class MooseGame implements Game {
  constructor(
    @inject(DEPENDENCIES.UserInput)
    private readonly userInput: UserInput,
    private readonly camera: Camera,
    private readonly gameRunner: GameRunner,
    private readonly store: EntityStore,
    private readonly player: Player,
    private readonly mooseFactory: MooseFactory
  ) {}

  init() {
    this.store.add(this.player);
    const spaceFactor = 3;
    const count = 1000;
    new Array(count).fill(1).map(() => {
      const moose = this.mooseFactory.get();
      moose.x = Math.round(
        Math.random() * count * spaceFactor * 2 - count * spaceFactor
      );
      moose.y = Math.round(
        Math.random() * count * spaceFactor * 2 - count * spaceFactor
      );

      this.store.add(moose);
      return moose;
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

container.bind(DEPENDENCIES.Game).to(MooseGame).inSingletonScope();
