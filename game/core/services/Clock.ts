import { container } from "@/game/container";
import { injectable } from "inversify";

type Task = () => void;

/**
 * The primary game-tick clock for the game
 */
@injectable()
export class Clock {
  private readonly TICK_INTERVAL_MS = 10;

  private started = false;
  private primaryTimer?: NodeJS.Timeout;
  private readonly secondaryTimers = new Map<Task, NodeJS.Timeout>();

  private readonly primaryTasks = new Set<Task>();
  private readonly secondaryTasks = new Set<Task>();

  public start() {
    this.primaryTimer = setInterval(
      () => this.runPrimary(),
      this.TICK_INTERVAL_MS,
    );
    this.secondaryTasks.forEach((task) => this.startSecondaryTask(task));
    this.started = true;
  }

  public stop() {
    if (this.primaryTimer !== undefined) {
      clearTimeout(this.primaryTimer);
      this.primaryTimer = undefined;
    }
    this.secondaryTasks.forEach((task) => this.stopSecondaryTask(task));
    this.started = false;
  }

  /**
   * Schedules a task to the primary event loop
   */
  public schedulePrimary(task: Task) {
    this.primaryTasks.add(task);
  }

  public unschedulePrimary(task: Task) {
    this.primaryTasks.delete(task);
  }

  private runPrimary() {
    this.primaryTasks.forEach((task) => task());
  }

  /**
   * Schedules a task to its independent event loop.
   * Tasks in this loop might get delayed if the loop is full
   */
  public scheduleSecondary(task: Task) {
    this.secondaryTasks.add(task);
    if (this.started) {
      this.startSecondaryTask(task);
    }
  }

  public unscheduleSecondary(task: Task) {
    this.stopSecondaryTask(task);
    this.secondaryTasks.delete(task);
  }

  private startSecondaryTask(task: Task) {
    if (this.secondaryTimers.has(task)) {
      this.stopSecondaryTask(task);
    }
    this.secondaryTimers.set(task, setInterval(task, this.TICK_INTERVAL_MS));
  }

  private stopSecondaryTask(task: Task) {
    const timer = this.secondaryTimers.get(task);
    if (timer != null) {
      clearInterval(timer);
      this.secondaryTimers.delete(task);
    }
  }
}

container.bind(Clock).toSelf().inSingletonScope();
