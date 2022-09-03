import { singleton } from "tsyringe";
import { PhysicalRenderObject } from "../core/PhysicalRenderObject";
import { Moose } from "../entities/Moose";

const mockEntities = new Array(5000).fill(1).map(() => new Moose());

@singleton()
export class StateStore {
  public getStateForRendering(): PhysicalRenderObject[] {
    return mockEntities;
  }
}
