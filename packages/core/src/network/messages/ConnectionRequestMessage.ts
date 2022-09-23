import { BaseMessage } from "./BaseMessage";

export class ConnectionRequestMessage extends BaseMessage {
  public readonly type = "connection-request";
  constructor(readonly room: string) {
    super();
  }
}
