import { Object2D } from "../primitives/Object2D";

export class Camera {
  private static instance?: Camera;
  public position: Object2D = { x: 0, y: 0 };
  private _zoom: number = 1;

  private constructor() {}

  public get zoom() {
    return this._zoom;
  }

  public set zoom(zoom: number) {
    this._zoom = Math.max(0.005, Math.min(50, zoom));
  }

  public static getInstance() {
    if (!this.instance) this.instance = new Camera();
    return this.instance;
  }
}
