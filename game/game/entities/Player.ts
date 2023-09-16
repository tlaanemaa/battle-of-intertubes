import { inject, injectable } from "inversify";
import {
  Camera,
  DEPENDENCIES,
  Entity,
  EntityStore,
  INTENT,
  Object2D,
  UserInput,
} from "@/game/core";
import type { TextureLoader, AudioLoader } from "@/game/core";
import { BulletFactory } from "./Bullet";
import { container, factoryOf } from "@/game/container";

@injectable()
export class Player extends Entity {
  public width = 1;
  public height = 1;
  public mass = 50;
  public dragCoefficient = 0.999;
  public keepHeading = true;
  public readonly texturePath = "/img/hero1.png";
  public readonly texture = this.textureLoader.load(
    "/img/hero1.png",
    this.width,
    this.height
  );

  private collisionSound = this.audioLoader.load("/audio/big-pipe-hit.mp3");
  private shootingSound = this.audioLoader.load("/audio/shotgun-firing.mp3");
  private lastShot = Date.now();

  constructor(
    private readonly camera: Camera,
    private readonly store: EntityStore,
    private readonly userInput: UserInput,
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
    this.userInput.onAction(this.id, this.handleInputs.bind(this));
  }

  protected triggerOnChange(): void {
    this.setCamera();
    super.triggerOnChange();
  }

  private handleInputs(intents: Set<INTENT>) {
    const speed = 0.2;
    const movementForce: Object2D = {
      x: 0,
      y: 0,
    };

    if (intents.has(INTENT.MOVE_UP)) {
      movementForce.y = -speed * this.mass * 2;
    }
    if (intents.has(INTENT.MOVE_RIGHT)) {
      movementForce.x = speed * this.mass * 2;
    }
    if (intents.has(INTENT.MOVE_DOWN)) {
      movementForce.y = speed * this.mass * 2;
    }
    if (intents.has(INTENT.MOVE_LEFT)) {
      movementForce.x = -speed * this.mass * 2;
    }
    if (intents.has(INTENT.SHOOT)) {
      this.shoot();
    }

    if (movementForce.x !== 0 || movementForce.y !== 0) {
      this.applyForce(movementForce);
    }

    if (intents.has(INTENT.ZOOM_IN)) {
      this.camera.zoom *= 1.1;
    }
    if (intents.has(INTENT.ZOOM_OUT)) {
      this.camera.zoom *= 0.9;
    }
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
    if (now - this.lastShot < 200) return;
    this.lastShot = now;

    const rotationRad = (this.rotation * Math.PI) / 180;
    const bullet = this.bulletFactory.get();
    bullet.x = this.x + (this.width / 2 + 0.1) * Math.sin(rotationRad);
    bullet.y = this.y - (this.height / 2 + 0.1) * Math.cos(rotationRad);
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

export class PlayerFactory extends factoryOf(Player) {}
container.bind(PlayerFactory).toSelf().inSingletonScope();
