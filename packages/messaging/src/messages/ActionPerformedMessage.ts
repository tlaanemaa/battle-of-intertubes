import { BaseMessage } from "../core";

export class ActionPerformedMessage extends BaseMessage {
  public readonly type = "action-performed";
}
