import { PhysicalRenderObject } from "../core/PhysicalRenderObject";

export class Moose extends PhysicalRenderObject {
  public readonly texture: CanvasImageSource;
  public readonly height = 20;
  public readonly width = 40;

  constructor() {
    super();
    this.texture = new Image();
    this.texture.src =
      "https://images.vexels.com/media/users/3/227446/isolated/lists/7867873566b6dda4db49b5d752009b07-cute-moose-flat.png";

    const forceBound = 10000;
    setInterval(() => {
      this.applyForce({
        x: Math.random() * 2 * forceBound - forceBound,
        y: Math.random() * 2 * forceBound - forceBound,
      });
    }, 100);
  }
}
