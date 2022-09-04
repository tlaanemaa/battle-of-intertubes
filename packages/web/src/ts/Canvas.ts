export class Canvas {
  private readonly canvasElement: HTMLCanvasElement;

  constructor(elementId: string) {
    this.canvasElement = document.getElementById(
      elementId
    ) as HTMLCanvasElement;

    window.addEventListener("resize", this.resizeCanvas.bind(this));
    this.resizeCanvas();
  }

  private resizeCanvas() {
    this.canvasElement.height = window.innerHeight;
    this.canvasElement.width = window.innerWidth;
  }

  public getContext() {
    return this.canvasElement.getContext("2d")!;
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
