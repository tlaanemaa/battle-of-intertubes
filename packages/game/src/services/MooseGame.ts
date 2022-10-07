import { injectable } from "inversify";
import {
  EntityStore,
  GameRunner,
  Game,
  DEPENDENCIES,
  Entity,
} from "@moose-rocket/core";
import { MooseFactory } from "../entities/Moose";
import { container } from "@moose-rocket/container";

@injectable()
export class MooseGame implements Game {
  constructor(
    private readonly gameRunner: GameRunner,
    private readonly store: EntityStore,
    private readonly mooseFactory: MooseFactory
  ) {}

  addPlayer(player: Entity): void {
    this.store.add(player);
  }

  removePlayer(player: Entity): void {
    this.store.remove(player);
  }

  init() {
    const spaceFactor = 3;
    const count = 10;
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

    this.gameRunner.start();
  }
}

container.bind(DEPENDENCIES.Game).to(MooseGame).inSingletonScope();
