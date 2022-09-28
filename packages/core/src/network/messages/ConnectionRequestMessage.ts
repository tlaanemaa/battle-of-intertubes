import { KeyHandler } from "../KeyHandler";
import { BaseMessage } from "./BaseMessage";

export class ConnectionRequestMessage extends BaseMessage {
  public readonly type = "connection-request";
  public readonly key = KeyHandler.getKey();
  constructor(readonly room: string) {
    super();
  }
}
