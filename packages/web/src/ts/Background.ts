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
    this.backgroundImage.src =
      "https://upload.wikimedia.org/wikipedia/en/2/27/Bliss_%28Windows_XP%29.png";
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
    const scaledImageSize = this.imageSize * zoomModifier;

    const renderX = (position.x % scaledImageSize) - scaledImageSize;
    const renderY = (position.y % scaledImageSize) - scaledImageSize;
    const renderWidth = this.canvasElement.width - renderX;
    const renderHeight = this.canvasElement.height - renderY;

    const ctx = this.canvasElement.getContext("2d")!;
    ctx.translate(
      Math.round(renderX + this.canvasElement.width / 2),
      Math.round(renderY + this.canvasElement.height / 2)
    );

    ctx.fillStyle = ctx.createPattern(
      this.getBackgroundImage(scaledImageSize),
      "repeat"
    )!;

    ctx.fillRect(
      Math.round(-this.canvasElement.width / 2),
      Math.round(-this.canvasElement.height / 2),
      Math.round(renderWidth),
      Math.round(renderHeight)
    );
    // Reset current transformation matrix to the identity matrix
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  private getBackgroundImage(backgroundSize: number) {
    const imageCanvas = document.createElement("canvas");
    imageCanvas.height = backgroundSize;
    imageCanvas.width = backgroundSize;

    imageCanvas
      .getContext("2d")!
      .drawImage(
        this.backgroundImage,
        0,
        0,
        imageCanvas.width,
        imageCanvas.height
      );

    return imageCanvas;
  }
}
