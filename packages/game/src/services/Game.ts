import { singleton } from "tsyringe";
import { Collider, EntityStore } from "@battle-of-intertubes/core";
import { Moose } from "../entities/Moose";

@singleton()
export class Game {
  private entities = new Array(10).fill(1).map(() => new Moose());

  constructor(
    private readonly store: EntityStore,
    private readonly collider: Collider
  ) {}

  public start() {
    this.entities.map((entity) => this.store.set(entity));
    //setInterval(() => this.collider.calculate(), 100);
  }

  public getEntitiesForRendering(
    x: number,
    y: number,
    width: number,
    height: number
  ) {
    this.store.getEntitiesInAnArea(x, y, width, height).forEach((e) => {
      e.recalculatePosition();
      this.store.set(e);
    });

    //return this.entities;
    // return this.store.getAll();
    const entities = this.store.getEntitiesInAnArea(x, y, width, height);
    console.log("To render", entities);
    return entities;
  }
}
