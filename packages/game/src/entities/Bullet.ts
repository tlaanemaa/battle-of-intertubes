import { Entity, Texture } from "@battle-of-intertubes/core";

export class Bullet extends Entity {
  public readonly texture = new Texture(this.width, this.height, "img/red-rocket.png");
  public width = 50;
  public height = 50;
  public mass = 500;
  public dragCoefficient = 0.00001;
  public keepHeading = true;

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
