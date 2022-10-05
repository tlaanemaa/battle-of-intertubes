import { injectable } from "inversify";
import { container } from "@moose-rocket/container";
import { INTENT, UserInput, EventSource } from "@moose-rocket/core";

@injectable()
export class ServerUserInput
  extends EventSource<INTENT, number>
  implements UserInput {}

container.bind(ServerUserInput).toSelf().inSingletonScope();
