import {
  isMainThread,
  Worker,
  workerData,
  parentPort,
} from "node:worker_threads";
import { v4 as uuidV4 } from "uuid";
import { AnyMessage, Parser } from "@battle-of-intertubes/core/dist/network/";

interface WorkerData {
  roomId: string;
}

interface WorkerMessage {
  connectionId: string;
  message: string;
}

export class RoomThread {
  private readonly worker: Worker;

  public onMessage?: (connectionId: string, message: AnyMessage) => void;
  public onError?: (error: Error) => void;
  public onExit?: (code: number) => void;

  constructor(roomId: string = uuidV4()) {
    const workerData: WorkerData = { roomId };
    this.worker = new Worker(__filename, { workerData });

    this.worker.on("message", ({ connectionId, message }: WorkerMessage) =>
      this.onMessage?.(connectionId, Parser.parse(message))
    );
    this.worker.on("error", (err) => this.onError?.(err));
    this.worker.on("exit", (code) => this.onExit?.(code));
  }

  public sendMessage(connectionId: string, message: AnyMessage) {
    this.worker.postMessage({
      connectionId,
      message: message.serialize(),
    } as WorkerMessage);
  }
}

/**
 * Initialization script for the worker thread
 */
if (!isMainThread) {
  (async function initThread() {
    const { Room } = await import("./Room");
    const data: WorkerData = workerData;

    const send = (connectionId: string, message: AnyMessage) =>
      parentPort!.postMessage({
        connectionId,
        message: message.serialize(),
      } as WorkerMessage);

    const room = new Room(data.roomId, send);

    parentPort!.on("message", ({ connectionId, message }: WorkerMessage) =>
      room.onMessage(connectionId, Parser.parse(message))
    );
  })();
}
