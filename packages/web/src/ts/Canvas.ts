import { singleton } from "tsyringe";

@singleton()
export class Canvas {
  private readonly canvasElement = document.getElementById(
    "game-view"
  ) as HTMLCanvasElement;

  constructor() {
    window.addEventListener("resize", this.resizeCanvas.bind(this));
    this.resizeCanvas();
  }

  private resizeCanvas() {
    this.canvasElement.height = window.innerHeight;
    this.canvasElement.width = window.innerWidth;
  }

  public getContext() {
    const context2d = this.canvasElement.getContext("2d");
    if (!context2d) throw new Error("Cannot resolve canvas context!");
    return context2d;
  }

  public get height() {
    return this.canvasElement.height;
  }

  public get width() {
    return this.canvasElement.width;
  }

  public clear() {
    const ctx = this.getContext();
    ctx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
    ctx.beginPath();
  }
}
