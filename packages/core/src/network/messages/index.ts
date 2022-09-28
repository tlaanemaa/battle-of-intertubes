import { ConnectionRequestMessage } from "./ConnectionRequestMessage";
import { ConnectionApprovedMessage } from "./ConnectionApprovedMessage";
import { ActionPerformedMessage } from "./ActionPerformedMessage";
import { StateUpdateMessage } from "./StateUpdateMessage";
import { ClientLeftMessage } from "./ClientLeftMessage";

export type AnyMessage =
  | ConnectionRequestMessage
  | ConnectionApprovedMessage
  | ActionPerformedMessage
  | StateUpdateMessage
  | ClientLeftMessage;

export {
  ConnectionRequestMessage,
  ConnectionApprovedMessage,
  ActionPerformedMessage,
  StateUpdateMessage,
  ClientLeftMessage,
};
