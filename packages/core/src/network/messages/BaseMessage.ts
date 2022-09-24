import { v4 as uuidv4 } from "uuid";

// TODO: Later we can use this to implement persistent players
const playerId = uuidv4();

export class BaseMessage {
  public readonly playerId = playerId;
  public serialize() {
    return JSON.stringify(this, (k, v) => {
      if (v != null) return v;
    });
  }
}
