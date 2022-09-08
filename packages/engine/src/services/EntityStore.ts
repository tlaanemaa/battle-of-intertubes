import { singleton } from "tsyringe";
import { Entity } from "../core/Entity";

@singleton()
export class EntityStore {
  private readonly grid: Map<string, Entity>[][] = [];
  private readonly entityMaps = new Map<string, Map<string, Entity>>();

  public set(object: Entity) {
    const x = Math.round(object.x);
    const y = Math.round(object.y);
    if (this.grid[x] == null) this.grid[x] = [];
    if (this.grid[x][y] == null) this.grid[x][y] = new Map();

    this.entityMaps.get(object.id)?.delete(object.id);
    this.grid[x][y].set(object.id, object);
    this.entityMaps.set(object.id, this.grid[x][y]);
  }

  public getInPoint(x: number, y: number): Entity[] {
    if (this.grid[x] != null && this.grid[x][y] != null) {
      return Array.from(this.grid[x][y].values());
    }
    return [];
  }

  public getInArea(
    x: number,
    y: number,
    width: number,
    height: number
  ): Entity[] {
    const entities: Entity[][] = [];
    const xBound = x + width;
    const yBound = y + height;

    for (let i = x; i < xBound; i++) {
      for (let j = y; j < yBound; j++) {
        entities.push(this.getInPoint(i, j));
      }
    }

    return entities.flat(1);
  }

  public getById(id: string): Entity | undefined {
    return this.entityMaps.get(id)?.get(id);
  }
}
