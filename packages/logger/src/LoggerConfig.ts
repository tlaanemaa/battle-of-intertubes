import { injectable } from "inversify";
import { container } from "@moose-rocket/container";

export type Level = "debug" | "info" | "warn" | "error";

@injectable()
export class LoggerConfig {
  public enabled = true;
  public level: Level = "debug";
}

container.bind(LoggerConfig).toSelf().inSingletonScope();
