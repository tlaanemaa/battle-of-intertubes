import { injectable } from "tsyringe";
import { Timer } from "@battle-of-intertubes/core";
import { Logger } from "@battle-of-intertubes/logger";

type Task = () => void;

@injectable()
export class FrameTimer implements Timer {
  private shouldStop = false;
  private tasks: Task[] = [];

  constructor(private readonly logger: Logger) {}

  public start() {
    this.shouldStop = false;
    window.requestAnimationFrame(() => this.handleFrame());
  }

  public stop() {
    this.shouldStop = true;
  }

  public schedulePrimary(task: Task) {
    this.tasks.push(task);
  }

  private handleFrame() {
    try {
      this.tasks.forEach((task) => task());
    } catch (e) {
      this.logger.error(e);
    } finally {
      if (!this.shouldStop) {
        window.requestAnimationFrame(() => this.handleFrame());
      }
    }
  }
}
