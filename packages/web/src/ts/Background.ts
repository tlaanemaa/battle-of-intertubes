import { singleton } from "tsyringe";
import { Canvas } from "./Canvas";

@singleton()
export class Background {
  private readonly imageUrl = "img/grid-me.png";
  private readonly imageHeight = 50;
  private readonly imageWidth = 50;

  private readonly canvas = new Canvas("game-background");
  private readonly rawImage = new Image();
  private image: CanvasImageSource;

  private _cameraX = 0;
  private _cameraY = 0;
  private _zoomModifier = 1;
  private needsRedraw = false;

  constructor() {
    window.addEventListener("resize", () => this.markForRedraw());
    this.rawImage.onload = () => this.imageOnLoad();
    this.rawImage.src = this.imageUrl;
    this.image = this.createBackgroundImage();
  }

  private imageOnLoad() {
    this.image = this.createBackgroundImage();
    this.markForRedraw();
  }

  public get cameraX() {
    return this._cameraX;
  }

  public set cameraX(cameraX: number) {
    this._cameraX = cameraX;
    this.markForRedraw();
  }

  public get cameraY() {
    return this._cameraY;
  }

  public set cameraY(cameraY: number) {
    this._cameraY = cameraY;
    this.markForRedraw();
  }

  public get zoomModifier() {
    return this._zoomModifier;
  }

  public set zoomModifier(zoomModifier: number) {
    this._zoomModifier = zoomModifier;
    this.image = this.createBackgroundImage();
    this.markForRedraw();
  }

  private markForRedraw() {
    this.needsRedraw = true;
  }

  public draw() {
    if (!this.needsRedraw) return;
    this.canvas.clear();
    this.drawBackground();
    this.needsRedraw = false;
  }

  /**
   * Draws the background to the canvas
   */
  private drawBackground() {
    const canvasHalfWidth = this.canvas.width / 2;
    const canvasHalfHeight = this.canvas.height / 2;
    const scaledImageWidth = this.imageWidth * this._zoomModifier;
    const scaledImageHeight = this.imageHeight * this._zoomModifier;

    const renderX =
      ((-this._cameraX * this._zoomModifier) % scaledImageWidth) -
      scaledImageWidth;
    const renderY =
      ((-this._cameraY * this._zoomModifier) % scaledImageHeight) -
      scaledImageHeight;
    const renderWidth = this.canvas.width - renderX;
    const renderHeight = this.canvas.height - renderY;

    const ctx = this.canvas.getContext();
    ctx.translate(
      Math.round(renderX + canvasHalfWidth),
      Math.round(renderY + canvasHalfHeight)
    );

    ctx.fillStyle = ctx.createPattern(this.image, "repeat")!;

    ctx.fillRect(
      Math.round(-canvasHalfWidth),
      Math.round(-canvasHalfHeight),
      Math.round(renderWidth),
      Math.round(renderHeight)
    );
    // Reset current transformation matrix to the identity matrix
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  /**
   * Creates a scaled version of the background image as a temporary canvas
   */
  private createBackgroundImage() {
    const imageCanvas = document.createElement("canvas");
    imageCanvas.width = this.imageWidth * this._zoomModifier;
    imageCanvas.height = this.imageHeight * this._zoomModifier;

    imageCanvas
      .getContext("2d")!
      .drawImage(this.rawImage, 0, 0, imageCanvas.width, imageCanvas.height);

    return imageCanvas;
  }
}
