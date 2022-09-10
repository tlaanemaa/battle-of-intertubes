import { injectable } from "tsyringe";
import { Game } from "@battle-of-intertubes/game";
import { Entity } from "@battle-of-intertubes/core";
import { Canvas } from "./Canvas";
import { Background } from "./Background";

@injectable()
export class Renderer {
  private readonly canvas = new Canvas("game-view");
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
    private readonly background: Background,
    private readonly game: Game
  ) {
    game.start();
    this.background.cameraX = this.cameraX;
    this.background.cameraY = this.cameraY;
    this.background.zoomModifier = this.zoomModifier;

    window.addEventListener("wheel", this.handleScrollEvent.bind(this));
    window.addEventListener("keydown", this.handleKeyDownEvent.bind(this));
  }

  private handleScrollEvent(event: WheelEvent) {
    const step = 0.1;
    if (event.deltaY > 0) this.zoomModifier *= 1 - step;
    if (event.deltaY < 0) this.zoomModifier *= 1 + step;

    this.background.zoomModifier = this.zoomModifier;
  }

  private handleKeyDownEvent(event: KeyboardEvent) {
    const step = 10;
    if (event.key === "ArrowUp") this.cameraY -= step;
    if (event.key === "ArrowRight") this.cameraX += step;
    if (event.key === "ArrowDown") this.cameraY += step;
    if (event.key === "ArrowLeft") this.cameraX -= step;

    this.background.cameraX = this.cameraX;
    this.background.cameraY = this.cameraY;
  }

  public draw() {
    this.background.draw();
    this.canvas.clear();
    this.drawEntities();
  }

  private drawEntities() {
    const ctx = this.canvas.getContext();
    const canvasHalfWidth = this.canvas.width / 2;
    const canvasHalfHeight = this.canvas.height / 2;
    const renderRadiusX = Math.round(this.canvas.width / this.zoomModifier);
    const renderRadiusY = Math.round(this.canvas.height / this.zoomModifier);
    const entities: Entity[] = this.game.getEntitiesForRendering(
      this.cameraX - renderRadiusX,
      this.cameraY - renderRadiusY,
      this.cameraX + renderRadiusX,
      this.cameraY + renderRadiusY
    );

    entities.forEach((entity) => {
      const scaledWidth = entity.width * this.zoomModifier;
      const scaledHeight = entity.height * this.zoomModifier;
      const renderX =
        (entity.x - this.cameraX) * this.zoomModifier + canvasHalfWidth;
      const renderY =
        (entity.y - this.cameraY) * this.zoomModifier + canvasHalfHeight;

      ctx.translate(Math.round(renderX), Math.round(renderY));
      ctx.rotate((entity.rotation * Math.PI) / 180);
      ctx.drawImage(
        entity.texture.render(),
        Math.round(-scaledWidth / 2),
        Math.round(-scaledHeight / 2),
        Math.round(scaledWidth),
        Math.round(scaledHeight)
      );

      // Reset current transformation matrix to the identity matrix
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    });
  }
}
