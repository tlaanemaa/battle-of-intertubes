import { injectable } from "tsyringe";
import { StateStore } from "@battle-of-intertubes/engine";
import { Canvas } from "./Canvas";

@injectable()
export class Renderer {
  /**
   * Current zoom modifier. Larger number means more zoomed in.
   */
  private zoomModifier = 1;
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
    private readonly stateStore: StateStore
  ) {
    window.addEventListener("wheel", this.handleScrollEvent.bind(this));
    window.addEventListener("keydown", this.handleKeyDownEvent.bind(this));
  }

  private handleScrollEvent(event: WheelEvent) {
    if (event.deltaY > 0) this.zoomModifier *= 0.9;
    if (event.deltaY < 0) this.zoomModifier *= 1.1;
  }

  private handleKeyDownEvent(event: KeyboardEvent) {
    if (event.key === "ArrowUp") this.cameraY -= 10;
    if (event.key === "ArrowRight") this.cameraX += 10;
    if (event.key === "ArrowDown") this.cameraY += 10;
    if (event.key === "ArrowLeft") this.cameraX -= 10;
  }

  public draw() {
    const entities = this.stateStore.getStateForRendering();
    const ctx = this.canvas.getContext();
    const canvasWidth = this.canvas.width;
    const canvasHeight = this.canvas.height;

    this.canvas.clear();
    entities.forEach((entity) => {
      const scaledWidth = entity.width * this.zoomModifier;
      const scaledHeight = entity.height * this.zoomModifier;
      const renderX =
        (entity.x - this.cameraX) * this.zoomModifier -
        scaledWidth / 2 +
        canvasWidth / 2;
      const renderY =
        (entity.y - this.cameraY) * this.zoomModifier -
        scaledHeight / 2 +
        canvasHeight / 2;

      ctx.drawImage(
        entity.texture,
        renderX,
        renderY,
        scaledWidth,
        scaledHeight
      );
    });
  }
}
