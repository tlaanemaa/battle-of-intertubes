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
  static parse(messageString: string) {
    // We kind of assume these messages are always correct, might want to add some validation later
    const objectLiteral = JSON.parse(messageString) as SomeMessage;

    switch (objectLiteral.type) {
      case "connection-request":
        return Object.assign(new ConnectionRequestMessage(""), objectLiteral);

      case "connection-approved":
        return Object.assign(new ConnectionApprovedMessage(""), objectLiteral);

      case "action-performed":
        return Object.assign(new ActionPerformedMessage(), objectLiteral);

      case "state-update":
        return Object.assign(new StateUpdateMessage(), objectLiteral);
    }
  }
}
