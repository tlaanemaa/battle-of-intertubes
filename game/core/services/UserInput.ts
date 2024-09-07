import { container } from "@/game/container";
import { injectable } from "inversify";
import { Clock } from "./Clock";

export enum INTENT {
  MOVE_UP,
  MOVE_DOWN,
  MOVE_RIGHT,
  MOVE_LEFT,
  ZOOM_IN,
  ZOOM_OUT,
  SHOOT,
}

type TargetID = string;
type ActionHandler = (intentValues: Map<INTENT, number>) => void;

@injectable()
export class UserInput {
  private readonly intentValues = new Map<TargetID, Map<INTENT, number>>();
  private readonly actionHandlers = new Map<TargetID, Set<ActionHandler>>();

  constructor(clock: Clock) {
    clock.schedulePrimary(this.runHandlers.bind(this));
  }

  public onAction(target: TargetID, handler: ActionHandler) {
    const handlerSet = this.actionHandlers.get(target) ?? new Set();
    handlerSet.add(handler);
    this.actionHandlers.set(target, handlerSet);
  }

  private runHandlers() {
    this.actionHandlers.forEach((handlers, targetID) => {
      const intents = this.intentValues.get(targetID);
      if (!intents) return;
      handlers.forEach((handler) => handler(intents));
    });
  }

  public set(target: TargetID, intent: INTENT, value: number) {
    const intentValues = this.intentValues.get(target) ?? new Map();
    if (value === 0) {
      intentValues.delete(intent);
    } else {
      intentValues.set(intent, value);
    }
    this.intentValues.set(target, intentValues);
  }
}

container.bind(UserInput).toSelf().inSingletonScope();
