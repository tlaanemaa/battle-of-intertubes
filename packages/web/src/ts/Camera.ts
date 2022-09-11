import { Object2D } from "@battle-of-intertubes/core";

export class Camera {
  public position: Object2D = { x: 0, y: 0 };
  private _zoom: number = 1;

  public get zoom() {
    return this._zoom;
  }

  public set zoom(zoom: number) {
    this._zoom = Math.max(0.005, Math.min(50, zoom));
  }
}
