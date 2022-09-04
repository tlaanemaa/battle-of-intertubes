import { singleton } from "tsyringe";
import { Object2D } from "@battle-of-intertubes/engine";

// TODO: Fix this class its too hacky
@singleton()
export class Background {
  private backgroundImage = new Image();
  private readonly imageSize = 400;
  private readonly canvasElement = document.getElementById(
    "game-background"
  ) as HTMLCanvasElement;

  constructor() {
    this.backgroundImage.onload = () => this.setPosition({ x: 0, y: 0 }, 1);
    this.backgroundImage.src = "img/bananas.webp";
    window.addEventListener("resize", this.resizeCanvas.bind(this));
    this.resizeCanvas();
  }

  private resizeCanvas() {
    this.canvasElement.height = window.innerHeight;
    this.canvasElement.width = window.innerWidth;
    this.setPosition({ x: 0, y: 0 }, 1);
  }

  public setPosition(position: Object2D, zoomModifier: number) {
    this.drawBackground(position, zoomModifier);
  }

  /**
   * Draws the background to the canvas
   */
  public drawBackground(position: Object2D, zoomModifier: number) {
    const renderX = (position.x % this.imageSize) - this.imageSize;
    const renderY = (position.y % this.imageSize) - this.imageSize;

    const imageCanvas = document.createElement("canvas");
    imageCanvas.height = this.imageSize * zoomModifier;
    imageCanvas.width = this.imageSize * zoomModifier;
    const tCtx = imageCanvas.getContext("2d")!;
    tCtx.drawImage(
      this.backgroundImage,
      0,
      0,
      imageCanvas.width,
      imageCanvas.height
    );

    const ctx = this.canvasElement.getContext("2d")!;
    ctx.fillStyle = ctx.createPattern(imageCanvas, "repeat")!;
    ctx.translate(Math.round(renderX), Math.round(renderY));
    ctx.fillRect(
      0,
      0,
      Math.round(this.canvasElement.width - renderX),
      Math.round(this.canvasElement.height - renderY)
    );
    // Reset current transformation matrix to the identity matrix
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }
}
