import { BaseMessage } from "./BaseMessage";

export class ActionPerformedMessage extends BaseMessage {
  public readonly type = "action-performed";
}
