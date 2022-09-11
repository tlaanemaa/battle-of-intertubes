import { Object2D } from "./Object2D";
import { FastMap } from "./FastMap";

interface GridItem {
  id: string;
  x: number;
  y: number;
}

export class Grid<T extends GridItem> {
  private readonly grid: FastMap<FastMap<FastMap<T>>> = new FastMap();
  private readonly entityBoxCoordinates = new FastMap<Object2D>();

  constructor(private readonly boxSize = 10) {}

  public set(value: T): void {
    const boxX = Math.floor(value.x / this.boxSize);
    const boxY = Math.floor(value.y / this.boxSize);

    // No need to do anything if the object is still in the same box
    const currentBoxCoordinates = this.entityBoxCoordinates.get(value.id);
    if (
      currentBoxCoordinates != null &&
      currentBoxCoordinates.x === boxX &&
      currentBoxCoordinates.y === boxY
    ) {
      return;
    }

    // Cleanup old position
    this.delete(value);

    // Add containers if they don't exist
    if (!this.grid.has(boxX)) {
      this.grid.set(boxX, new FastMap());
    }
    if (!this.grid.get(boxX)!.has(boxY)) {
      this.grid.get(boxX)!.set(boxY, new FastMap());
    }

    // Set new position
    this.grid.get(boxX)?.get(boxY)?.set(value.id, value);
    this.entityBoxCoordinates.set(value.id, { x: boxX, y: boxY });
  }

  public delete(value: T): void {
    const position = this.entityBoxCoordinates.get(value.id);

    if (
      position != null &&
      this.grid.has(position.x) &&
      this.grid.get(position.x)!.has(position.y)
    ) {
      this.grid.get(position.x)!.get(position.y)!.delete(value.id);

      if (this.grid.get(position.x)!.get(position.y)!.isEmpty()) {
        this.grid.get(position.x)!.delete(position.y);

        if (this.grid.get(position.x)!.isEmpty()) {
          this.grid.delete(position.x);
        }
      }
    }

    this.entityBoxCoordinates.delete(value.id);
  }

  public getPoint(x: number, y: number): T[] {
    return this.getArea(x, y, 1, 1);
  }

  public getArea(x0: number, y0: number, x1: number, y1: number): T[] {
    const xStart = Math.floor(x0 / this.boxSize);
    const yStart = Math.floor(y0 / this.boxSize);
    const xEnd = Math.floor(x1 / this.boxSize);
    const yEnd = Math.floor(y1 / this.boxSize);
    const entities: T[] = [];

    for (let i = xStart; i <= xEnd; i++) {
      const row = this.grid.get(i);
      if (!row) continue;
      for (let j = yStart; j <= yEnd; j++) {
        const column = row.get(j);
        if (!column) continue;
        const entitiesCount = column.size;
        const entitiesInTheBox = column.values();
        for (let e = 0; e < entitiesCount; e++) {
          entities.push(entitiesInTheBox[e]);
        }
      }
    }

    return entities;
  }
}
