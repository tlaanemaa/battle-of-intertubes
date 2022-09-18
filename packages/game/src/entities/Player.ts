import { Camera, Entity, Texture } from "@battle-of-intertubes/core";

export class Player extends Entity {
  public readonly texture = new Texture("img/hero1.png");
  public height = 100;
  public width = 100;
  public mass = 100;
  public dragCoefficient = 0.999;
  public keepHeading = true;

  constructor(private readonly camera: Camera) {
    super();
    this.x = 0;
    this.y = 0;
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
    console.log("PEW");
  }
}
