import {
  ActionPerformedMessage,
  ConnectionApprovedMessage,
  ConnectionRequestMessage,
  StateUpdateMessage,
} from "./messages";

type SomeMessage =
  | ConnectionRequestMessage
  | ConnectionApprovedMessage
  | ActionPerformedMessage
  | StateUpdateMessage;

export class Parser {
  private static createBlankMessageObject(type: SomeMessage["type"]) {
    switch (type) {
      case "connection-request":
        return new ConnectionRequestMessage("");

      case "connection-approved":
        return new ConnectionApprovedMessage("");

      case "action-performed":
        return new ActionPerformedMessage();

      case "state-update":
        return new StateUpdateMessage();

      default:
        throw new Error(`Unknown message type: ${type}`);
    }
  }

  public static parse(messageString: string) {
    // We kind of assume these messages are always correct, might want to add some validation later
    const objectLiteral = JSON.parse(messageString) as SomeMessage;

    return Object.assign(
      this.createBlankMessageObject(objectLiteral.type),
      objectLiteral
    );
  }
}
