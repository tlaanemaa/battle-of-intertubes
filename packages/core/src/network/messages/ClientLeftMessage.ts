import { BaseMessage } from "./BaseMessage";

export class ClientLeftMessage extends BaseMessage {
  public readonly type = "client-left";
}
