import { singleton } from "tsyringe";

export type Level = "debug" | "info" | "warn" | "error";

@singleton()
export class LoggerConfig {
  public enabled = true;
  public level: Level = "debug";
}
