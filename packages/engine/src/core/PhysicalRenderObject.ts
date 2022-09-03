import { Drawable } from "./interfaces";
import { PhysicalObject } from "./PhysicalObject";

export abstract class PhysicalRenderObject
  extends PhysicalObject
  implements Drawable
{
  public abstract texture: CanvasImageSource;
  public abstract rotation: number;
}
