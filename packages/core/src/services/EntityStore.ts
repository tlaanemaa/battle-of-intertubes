import { injectable } from "inversify";
import { container } from "@moose-rocket/container";
import { Entity } from "../components";
import { Grid } from "../primitives";

@injectable()
export class EntityStore {
  private readonly store = new Grid<Entity>(1000);
  public getArea = this.store.getArea.bind(this.store);

  add(entity: Entity) {
    entity.onChange = () => this.store.set(entity);
    this.store.set(entity);
  }

  remove(entity: Entity) {
    entity.onChange = undefined;
    this.store.delete(entity);
  }
}

container.bind(EntityStore).toSelf().inSingletonScope();
