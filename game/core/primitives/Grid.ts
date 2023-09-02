import { Object2D } from "./Object2D";
import { FastMap } from "./FastMap";

interface GridItem {
  id: string;
  x: number;
  y: number;
}

export class Grid<T extends GridItem> {
  private readonly grid: FastMap<FastMap<FastMap<T>>> = new FastMap();
  private readonly itemBoxCoordinates = new FastMap<Object2D>();
  private readonly allItems = new FastMap<T>();

  constructor(private readonly boxSize = 10) {}

  public set(item: T): void {
    const boxX = Math.floor(item.x / this.boxSize);
    const boxY = Math.floor(item.y / this.boxSize);

    // No need to do anything if the object is still in the same box
    const currentBoxCoordinates = this.itemBoxCoordinates.get(item.id);
    if (
      currentBoxCoordinates != null &&
      currentBoxCoordinates.x === boxX &&
      currentBoxCoordinates.y === boxY
    ) {
      return;
    }

    // Cleanup old position
    this.delete(item);

    // Add containers if they don't exist
    if (!this.grid.has(boxX)) {
      this.grid.set(boxX, new FastMap());
    }
    if (!this.grid.get(boxX)!.has(boxY)) {
      this.grid.get(boxX)!.set(boxY, new FastMap());
    }

    // Set new position
    this.grid.get(boxX)?.get(boxY)?.set(item.id, item);
    this.itemBoxCoordinates.set(item.id, { x: boxX, y: boxY });
    this.allItems.set(item.id, item);
  }

  public delete(item: T): void {
    const position = this.itemBoxCoordinates.get(item.id);

    if (
      position != null &&
      this.grid.has(position.x) &&
      this.grid.get(position.x)!.has(position.y)
    ) {
      this.grid.get(position.x)!.get(position.y)!.delete(item.id);

      if (this.grid.get(position.x)!.get(position.y)!.isEmpty()) {
        this.grid.get(position.x)!.delete(position.y);

        if (this.grid.get(position.x)!.isEmpty()) {
          this.grid.delete(position.x);
        }
      }
    }

    this.itemBoxCoordinates.delete(item.id);
    this.allItems.delete(item.id);
  }

  public getId(id: string) {
    return this.allItems.get(id);
  }

  public getPoint(x: number, y: number): T[] {
    return this.getArea(x, y, 1, 1);
  }

  public getArea(x0: number, y0: number, x1: number, y1: number): T[] {
    const xStart = Math.floor(x0 / this.boxSize);
    const yStart = Math.floor(y0 / this.boxSize);
    const xEnd = Math.floor(x1 / this.boxSize);
    const yEnd = Math.floor(y1 / this.boxSize);
    const items: T[] = [];

    for (let i = xStart; i <= xEnd; i++) {
      const row = this.grid.get(i);
      if (!row) continue;
      for (let j = yStart; j <= yEnd; j++) {
        const column = row.get(j);
        if (!column) continue;
        const itemCount = column.size;
        const itemsInTheBox = column.values();
        for (let e = 0; e < itemCount; e++) {
          items.push(itemsInTheBox[e]);
        }
      }
    }

    return items;
  }
}
