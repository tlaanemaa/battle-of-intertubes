import { v4 as uuidV4 } from "uuid";

type OnMoveCallback = () => void;

export abstract class Entity {
  public readonly id = uuidV4();
  public abstract x: number;
  public abstract y: number;
  public abstract height: number;
  public abstract width: number;

  private onMoveCallback: null | OnMoveCallback = null;

  protected triggerOnMove() {
    if (this.onMoveCallback) this.onMoveCallback();
  }

  public onMove(callback: null | OnMoveCallback) {
    this.onMoveCallback = callback;
  }
}
