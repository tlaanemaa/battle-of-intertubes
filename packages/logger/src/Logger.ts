import { injectable } from "inversify";
import { container } from "@moose-rocket/container";
import { LoggerConfig, Level } from "./LoggerConfig";

@injectable()
export class Logger {
  constructor(private readonly config: LoggerConfig) {}

  public debug(...data: unknown[]) {
    if (!["debug"].includes(this.config.level)) return;
    return this._log("debug", data);
  }

  public info(...data: unknown[]) {
    if (!["debug", "info"].includes(this.config.level)) return;
    return this._log("info", data);
  }

  public warn(...data: unknown[]) {
    if (!["debug", "info", "warn"].includes(this.config.level)) return;
    return this._log("warn", data);
  }

  public error(...data: unknown[]) {
    if (!["debug", "info", "warn", "error"].includes(this.config.level)) return;
    return this._log("error", data);
  }

  private _log(level: Level, data: unknown[]) {
    if (!this.config.enabled) return;
    const time = new Date().toISOString();
    console[level](`[${time}]`, ...data);
  }
}

container.bind(Logger).toSelf();
