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
  private static readonly messageConstructors = {
    "connection-request": ConnectionRequestMessage,
    "connection-approved": ConnectionApprovedMessage,
    "action-performed": ActionPerformedMessage,
    "state-update": StateUpdateMessage,
  } as const;

  public static parse(messageString: string) {
    // We kind of assume these messages are always correct, might want to add some validation later
    const objectLiteral = JSON.parse(messageString) as SomeMessage;
    return this.buildMessageObject(objectLiteral);
  }

  private static buildMessageObject(messageLiteral: SomeMessage) {
    const MessageConstructor = this.messageConstructors[messageLiteral.type];

    if (!MessageConstructor) {
      throw new Error(`Unknown message type: ${messageLiteral.type}`);
    }

    return Object.assign(
      new (MessageConstructor as new () => SomeMessage)(),
      messageLiteral
    );
  }
}
