import { Grid } from "./Grid";

const range = (from: number, to: number) => {
  const values: number[] = [];
  for (let i = from; i <= to; i++) {
    values.push(i);
  }
  return values;
};

describe("Grid", () => {
  describe("set", () => {
    it("should set an item", () => {
      const grid = new Grid(10);
      const item = { id: "a", x: 0, y: 0 };

      grid.set(item);
      expect(grid.getPoint(0, 0)[0]).toBe(item);
    });

    it("should remove the previous position if the item was already set", () => {
      const grid = new Grid(10);
      const item = { id: "a", x: 0, y: 0 };

      grid.set(item);
      expect(grid.getPoint(0, 0)[0]).toBe(item);

      item.x = 20;
      item.y = 20;
      grid.set(item);
      expect(grid.getPoint(0, 0)[0]).toBeUndefined();
    });
  });

  describe("delete", () => {
    it("should delete the item", () => {
      const grid = new Grid(10);
      const item = { id: "a", x: 0, y: 0 };

      grid.set(item);
      expect(grid.getPoint(0, 0)[0]).toBe(item);

      grid.delete(item);
      expect(grid.getPoint(0, 0)[0]).toBeUndefined();
    });
  });

  describe("getArea", () => {
    it("should get items on the left boundary when boxSize is 10", () => {
      const grid = new Grid(10);
      grid.set({ id: "a", x: 0, y: 0 });
      grid.set({ id: "b", x: -2, y: 0 });
      grid.set({ id: "c", x: 2, y: 0 });

      expect(grid.getArea(0, 0, 10, 10)[0]).toEqual({ id: "a", x: 0, y: 0 });
      expect(grid.getArea(0, 0, 10, 10)[1]).toEqual({ id: "c", x: 2, y: 0 });
      expect(grid.getArea(0, 0, 10, 10)[2]).toBeUndefined();
    });

    it("should get items on the right boundary when boxSize is 10 but area is smaller", () => {
      const grid = new Grid(10);
      grid.set({ id: "a", x: 0, y: 0 });
      grid.set({ id: "b", x: -2, y: 0 });
      grid.set({ id: "c", x: 9, y: 9 });

      expect(grid.getArea(0, 0, 1, 1)[0]).toEqual({ id: "a", x: 0, y: 0 });
      expect(grid.getArea(0, 0, 1, 1)[1]).toEqual({ id: "c", x: 9, y: 9 });
      expect(grid.getArea(0, 0, 1, 1)[2]).toBeUndefined();
    });

    // This test takes super long, but its a good one for some times
    xit("should get only the items in the area when boxSize is 10", () => {
      const grid = new Grid(10);
      const items = range(-100, 100).map((x) => {
        return range(-100, 100).map((y) => {
          const item = { id: `${x}_${y}`, x, y };
          grid.set(item);
          return item;
        });
      });

      // Considering box size of 10 (rounded down), the returned space should be -80, -60, 49, 99
      const result = grid.getArea(-73, -52, 47, 92);
      items.forEach((row) =>
        row.forEach((item) => {
          if (item.x >= -80 && item.x <= 49 && item.y >= -60 && item.y <= 99) {
            expect(result).toContain(item);
          } else {
            expect(result).not.toContain(item);
          }
        }),
      );
    });

    it("should get only the items in the area when boxSize is 3", () => {
      const grid = new Grid(3);
      const items = range(-10, 10).map((x) => {
        return range(-10, 10).map((y) => {
          const item = { id: `${x}_${y}`, x, y };
          grid.set(item);
          return item;
        });
      });

      // Considering box size of 3 (rounded down), the returned space should be -9, -6, 5, 11
      const result = grid.getArea(-7, -5, 4, 9);
      items.forEach((row) =>
        row.forEach((item) => {
          if (item.x >= -9 && item.x <= 5 && item.y >= -6 && item.y <= 11) {
            expect(result).toContain(item);
          } else {
            expect(result).not.toContain(item);
          }
        }),
      );
    });
  });
});
