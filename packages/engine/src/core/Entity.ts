import { v4 as uuidV4 } from "uuid";

export abstract class Entity {
  public readonly id = uuidV4();
  public abstract x: number;
  public abstract y: number;
  public abstract height: number;
  public abstract width: number;
}
