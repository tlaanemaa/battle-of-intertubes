import { BaseMessage } from "../core";

export class ConnectionApprovedMessage extends BaseMessage {
  public readonly type = "connection-approved";
  constructor(readonly room: string) {
    super();
  }
}
