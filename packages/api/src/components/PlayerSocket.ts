import { v4 as uuidV4 } from "uuid";
import { WebSocket } from "ws";

export class PlayerSocket {
  public readonly id = uuidV4();
  constructor(private readonly socket: WebSocket) {}
}
