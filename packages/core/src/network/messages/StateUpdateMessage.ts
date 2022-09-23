import { BaseMessage } from "./BaseMessage";

export class StateUpdateMessage extends BaseMessage {
  public readonly type = "state-update";
}
