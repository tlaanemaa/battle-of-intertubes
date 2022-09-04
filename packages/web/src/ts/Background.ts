import { singleton } from "tsyringe";
import { Canvas } from "./Canvas";

@singleton()
export class Background {
  private readonly imageUrl = "img/bananas.webp";
  private readonly imageSize = 400; // The image is assumed to be a square
  private readonly canvas = new Canvas("game-background");
  private readonly image = new Image();

  private _cameraX = 0;
  private _cameraY = 0;
  private _zoomModifier = 1;
  private needsRedraw = false;

  constructor() {
    this.image.onload = () => (this.needsRedraw = true);
    this.image.src = this.imageUrl;
  }

  public get cameraX() {
    return this._cameraX;
  }

  public set cameraX(cameraX: number) {
    this._cameraX = cameraX;
    this.needsRedraw = true;
  }

  public get cameraY() {
    return this._cameraY;
  }

  public set cameraY(cameraY: number) {
    this._cameraY = cameraY;
    this.needsRedraw = true;
  }

  public get zoomModifier() {
    return this._zoomModifier;
  }

  public set zoomModifier(zoomModifier: number) {
    this._zoomModifier = zoomModifier;
    this.needsRedraw = true;
  }

  public draw() {
    if (!this.needsRedraw) return;
    this.drawBackground();
  }

  /**
   * Draws the background to the canvas
   */
  private drawBackground() {
    const scaledImageSize = this.imageSize * this._zoomModifier;

    const renderX = (-this._cameraX % scaledImageSize) - scaledImageSize;
    const renderY = (-this._cameraY % scaledImageSize) - scaledImageSize;
    const renderWidth = this.canvas.width - renderX;
    const renderHeight = this.canvas.height - renderY;

    const ctx = this.canvas.getContext();
    ctx.translate(
      Math.round(renderX + this.canvas.width / 2),
      Math.round(renderY + this.canvas.height / 2)
    );

    ctx.fillStyle = ctx.createPattern(
      this.getBackgroundImage(scaledImageSize),
      "repeat"
    )!;

    ctx.fillRect(
      Math.round(-this.canvas.width / 2),
      Math.round(-this.canvas.height / 2),
      Math.round(renderWidth),
      Math.round(renderHeight)
    );
    // Reset current transformation matrix to the identity matrix
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  /**
   * Creates a scaled version of the background image as a temporary canvas
   */
  private getBackgroundImage(backgroundSize: number) {
    const imageCanvas = document.createElement("canvas");
    imageCanvas.height = backgroundSize;
    imageCanvas.width = backgroundSize;

    imageCanvas
      .getContext("2d")!
      .drawImage(this.image, 0, 0, imageCanvas.width, imageCanvas.height);

    return imageCanvas;
  }
}
