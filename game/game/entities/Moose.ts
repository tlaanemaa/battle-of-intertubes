import { container, factoryOf } from "@/game/container";
import { DEPENDENCIES, Entity } from "@/game/core";
import type { TextureLoader } from "@/game/core";
import { inject, injectable } from "inversify";

@injectable()
class Moose extends Entity {
  public readonly width = 70;
  public readonly height = 70;
  public rotation = 0;
  public children = undefined;
  public keepHeading = true;

  private images = [
    "/img/goat.png",
    "/img/moose.png",
    "/img/cat.png",
    "/img/monkey.png",
    "/img/red-rocket.png",
    "/img/herobrine.png",
  ];

  constructor(
    @inject(DEPENDENCIES.TextureLoader)
    private readonly textureLoader: TextureLoader
  ) {
    super();

    this.dragCoefficient = 0.0001;
    this.mass = 100;

    this.texturePath = this.images[Math.floor(Math.random() * this.images.length)]
    this.texture = this.textureLoader.load(
      this.texturePath,
      100,
      100
    );

    this.tick(10000);
    setInterval(() => this.tick(4000), 1000);
  }

  tick(forceBound: number) {
    this.applyForce({
      x: Math.random() * 2 * forceBound - forceBound - this.x / 2,
      y: Math.random() * 2 * forceBound - forceBound - this.y / 2,
    });
  }
}

export class MooseFactory extends factoryOf(Moose) {}
container.bind(MooseFactory).toSelf();
