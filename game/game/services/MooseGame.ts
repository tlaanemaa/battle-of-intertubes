import { injectable } from "inversify";
import {
  EntityStore,
  GameRunner,
  Game,
  DEPENDENCIES,
  Entity,
} from "@/game/core";
import { MooseFactory } from "../entities/Moose";
import { container } from "@/game/container";

// TODO: Solve the hacks in here that make the moose follow the player
@injectable()
export class MooseGame implements Game {
  private playerId?: string

  constructor(
    private readonly gameRunner: GameRunner,
    private readonly store: EntityStore,
    private readonly mooseFactory: MooseFactory,
  ) { }

  addPlayer(player: Entity): void {
    this.playerId = player.id;
    this.store.add(player);
  }

  removePlayer(player: Entity): void {
    this.store.remove(player);
  }

  init() {
    const spaceFactor = 3;
    const count = 200;
    new Array(count).fill(1).map(() => {
      const moose = this.mooseFactory.get();
      moose.x = Math.round(
        Math.random() * count * spaceFactor * 2 - count * spaceFactor,
      );
      moose.y = Math.round(
        Math.random() * count * spaceFactor * 2 - count * spaceFactor,
      );

      this.store.add(moose);
      setInterval(() => {
        const forceMultiplier = 2;
        if (!this.playerId) return;
        const player = this.store.getByID(this.playerId);
        if (!player) return;
        const offsetX = (player.x - moose.x) * forceMultiplier;
        const offsetY = (player.y - moose.y) * forceMultiplier;
        moose.applyForce({ x: offsetX, y: offsetY });
      }, 1000)
      return moose;
    });

    this.gameRunner.start();
  }
}

container.bind(DEPENDENCIES.Game).to(MooseGame).inSingletonScope();
