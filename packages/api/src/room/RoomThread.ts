import {
  isMainThread,
  Worker,
  workerData,
  parentPort,
} from "node:worker_threads";
import { AnyMessage, Parser } from "@battle-of-intertubes/core/dist/network/";

interface WorkerData {
  roomId: string;
}

interface MessageEnvelope {
  connectionId: string;
  message: string;
}

const createEnvelope = (connectionId: string, message: AnyMessage) => ({
  connectionId,
  message: message.serialize(),
});

const parseEnvelope = (envelope: MessageEnvelope) => ({
  connectionId: envelope.connectionId,
  message: Parser.parse(envelope.message),
});

export class RoomThread {
  private readonly worker: Worker;

  public onMessage?: (connectionId: string, message: AnyMessage) => void;
  public onError?: (error: Error) => void;
  public onExit?: (code: number) => void;

  constructor(roomId: string) {
    const workerData: WorkerData = { roomId };
    this.worker = new Worker(__filename, { workerData });

    this.worker.on("message", (envelope: MessageEnvelope) => {
      const { connectionId, message } = parseEnvelope(envelope);
      this.onMessage?.(connectionId, message);
    });
    this.worker.on("error", (err) => this.onError?.(err));
    this.worker.on("exit", (code) => this.onExit?.(code));
  }

  public sendMessage(connectionId: string, message: AnyMessage) {
    this.worker.postMessage(createEnvelope(connectionId, message));
  }
}

/**
 * Initialization script for the worker thread
 */
if (!isMainThread) {
  (async function initThread() {
    const { Room } = await import("./Room");
    const data: WorkerData = workerData;

    const send = (connectionId: string, message: AnyMessage) => {
      parentPort!.postMessage(createEnvelope(connectionId, message));
    };

    const room = new Room(data.roomId, send);

    parentPort!.on("message", (envelope: any) => {
      const { connectionId, message } = parseEnvelope(envelope);
      room.onMessage(connectionId, message);
    });
  })();
}
