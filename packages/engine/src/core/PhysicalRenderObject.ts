import { RenderObject } from "./interfaces";
import { PhysicalObject } from "./PhysicalObject";

export abstract class PhysicalRenderObject
  extends PhysicalObject
  implements RenderObject
{
  public abstract texture: CanvasImageSource;
}
