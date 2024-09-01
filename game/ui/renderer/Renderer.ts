import { Camera, Object2D } from "@/game/core";
import { injectable } from "inversify";
import { Canvas } from "../components";

@injectable()
export class Renderer {
  private previousCameraPosition: Object2D = { x: 0, y: 0 };
  private previousCameraZoom: number = 1;

  constructor(
    protected readonly canvas: Canvas,
    protected readonly camera: Camera,
  ) {}

  protected cameraHasMoved(): boolean {
    return (
      this.previousCameraPosition.x !== this.camera.position.x ||
      this.previousCameraPosition.y !== this.camera.position.y
    );
  }

  protected syncCameraPosition() {
    this.previousCameraPosition.x = this.camera.position.x;
    this.previousCameraPosition.y = this.camera.position.y;
  }

  protected cameraHasZoomed(): boolean {
    return this.previousCameraZoom !== this.camera.zoom;
  }

  protected syncCameraZoom() {
    this.previousCameraZoom = this.camera.zoom;
  }
}
