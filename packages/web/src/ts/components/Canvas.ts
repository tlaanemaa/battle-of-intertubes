import { injectable, unmanaged } from "inversify";

@injectable()
export class Canvas {
  public readonly element: HTMLCanvasElement;

  constructor(@unmanaged() elementId?: string) {
    this.element = elementId
      ? (document.getElementById(elementId) as HTMLCanvasElement)
      : document.createElement("canvas");
  }

  public resize(width: number, height: number) {
    this.element.width = width;
    this.element.height = height;
  }

  public getContext() {
    return this.element.getContext("2d")!;
  }

  public get height() {
    return this.element.height;
  }

  public get width() {
    return this.element.width;
  }

  public clear() {
    const ctx = this.getContext();
    ctx.clearRect(0, 0, this.element.width, this.element.height);
    ctx.beginPath();
  }
}
