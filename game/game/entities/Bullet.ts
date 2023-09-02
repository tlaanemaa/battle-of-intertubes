import { injectable } from "inversify";
import { container, factoryOf } from "@/game/container";
import { DEPENDENCIES, Entity } from "@/game/core";
import type { TextureLoader } from "@/game/core";
import { inject } from "inversify";

@injectable()
class Bullet extends Entity {
  public width = 25;
  public height = 25;
  public mass = 500;
  public dragCoefficient = 0.00001;
  public keepHeading = true;
  public readonly texture = this.textureLoader.load(
    "/img/red-rocket.png",
    50,
    50
  );

  constructor(
    @inject(DEPENDENCIES.TextureLoader)
    private readonly textureLoader: TextureLoader
  ) {
    super();
  }

  public init() {
    const speed = 2000;
    const rotationRad = (this.rotation * Math.PI) / 180;
    this.velocity = {
      x: speed * Math.sin(rotationRad),
      y: speed * -Math.cos(rotationRad),
    };
  }
}

export class BulletFactory extends factoryOf(Bullet) {}
container.bind(BulletFactory).toSelf();
