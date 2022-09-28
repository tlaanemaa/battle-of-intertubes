import { AnyMessage } from "@battle-of-intertubes/core";

export type SendMessage = (connectionId: string, message: AnyMessage) => void;
