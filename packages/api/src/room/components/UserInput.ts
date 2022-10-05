import { injectable } from "inversify";
import { container } from "@moose-rocket/container";
import {
  INTENT,
  UserInput,
  EventSource,
  DEPENDENCIES,
} from "@moose-rocket/core";

@injectable()
export class ServerUserInput
  extends EventSource<INTENT, number>
  implements UserInput {}

container.bind(DEPENDENCIES.UserInput).to(ServerUserInput).inSingletonScope();
