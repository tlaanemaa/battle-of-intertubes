import { Entity, Texture } from "@battle-of-intertubes/core";

export class Bullet extends Entity {
  public width = 25;
  public height = 25;
  public mass = 500;
  public dragCoefficient = 0.00001;
  public keepHeading = true;
  public readonly texture = new Texture(50, 50, "img/red-rocket.png");

  constructor(x: number, y: number, rotation: number) {
    super();
    this.x = x;
    this.y = y;
    this.rotation = rotation;

    const speed = 2000;
    const rotationRad = (this.rotation * Math.PI) / 180;
    this.velocity = {
      x: speed * Math.sin(rotationRad),
      y: speed * -Math.cos(rotationRad),
    };
  }
}
