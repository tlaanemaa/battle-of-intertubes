import { ConnectionRequestMessage } from "./ConnectionRequestMessage";
import { ConnectionApprovedMessage } from "./ConnectionApprovedMessage";
import { ActionPerformedMessage } from "./ActionPerformedMessage";
import { StateUpdateMessage } from "./StateUpdateMessage";

export type AnyMessage =
  | ConnectionRequestMessage
  | ConnectionApprovedMessage
  | ActionPerformedMessage
  | StateUpdateMessage;

export {
  ConnectionRequestMessage,
  ConnectionApprovedMessage,
  ActionPerformedMessage,
  StateUpdateMessage,
};
