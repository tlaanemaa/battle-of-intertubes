import { injectable } from "inversify";
import { Camera } from "@/game/core";
import { Renderer } from "./Renderer";
import { BackgroundCanvas } from "./BackgroundCanvas";
import { Canvas } from "../components";
import { container } from "@/game/container";

@injectable()
export class BackgroundRenderer extends Renderer {
  private readonly imageUrl = "/img/grass.jpg";
  private readonly imageHeight = 612;
  private readonly imageWidth = 612;

  private readonly rawImage = new Image();
  private image = new Canvas();
  private imageHasChanged = false;

  constructor(canvas: BackgroundCanvas, camera: Camera) {
    super(canvas, camera);
    this.rawImage.onload = () => this.createBackgroundImage();
    this.rawImage.src = this.imageUrl;

    const onResize = () => {
      this.canvas.resize(window.innerWidth, window.innerHeight);
      this.createBackgroundImage();
    };
    window.addEventListener("resize", onResize);
    onResize();
  }

  public draw() {
    if (this.cameraHasZoomed()) {
      this.createBackgroundImage();
      this.syncCameraZoom();
    }

    if (
      (this.imageHasChanged || this.cameraHasMoved()) &&
      this.image.width > 0 &&
      this.image.height > 0
    ) {
      this.canvas.clear();
      this.drawBackground();
      this.syncCameraPosition();
      this.imageHasChanged = false;
    }
  }

  /**
   * Draws the background to the canvas
   */
  private drawBackground() {
    const canvasHalfWidth = this.canvas.width / 2;
    const canvasHalfHeight = this.canvas.height / 2;
    const scaledImageWidth = this.imageWidth * this.camera.zoom;
    const scaledImageHeight = this.imageHeight * this.camera.zoom;

    const renderX =
      ((-this.camera.position.x * this.camera.zoom) % scaledImageWidth) -
      scaledImageWidth;
    const renderY =
      ((-this.camera.position.y * this.camera.zoom) % scaledImageHeight) -
      scaledImageHeight;
    const renderWidth = this.canvas.width - renderX;
    const renderHeight = this.canvas.height - renderY;

    const ctx = this.canvas.getContext();
    ctx.translate(
      Math.round(renderX + canvasHalfWidth),
      Math.round(renderY + canvasHalfHeight)
    );

    ctx.fillStyle = ctx.createPattern(this.image.element, "repeat")!;

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
  public createBackgroundImage() {
    this.image.resize(
      Math.round(this.imageWidth * this.camera.zoom),
      Math.round(this.imageHeight * this.camera.zoom)
    );

    this.image
      .getContext()
      .drawImage(this.rawImage, 0, 0, this.image.width, this.image.height);

    this.imageHasChanged = true;
  }
}

container.bind(BackgroundRenderer).toSelf().inSingletonScope();
