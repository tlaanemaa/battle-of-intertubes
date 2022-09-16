type Task = () => void;

export class FrameTimer {
  private shouldStop = false;
  private tasks: Task[] = [];

  start() {
    this.shouldStop = false;
    window.requestAnimationFrame(() => this.handleFrame());
  }

  stop() {
    this.shouldStop = true;
  }

  public schedule(task: Task) {
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
