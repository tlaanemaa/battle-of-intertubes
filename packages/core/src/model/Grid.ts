import { Object2D } from "../types/interfaces";
import { FastMap } from "./FastMap";

interface GridItem {
  id: string;
  x: number;
  y: number;
}

export class Grid<T extends GridItem> {
  private readonly grid: FastMap<T>[][] = [];
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
    if (this.grid[boxX] == null) this.grid[boxX] = [];
    if (this.grid[boxX][boxY] == null) this.grid[boxX][boxY] = new FastMap();

    // Set new position
    this.grid[boxX][boxY].set(value.id, value);
    this.entityBoxCoordinates.set(value.id, { x: boxX, y: boxY });
  }

  public delete(value: T): void {
    const position = this.entityBoxCoordinates.get(value.id);

    if (
      position != null &&
      this.grid[position.x] != null &&
      this.grid[position.x][position.y] != null
    ) {
      this.grid[position.x][position.y].delete(value.id);

      if (this.grid[position.x][position.y].size === 0) {
        this.grid[position.x].splice(position.y, 1);

        if (this.grid[position.x].length === 0) {
          this.grid.splice(position.x, 1);
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
    const xEnd = Math.ceil(x1 / this.boxSize);
    const yEnd = Math.ceil(y1 / this.boxSize);
    const entities: T[] = [];

    for (let i = xStart; i < xEnd; i++) {
      if (this.grid[i] == null) continue;
      for (let j = yStart; j < yEnd; j++) {
        if (this.grid[i][j] == null) continue;
        const entitiesInTheBox = this.grid[i][j].values();
        const entitiesCount = entitiesInTheBox.length;
        for (let e = 0; e < entitiesCount; e++) {
          entities.push(entitiesInTheBox[e]);
        }
      }
    }

    return entities;
  }
}
