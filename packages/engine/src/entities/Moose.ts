import { PhysicalRenderObject } from "../core/PhysicalRenderObject";

export class Moose extends PhysicalRenderObject {
  public readonly texture = new Image();
  public readonly height = 100;
  public readonly width = 100;
  public rotation = 0;

  private images = [
    //"https://img2.storyblok.com/fit-in/600x600/f/158607/800x955/dc35065d72/community-goat.png",
    //"https://images.vexels.com/media/users/3/227446/isolated/lists/7867873566b6dda4db49b5d752009b07-cute-moose-flat.png",
    //"https://www.freeiconspng.com/thumbs/cat-png/cat-png-17.png",
    //"https://www.transparentpng.com/thumb/monkey/2gET42-primate-png-free-primate-png-transparent-images.png",
    "https://www.freeiconspng.com/thumbs/rocket-png/red-rocket-png-5.png",
  ];

  constructor() {
    super();
    this.dragCoefficient = 0.95;
    this.mass = 100;

    this.texture.src =
      this.images[Math.floor(Math.random() * this.images.length)];

    this.tick(10000);
    setInterval(() => this.tick(3000), 100);
  }

  tick(forceBound = 100) {
    //this.rotation += 5
    this.applyForce({
      x: Math.random() * 2 * forceBound - forceBound,
      y: Math.random() * 2 * forceBound - forceBound,
    });
    this.rotation = this.getHeading();
  }
}
