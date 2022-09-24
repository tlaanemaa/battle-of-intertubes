import { injectable } from "tsyringe";
import { Timer } from "@battle-of-intertubes/core";

type Task = () => void;

@injectable()
export class FrameTimer implements Timer {
  private shouldStop = false;
  private tasks: Task[] = [];

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
      console.error(e);
    } finally {
      if (!this.shouldStop) {
        window.requestAnimationFrame(() => this.handleFrame());
      }
    }
  }
}
