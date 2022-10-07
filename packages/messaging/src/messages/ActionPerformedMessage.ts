import { INTENT } from "@moose-rocket/core";
import { BaseMessage } from "../core";

export class ActionPerformedMessage extends BaseMessage {
  public readonly type = "action-performed";

  constructor(public readonly actions: Set<INTENT>) {
    super();
  }

  public serialize(): string {
    return JSON.stringify({
      type: this.type,
      actions: Array.from(this.actions),
    });
  }
}
