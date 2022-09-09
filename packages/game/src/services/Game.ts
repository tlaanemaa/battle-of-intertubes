import { singleton } from "tsyringe";
import { Collider, EntityStore } from "@battle-of-intertubes/core";
import { Moose } from "../entities/Moose";

@singleton()
export class Game {
  constructor(
    private readonly store: EntityStore,
    private readonly collider: Collider
  ) {}

  public start() {
    new Array(2000)
      .fill(1)
      .map(() => new Moose())
      .map((entity) => this.store.register(entity));

    setInterval(() => this.collider.calculate(), 100);
  }

  public getEntitiesForRendering(
    windowX: number,
    windowY: number,
    windowWidth: number,
    windowHeight: number
  ) {
    return this.store.getAll();
    return this.store.getEntitiesInAnArea(
      windowX,
      windowY,
      windowWidth,
      windowHeight
    );
  }
}
