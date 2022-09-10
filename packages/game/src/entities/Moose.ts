import { Entity, Texture } from "@battle-of-intertubes/core";

export class Moose extends Entity {
  public readonly texture: Texture;
  public readonly height = 100;
  public readonly width = 100;
  public rotation = 0;
  public children = undefined;

  private images = [
    "img/goat.png",
    "img/moose.png",
    "img/cat.png",
    "img/monkey.png",
    "img/red-rocket.png",
    "img/herobrine.png",
  ];

  constructor(public x: number = 0, public y: number = 0) {
    super();
    this.dragCoefficient = 0.01;
    this.mass = 100;

    this.texture = new Texture(
      this.images[Math.floor(Math.random() * this.images.length)]
    );

    this.tick(10000);
    setInterval(() => this.tick(1000), 100);
  }

  tick(forceBound = 100) {
    this.applyForce({
      x: Math.random() * 2 * forceBound - forceBound,
      y: Math.random() * 2 * forceBound - forceBound,
    });
    // this.rotation = this.getHeading();
  }
}
