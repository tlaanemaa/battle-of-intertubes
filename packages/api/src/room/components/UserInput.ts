import { singleton } from "tsyringe";
import { INTENT, UserInput, EventSource } from "@moose-rocket/core";

@singleton()
export class ServerUserInput
  extends EventSource<INTENT, number>
  implements UserInput {}
