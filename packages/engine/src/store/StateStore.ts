import { singleton } from "tsyringe";
import { Entity } from "../core/Entity";
import { Moose } from "../entities/Moose";

const mockEntities = [new Moose(), new Moose(), new Moose()];

@singleton()
export class StateStore {
  public getStateForRendering(): Entity[] {
    return mockEntities;
  }
}
