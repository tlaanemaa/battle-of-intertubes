import { Entity } from "@battle-of-intertubes/core";
import { Canvas } from "./Canvas";
import { Renderer } from "./Renderer";
import { Camera } from "./Camera";

export class EntityRenderer extends Renderer {
  private readonly drawEntityBoxes = true;

  constructor(private readonly canvas: Canvas, camera: Camera) {
    super(camera);

    window.addEventListener("wheel", this.handleScrollEvent.bind(this));
    window.addEventListener("keydown", this.handleKeyDownEvent.bind(this));
  }

  private handleScrollEvent(event: WheelEvent) {
    const step = 0.1;
    if (event.deltaY > 0) this.camera.zoom *= 1 - step;
    if (event.deltaY < 0) this.camera.zoom *= 1 + step;
  }

  private handleKeyDownEvent(event: KeyboardEvent) {
    const step = 10;
    if (event.key === "ArrowUp") this.camera.position.y -= step;
    if (event.key === "ArrowRight") this.camera.position.x += step;
    if (event.key === "ArrowDown") this.camera.position.y += step;
    if (event.key === "ArrowLeft") this.camera.position.x -= step;
  }

  public draw(entities: Entity[]) {
    this.canvas.clear();
    this.drawEntities(entities);
  }

  private drawEntities(entities: Entity[]) {
    const ctx = this.canvas.getContext();
    const canvasHalfWidth = this.canvas.width / 2;
    const canvasHalfHeight = this.canvas.height / 2;

    entities.forEach((entity) => {
      const scaledWidth = entity.width * this.camera.zoom;
      const scaledHeight = entity.height * this.camera.zoom;
      const renderX =
        (entity.x - this.camera.position.x) * this.camera.zoom +
        canvasHalfWidth;
      const renderY =
        (entity.y - this.camera.position.y) * this.camera.zoom +
        canvasHalfHeight;

      ctx.translate(Math.round(renderX), Math.round(renderY));

      if (this.drawEntityBoxes) {
        ctx.beginPath();
        ctx.rect(
          Math.round(-scaledWidth / 2),
          Math.round(-scaledHeight / 2),
          Math.round(scaledWidth),
          Math.round(scaledHeight)
        );
        ctx.strokeStyle = entity.isColliding ? "#FF0000" : "#00FF00";
        ctx.stroke();
      }

      ctx.rotate((entity.rotation * Math.PI) / 180);
      ctx.drawImage(
        entity.texture.render(),
        Math.round(-scaledWidth / 2),
        Math.round(-scaledHeight / 2),
        Math.round(scaledWidth),
        Math.round(scaledHeight)
      );

      // Reset current transformation matrix to the identity matrix
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    });
  }
}
