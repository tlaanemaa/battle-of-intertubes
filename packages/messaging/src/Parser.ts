import {
  ConnectionRequestMessage,
  ConnectionApprovedMessage,
  ActionPerformedMessage,
  StateUpdateMessage,
  AnyMessage,
} from "./messages";

type ConstructorMap = {
  [K in AnyMessage["type"]]: new (...args: any) => AnyMessage;
};

export class Parser {
  private static readonly messageConstructors: ConstructorMap = {
    "connection-request": ConnectionRequestMessage,
    "connection-approved": ConnectionApprovedMessage,
    "action-performed": ActionPerformedMessage,
    "state-update": StateUpdateMessage,
  } as const;

  public static parse(messageString: string) {
    // We kind of assume these messages are always correct, might want to add some validation later
    const objectLiteral = JSON.parse(messageString) as AnyMessage;
    return this.buildMessageObject(objectLiteral);
  }

  private static buildMessageObject(messageLiteral: AnyMessage) {
    const MessageConstructor = this.messageConstructors[messageLiteral.type];

    if (!MessageConstructor) {
      throw new Error(`Unknown message type: ${messageLiteral.type}`);
    }

    return Object.assign(new MessageConstructor(), messageLiteral);
  }
}
