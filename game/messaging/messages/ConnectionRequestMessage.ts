import { BaseMessage } from "../core";

export class ConnectionRequestMessage extends BaseMessage {
  public readonly type = "connection-request";
  public readonly authorization = "Basic YmFuYW5hOjQ1Yzk5M2E1LWYxYmQtNGJiOS1iNmE3LWU1NDNiM2Y4MDU2MA=="
  constructor(readonly room: string) {
    super();
  }
}
