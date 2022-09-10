import { singleton } from "tsyringe";
import { Collider, EntityStore } from "@battle-of-intertubes/core";
import { Moose } from "../entities/Moose";

@singleton()
export class Game {
  private entities = new Array(1000)
    .fill(1)
    .map(
      () =>
        new Moose(
          Math.round(Math.random() * 2000 - 1000),
          Math.round(Math.random() * 2000 - 1000)
        )
    );

  constructor(
    private readonly store: EntityStore,
    private readonly collider: Collider
  ) {}

  public start() {
    this.entities.map((entity) => this.store.set(entity));
  }

  public getEntitiesForRendering(
    x0: number,
    y0: number,
    x1: number,
    y1: number
  ) {
    const entities = this.store.getEntitiesInAnArea(x0, y0, x1, y1).map((e) => {
      e.recalculatePosition();
      this.store.set(e);
      return e;
    });

    this.collider.calculate(entities);
    return entities;
  }
}
