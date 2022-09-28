import {
  isMainThread,
  Worker,
  workerData,
  parentPort,
} from "node:worker_threads";
import { EventEmitter } from "node:events";
import { v4 as uuidV4 } from "uuid";
import { AnyMessage } from "@battle-of-intertubes/core";

interface WorkerData {
  roomId: string;
}

interface WorkerMessage {
  connectionId: string;
  message: AnyMessage;
}

export class RoomThread extends EventEmitter {
  private readonly worker: Worker;

  public onMessage?: (connectionId: string, message: AnyMessage) => void;
  public onError?: (error: Error) => void;
  public onExit?: (code: number) => void;

  constructor(private readonly roomId: string = uuidV4()) {
    super();
    const workerData: WorkerData = { roomId };
    this.worker = new Worker(__filename, { workerData });

    this.worker.on("message", ({ connectionId, message }: WorkerMessage) =>
      this.onMessage?.(connectionId, message)
    );
    this.worker.on("error", (err) => this.onError?.(err));
    this.worker.on("exit", (code) => this.onExit?.(code));
  }

  public sendMessage(connectionId: string, message: AnyMessage) {
    this.worker.postMessage({ connectionId, message } as WorkerMessage);
  }
}

/**
 * Initialization script for the worker thread
 */
(async function initThread() {
  if (isMainThread) return;

  const { Room } = await import("./Room");
  const data: WorkerData = workerData;

  const room = new Room(
    data.roomId,
    (connectionId: string, message: AnyMessage) =>
      parentPort!.postMessage({ connectionId, message } as WorkerMessage)
  );
  parentPort!.on("message", ({ connectionId, message }: WorkerMessage) =>
    room.onMessage(connectionId, message)
  );
})();
