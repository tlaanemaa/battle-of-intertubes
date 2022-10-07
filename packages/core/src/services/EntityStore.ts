import { injectable } from "inversify";
import { container } from "@moose-rocket/container";
import { Entity } from "../components";
import { Grid } from "../primitives";

@injectable()
export class EntityStore {
  private readonly store = new Grid<Entity>(1000);
  public getArea = this.store.getArea.bind(this.store);

  public add(entity: Entity) {
    entity.onChange = () => this.store.set(entity);
    this.store.set(entity);
  }

  public remove(entity: Entity) {
    entity.onChange = undefined;
    this.store.delete(entity);
  }

  public getByID(id: string) {
    return this.store.getId(id);
  }
}

container.bind(EntityStore).toSelf().inSingletonScope();
