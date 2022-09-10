import { singleton } from "tsyringe";
import { Collider, EntityStore } from "@battle-of-intertubes/core";
import { Moose } from "../entities/Moose";

@singleton()
export class Game {
  private spaceFactor = 5;
  private count = 1000;

  private entities = new Array(this.count)
    .fill(1)
    .map(
      () =>
        new Moose(
          Math.round(
            Math.random() * this.count * this.spaceFactor * 2 -
              this.count * this.spaceFactor
          ),
          Math.round(
            Math.random() * this.count * this.spaceFactor * 2 -
              this.count * this.spaceFactor
          )
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
      e.rotation = e.getHeading();
      this.store.set(e);
      return e;
    });

    this.collider.calculate(entities);
    return entities;
  }
}
