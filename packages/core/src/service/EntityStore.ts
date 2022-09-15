import { Entity } from "../model/Entity";
import { Grid } from "../model/Grid";

export class EntityStore extends Grid<Entity> {
  constructor() {
    super(1000);
  }
}
