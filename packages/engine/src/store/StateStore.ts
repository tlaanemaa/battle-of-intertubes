import { singleton } from "tsyringe";
import { PhysicalRenderObject } from "../core/PhysicalRenderObject";
import { Moose } from "../entities/Moose";

const mockEntities = [new Moose(), new Moose(), new Moose()];

@singleton()
export class StateStore {
  public getStateForRendering(): PhysicalRenderObject[] {
    return mockEntities;
  }
}
