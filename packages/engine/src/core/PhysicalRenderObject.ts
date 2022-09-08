import { Drawable } from "./interfaces";
import { PhysicalEntity } from "./PhysicalEntity";

export abstract class PhysicalRenderObject
  extends PhysicalEntity
  implements Drawable
{
  public abstract texture: CanvasImageSource;
  public abstract rotation: number;
}
