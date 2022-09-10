import { singleton } from "tsyringe";
import { Entity } from "../model/Entity";
import { FastMap } from "../model/FastMap";
import { Object2D } from "../types/interfaces";

@singleton()
export class EntityStore {
  private readonly boxSize = 10;

  private readonly grid: FastMap<Entity>[][] = [];
  private readonly entityBoxCoordinates = new FastMap<Object2D>();
  private readonly entityMap = new FastMap<Entity>();

  public set(object: Entity) {
    const x = Math.floor(object.x / this.boxSize);
    const y = Math.floor(object.y / this.boxSize);

    // No need to do anything if the object is still in the same box
    const currentBoxCoordinates = this.entityBoxCoordinates.get(object.id);
    if (
      currentBoxCoordinates != null &&
      currentBoxCoordinates.x === x &&
      currentBoxCoordinates.y === y
    ) {
      return;
    }

    // Cleanup old position
    this.delete(object.id);

    // Add containers if they don't exist
    if (this.grid[x] == null) this.grid[x] = [];
    if (this.grid[x][y] == null) this.grid[x][y] = new FastMap();

    // Set new position
    this.grid[x][y].set(object.id, object);
    this.entityMap.set(object.id, object);
    this.entityBoxCoordinates.set(object.id, { x, y });
  }

  public delete(id: string) {
    const position = this.entityBoxCoordinates.get(id);

    if (
      position != null &&
      this.grid[position.x] != null &&
      this.grid[position.x][position.y] != null
    ) {
      this.grid[position.x][position.y].delete(id);

      if (this.grid[position.x][position.y].size === 0) {
        this.grid[position.x].splice(position.y, 1);

        if (this.grid[position.x].length === 0) {
          this.grid.splice(position.x, 1);
        }
      }
    }

    this.entityMap.delete(id);
    this.entityBoxCoordinates.delete(id);
  }

  public getEntitiesInAnArea(
    x: number,
    y: number,
    width: number,
    height: number
  ): Entity[] {
    const xStart = Math.floor(x / this.boxSize);
    const yStart = Math.floor(y / this.boxSize);
    const xEnd = Math.ceil((x + width) / this.boxSize);
    const yEnd = Math.ceil((y + height) / this.boxSize);
    const entities: Entity[][] = [];

    for (let i = xStart; i < xEnd; i++) {
      if (this.grid[i] == null) continue;
      for (let j = yStart; j < yEnd; j++) {
        if (this.grid[i][j] == null) continue;
        entities.push(Array.from(this.grid[i][j].values()));
      }
    }

    return entities.flat(1);
  }

  public getEntitiesAtAPoint(x: number, y: number): Entity[] {
    return this.getEntitiesInAnArea(x, y, 1, 1);
  }

  public getById(id: string): Entity | undefined {
    return this.entityMap.get(id);
  }

  public getAll(): Entity[] {
    return Array.from(this.entityMap.values());
  }

  public register(entity: Entity) {
    entity.onMove(() => this.set(entity));
    this.set(entity);
  }

  public deregister(entity: Entity) {
    entity.onMove(null);
    this.delete(entity.id);
  }
}
