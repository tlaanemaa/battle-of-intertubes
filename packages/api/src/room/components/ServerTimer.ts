import { injectable } from "inversify";
import { container } from "@moose-rocket/container";
import { Timer } from "@moose-rocket/core";
import { Logger } from "@moose-rocket/logger";

type Task = () => void;

@injectable()
export class ServerTimer implements Timer {
  private interval: NodeJS.Timer | null = null;
  private tasks: Task[] = [];

  constructor(private readonly logger: Logger) {}

  public start() {
    this.interval = setInterval(() => this.handleFrame(), 500);
  }

  public stop() {
    if (this.interval != null) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  public schedulePrimary(task: Task) {
    this.tasks.push(task);
  }

  private handleFrame() {
    try {
      console.log("SERVER TICK");
      this.tasks.forEach((task) => task());
    } catch (e) {
      this.logger.error(e);
    }
  }
}

container.bind(ServerTimer).toSelf().inSingletonScope();
