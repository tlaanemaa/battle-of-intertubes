export interface Timer {
  schedulePrimary(task: () => void): void;
  start(): void;
  stop(): void;
}
