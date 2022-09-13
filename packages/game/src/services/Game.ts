import { singleton } from "tsyringe";
import { Collider, EntityStore } from "@battle-of-intertubes/core";
import { Moose } from "../entities/Moose";

@singleton()
export class Game {
  private spaceFactor = 3;
  private count = 2000;

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
    const entities = this.store.getEntitiesInAnArea(x0, y0, x1, y1);
    this.collider.calculate(entities);
    entities.map((e) => {
      e.setRotation(e.getHeading());
      e.recalculatePosition();
      this.store.set(e);
      return e;
    });

    return entities;
  }
}
