import { BaseMessage } from "./BaseMessage";

export class ConnectionApprovedMessage extends BaseMessage {
  public readonly type = "connection-approved";
  constructor(readonly room: string) {
    super();
  }
}
