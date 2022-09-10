import { singleton } from "tsyringe";
import { Entity } from "../model/Entity";
import { FastMap } from "../model/FastMap";
import { Grid } from "../model/Grid";

@singleton()
export class EntityStore {
  private readonly grid = new Grid<Entity>();
  private readonly entityMap = new FastMap<Entity>();

  public set(entity: Entity) {
    this.grid.set(entity);
    this.entityMap.set(entity.id, entity);
  }

  public delete(entity: Entity) {
    this.grid.delete(entity);
    this.entityMap.delete(entity.id);
  }

  public getEntitiesInAnArea(
    x0: number,
    y0: number,
    x1: number,
    y1: number
  ): Entity[] {
    return this.grid.getArea(x0, y0, x1, y1);
  }

  public getEntitiesAtAPoint(x: number, y: number): Entity[] {
    return this.getEntitiesInAnArea(x, y, x + 1, y + 1);
  }

  public getById(id: string): Entity | undefined {
    return this.entityMap.get(id);
  }

  public getAll(): Entity[] {
    return Array.from(this.entityMap.values());
  }
}
