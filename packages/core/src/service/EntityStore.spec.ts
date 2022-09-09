import "reflect-metadata";
import { Entity } from "../model/Entity";
import { EntityStore } from "./EntityStore";

class MockEntity extends Entity {
  public texture = null!;
  public rotation = 0;
  public height = 1;
  public width = 1;

  constructor(public x: number = 0, public y: number = 0) {
    super();
  }
}

describe("EntityStore", () => {
  it("should set the entity", () => {
    const store = new EntityStore();
    const entity1 = new MockEntity();
    store.set(entity1);
    expect(store.getEntitiesAtAPoint(0, 0).pop()).toBe(entity1);
  });

  it("should move the entity away from its old location", () => {
    const store = new EntityStore();
    const entity1 = new MockEntity();
    store.set(entity1);
    expect(store.getEntitiesAtAPoint(0, 0).pop()).toBe(entity1);

    entity1.x = 27;
    entity1.y = 27;
    store.set(entity1);
    expect(store.getEntitiesAtAPoint(0, 0).pop()).toBeUndefined();
    expect(store.getEntitiesAtAPoint(27, 27).pop()).toBe(entity1);
  });

  it("should get entities at lower boundary", () => {
    const store = new EntityStore();
    const entity1 = new MockEntity(20, 20);
    store.set(entity1);
    expect(store.getEntitiesInAnArea(20, 20, 10, 10).pop()).toBe(entity1);
  });

  it("should get entities in an area", () => {
    const store = new EntityStore();
    const entity1 = new MockEntity(3, 7);
    const entity2 = new MockEntity(33, 43);

    store.set(entity1);
    store.set(entity2);
    const entities = store.getEntitiesInAnArea(2, 4, 32, 40);
    expect(entities.length).toBe(2);
    expect(entities[0]).toBe(entity1);
    expect(entities[1]).toBe(entity2);
  });

  it("should not get entities in upper borders", () => {
    const store = new EntityStore();
    const entity1 = new MockEntity(33, 40);

    store.set(entity1);
    expect(store.getEntitiesInAnArea(2, 4, 33, 36).pop()).toBeUndefined();
  });
});
