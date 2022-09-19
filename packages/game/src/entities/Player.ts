import { Camera, Entity, Sound, Texture } from "@battle-of-intertubes/core";
import { EntityStore } from "@battle-of-intertubes/core/src/store/EntityStore";
import { Bullet } from "./Bullet";

export class Player extends Entity {
  public width = 100;
  public height = 100;
  public mass = 50;
  public dragCoefficient = 0.999;
  public keepHeading = true;
  public readonly texture = new Texture(
    this.width,
    this.height,
    "img/hero1.png"
  );

  private collisionSound = new Sound("audio/big-pipe-hit.mp3");
  private shootingSound = new Sound("audio/shotgun-firing.mp3");
  private lastShot = Date.now();

  constructor(
    private readonly camera: Camera,
    private readonly store: EntityStore
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
    const spawnX = this.x + (this.width / 2 + 30) * Math.sin(rotationRad);
    const spawnY = this.y - (this.height / 2 + 30) * Math.cos(rotationRad);
    const bullet = new Bullet(spawnX, spawnY, this.rotation);
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
