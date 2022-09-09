import { singleton } from "tsyringe";
import { Drawable } from "@battle-of-intertubes/core";
import { Moose } from "../entities/Moose";

const mockEntities = new Array(2000).fill(1).map(() => new Moose());

@singleton()
export class StateStore {
  public getStateForRendering(): Drawable[] {
    return mockEntities;
  }
}
