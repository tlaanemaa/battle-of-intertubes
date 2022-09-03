import { PhysicalRenderObject } from "../core/PhysicalRenderObject";

export class Moose extends PhysicalRenderObject {
  public readonly texture = new Image();
  public readonly height = 200;
  public readonly width = 200;

  constructor() {
    super();
    this.texture.src =
      "https://images.vexels.com/media/users/3/227446/isolated/lists/7867873566b6dda4db49b5d752009b07-cute-moose-flat.png";

    setInterval(() => this.tick(100000), 100);
  }

  tick(forceBound = 2000) {
    this.applyForce({
      x: Math.random() * 2 * forceBound - forceBound,
      y: Math.random() * 2 * forceBound - forceBound,
    });
  }
}
