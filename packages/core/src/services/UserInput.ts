import { container } from "@moose-rocket/container";
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
type ActionHandler = (unhandledIntents: Set<INTENT>) => void;

@injectable()
export class UserInput {
  private readonly unhandledIntents = new Map<TargetID, Set<INTENT>>();
  private readonly actionHandlers = new Map<TargetID, Set<ActionHandler>>();

  constructor(clock: Clock) {
    clock.schedulePrimary(this.runHandlers.bind(this));
  }

  public onAction(target: TargetID, handler: ActionHandler) {
    const handlerSet = this.actionHandlers.get(target) ?? new Set();
    handlerSet.add(handler);
    this.actionHandlers.set(target, handlerSet);
  }

  public removeActionHandler(target: TargetID, handler: ActionHandler) {
    const handlerSet = this.actionHandlers.get(target);
    if (!handlerSet) return;
    handlerSet.delete(handler);
    if (handlerSet.size === 0) this.actionHandlers.delete(target);
  }

  public clearIntents(target: TargetID) {
    this.unhandledIntents.delete(target);
  }

  private runHandlers() {
    this.actionHandlers.forEach((handlers, targetID) => {
      const unhandledIntens = this.unhandledIntents.get(targetID);
      if (unhandledIntens == null || unhandledIntens.size === 0) return;
      handlers.forEach((handler) => handler(unhandledIntens));
      this.unhandledIntents.delete(targetID);
    });
  }

  private createIntentSet(target: TargetID) {
    const intents = new Set<INTENT>();
    this.unhandledIntents.set(target, intents);
    return intents;
  }

  public trigger(target: TargetID, intent: INTENT) {
    const intents =
      this.unhandledIntents.get(target) ?? this.createIntentSet(target);
    intents.add(intent);
  }
}

container.bind(UserInput).toSelf().inSingletonScope();
