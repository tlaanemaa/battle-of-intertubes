import { Camera, Entity, Texture } from "@battle-of-intertubes/core";

export class Player extends Entity {
  public readonly texture = new Texture("img/hero1.png");
  public height = 100;
  public width = 100;
  public mass = 1000;
  public dragCoefficient = 0.999;

  constructor(private readonly camera: Camera) {
    super();
    this.x = 0;
    this.y = 0;
  }

  protected triggerOnChange(): void {
    this.camera.position.x = this.x;
    this.camera.position.y = this.y;
    this.setRotation(this.getHeading());
    super.triggerOnChange();
  }

  private setCamera() {
    this.camera.position.x = Math.min(this.camera.position.x);
  }
}
