import { Entity } from "@moose-rocket/core";
import { Player } from "./Player";

export class Moose extends Entity {
  public readonly width = 70;
  public readonly height = 70;
  public rotation = 0;
  public children = undefined;
  public keepHeading = true;

  private images = [
    "img/goat.png",
    "img/moose.png",
    "img/cat.png",
    "img/monkey.png",
    "img/red-rocket.png",
    "img/herobrine.png",
  ];

  constructor(x: number = 0, y: number = 0, private readonly player: Player) {
    super();
    this.x = x;
    this.y = y;
    this.dragCoefficient = 0.0001;
    this.mass = 100;

    this.texture = this.textureLoader.load(
      this.images[Math.floor(Math.random() * this.images.length)],
      100,
      100
    );

    this.tick(10000);
    setInterval(() => this.tick(4000), 1000);
  }

  tick(forceBound: number) {
    this.applyForce({
      x:
        Math.random() * 2 * forceBound -
        forceBound -
        (this.x - this.player.x) / 2,
      y:
        Math.random() * 2 * forceBound -
        forceBound -
        (this.y - this.player.y) / 2,
    });
  }
}
