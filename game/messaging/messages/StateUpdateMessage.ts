import { Entity } from "@/game/core";
import { BaseMessage } from "../core";

export class StateUpdateMessage extends BaseMessage {
  public readonly type = "state-update";

  constructor(public readonly entities: Entity[]) {
    super();
  }

  public serialize(): string {
    return JSON.stringify({
      type: this.type,
      entities: this.entities.map((entity) => {
        const { id, x, y, height, width, velocity, rotation } = entity;
        return { id, x, y, height, width, velocity, rotation };
      }),
    });
  }
}
