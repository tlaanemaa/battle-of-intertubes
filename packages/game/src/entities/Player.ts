import { inject, injectable } from "inversify";
import {
  AudioLoader,
  Camera,
  DEPENDENCIES,
  Entity,
  EntityStore,
  TextureLoader,
} from "@moose-rocket/core";
import { BulletFactory } from "./Bullet";
import { container } from "@moose-rocket/container";

@injectable()
export class Player extends Entity {
  public width = 100;
  public height = 100;
  public mass = 50;
  public dragCoefficient = 0.999;
  public keepHeading = true;
  public readonly texture = this.textureLoader.load(
    "img/hero1.png",
    this.width,
    this.height
  );

  private collisionSound = this.audioLoader.load("audio/big-pipe-hit.mp3");
  private shootingSound = this.audioLoader.load("audio/shotgun-firing.mp3");
  private lastShot = Date.now();

  constructor(
    private readonly camera: Camera,
    private readonly store: EntityStore,
    @inject(DEPENDENCIES.TextureLoader)
    private readonly textureLoader: TextureLoader,
    @inject(DEPENDENCIES.AudioLoader)
    private readonly audioLoader: AudioLoader,
    private readonly bulletFactory: BulletFactory
  ) {
    super();
    this.x = 0;
    this.y = 0;

    this.onCollision = () => this.collisionSound.play();
  }

  protected triggerOnChange(): void {
    this.setCamera();
    super.triggerOnChange();
  }

  private setCamera() {
    const margin =
      (Math.min(window.innerWidth, window.innerHeight) / this.camera.zoom) *
      0.3;
    const horizontalSpace = window.innerWidth / this.camera.zoom / 2 - margin;
    const verticalSpace = window.innerHeight / this.camera.zoom / 2 - margin;

    this.camera.position.x = Math.max(
      Math.min(this.camera.position.x, this.x + horizontalSpace),
      this.x - horizontalSpace
    );
    this.camera.position.y = Math.max(
      Math.min(this.camera.position.y, this.y + verticalSpace),
      this.y - verticalSpace
    );
  }

  public shoot() {
    const now = Date.now();
    if (now - this.lastShot < 50) return;
    this.lastShot = now;

    const rotationRad = (this.rotation * Math.PI) / 180;
    const bullet = this.bulletFactory.get();
    bullet.x = this.x + (this.width / 2 + 30) * Math.sin(rotationRad);
    bullet.y = this.y - (this.height / 2 + 30) * Math.cos(rotationRad);
    bullet.rotation = this.rotation;
    bullet.init();
    // bullet.onCollision = (target) => {
    //  if (!(target instanceof Bullet) && target !== this) {
    //    this.store.remove(bullet);
    //  }
    // };
    setTimeout(() => this.store.remove(bullet), 2000);
    this.store.add(bullet);
    this.shootingSound.play();
  }
}

container.bind(Player).toSelf().inSingletonScope();
