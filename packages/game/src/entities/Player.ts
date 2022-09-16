import { Entity, Texture } from "@battle-of-intertubes/core";

export class Player extends Entity {
  public readonly texture = new Texture("img/hero1.png");
  public height = 100;
  public width = 100;
  public mass = 1;

  constructor() {
    super();
    this.x = 0;
    this.y = 0;
  }
}
