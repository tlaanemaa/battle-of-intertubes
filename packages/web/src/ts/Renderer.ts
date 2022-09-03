import { injectable } from "tsyringe";
import { StateStore, Drawable } from "@battle-of-intertubes/engine";
import { Canvas } from "./Canvas";
import { Background } from "./Background";

@injectable()
export class Renderer {
  /**
   * Current zoom modifier. Larger number means more zoomed in.
   */
  private zoomModifier = 0.8;
  /**
   * Camera X center point
   */
  private cameraX = 0;
  /**
   * Camera Y center point
   */
  private cameraY = 0;

  constructor(
    private readonly canvas: Canvas,
    private readonly background: Background,
    private readonly stateStore: StateStore
  ) {
    this.background.setPosition(
      { x: -this.cameraX, y: -this.cameraY },
      this.zoomModifier
    );
    window.addEventListener("wheel", this.handleScrollEvent.bind(this));
    window.addEventListener("keydown", this.handleKeyDownEvent.bind(this));
  }

  private handleScrollEvent(event: WheelEvent) {
    if (event.deltaY > 0) this.zoomModifier *= 0.9;
    if (event.deltaY < 0) this.zoomModifier *= 1.1;

    this.background.setPosition(
      { x: -this.cameraX, y: -this.cameraY },
      this.zoomModifier
    );
  }

  private handleKeyDownEvent(event: KeyboardEvent) {
    if (event.key === "ArrowUp") this.cameraY -= 10;
    if (event.key === "ArrowRight") this.cameraX += 10;
    if (event.key === "ArrowDown") this.cameraY += 10;
    if (event.key === "ArrowLeft") this.cameraX -= 10;

    this.background.setPosition(
      { x: -this.cameraX, y: -this.cameraY },
      this.zoomModifier
    );
  }

  public draw() {
    this.canvas.clear();
    this.drawEntities();
  }

  private drawEntities() {
    const entities: Drawable[] = this.stateStore.getStateForRendering();
    const ctx = this.canvas.getContext();
    const canvasWidthOffset = this.canvas.width / 2;
    const canvasHeightOffset = this.canvas.height / 2;

    entities.forEach((entity) => {
      const scaledWidth = entity.width * this.zoomModifier;
      const scaledHeight = entity.height * this.zoomModifier;
      const renderX =
        (entity.x - this.cameraX) * this.zoomModifier + canvasWidthOffset;
      const renderY =
        (entity.y - this.cameraY) * this.zoomModifier + canvasHeightOffset;

      ctx.translate(renderX, renderY);
      ctx.rotate((entity.rotation * Math.PI) / 180);
      ctx.drawImage(
        entity.texture,
        -scaledWidth / 2,
        -scaledHeight / 2,
        scaledWidth,
        scaledHeight
      );

      // Reset current transformation matrix to the identity matrix
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    });
  }
}
