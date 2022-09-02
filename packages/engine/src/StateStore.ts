import { singleton } from "tsyringe";

@singleton()
export class StateStore {
  public getStateForRendering() {
    return {};
  }
}
