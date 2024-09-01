import { Entity } from "@/game/core";
import {
  ConnectionRequestMessage,
  ConnectionApprovedMessage,
  ActionPerformedMessage,
  StateUpdateMessage,
  AnyMessage,
} from "./messages";

export class Parser {
  public static parse(messageString: string) {
    // We kind of assume these messages are always correct, might want to add some validation later
    const objectLiteral = JSON.parse(messageString) as AnyMessage;

    switch (objectLiteral.type) {
      case "action-performed":
        return new ActionPerformedMessage(new Set(objectLiteral.actions));
      case "connection-approved":
        return new ConnectionApprovedMessage(objectLiteral.room);
      case "connection-request":
        return new ConnectionRequestMessage(objectLiteral.room);
      case "state-update":
        return new StateUpdateMessage(
          objectLiteral.entities.map((entity) =>
            Object.assign(new Entity(), entity),
          ),
        );

      default:
        throw new Error(`Unknown message type: ${(objectLiteral as any).type}`);
    }
  }
}
