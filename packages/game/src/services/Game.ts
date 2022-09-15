import { Collider, Entity, Grid } from "@battle-of-intertubes/core";
import { Moose } from "../entities/Moose";
import { Player } from "../entities/Player";

export class Game {
  private spaceFactor = 3;
  private count = 1000;
  private store = new Grid<Entity>(1000);

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

  constructor() {}

  public start() {
    this.entities.map((entity) => this.store.set(entity));
    this.store.set(new Player());
  }

  public getEntitiesForRendering(
    x0: number,
    y0: number,
    x1: number,
    y1: number
  ) {
    const entities = this.store.getArea(x0, y0, x1, y1);

    const collider = new Collider(entities);
    collider.calculate();

    entities.map((e) => {
      e.setRotation(e.getHeading());
      e.recalculatePosition();
      this.store.set(e);
      return e;
    });

    return entities;
  }
}
