import { BaseMessage } from "../core";

export class StateUpdateMessage extends BaseMessage {
  public readonly type = "state-update";
}
