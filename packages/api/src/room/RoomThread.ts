import {
  isMainThread,
  Worker,
  workerData,
  parentPort,
  MessageChannel,
  MessagePort,
} from "node:worker_threads";
import WebSocket = require("ws");

// ================================================
// General private utilities
// ================================================
const SOCKET_CONNECTION_MESSAGE_TYPE = "socket_to_port_connection_message";
interface SocketConnectionMessage {
  messageId: typeof SOCKET_CONNECTION_MESSAGE_TYPE;
  socketPort: MessagePort;
  userId: string;
}

const isSocketConnectionMessage = (
  data: any
): data is SocketConnectionMessage => {
  return (
    data !== null &&
    typeof data === "object" &&
    !Array.isArray(data) &&
    data.messageId === SOCKET_CONNECTION_MESSAGE_TYPE &&
    data.socketPort instanceof MessagePort &&
    typeof data.userId === "string"
  );
};

// ================================================
// Thread class for using in the main process
// ================================================
export class RoomThread extends Worker {
  constructor(roomId: string) {
    super(__filename, { workerData: { roomId } });
  }

  public connectSocket(userId: string, socket: WebSocket) {
    const { port1, port2 } = new MessageChannel();

    socket.on("message", (data) => port1.postMessage(data.toString())); // TODO: This should work without stringification
    port1.on("message", (data) => socket.send(data));
    socket.on("close", () => port1.close());
    port1.on("close", () => socket.close());

    const message: SocketConnectionMessage = {
      messageId: SOCKET_CONNECTION_MESSAGE_TYPE,
      socketPort: port2,
      userId,
    };
    this.postMessage(message, [port2]);
  }
}

// ================================================
// Thread startup script
// ================================================
if (!isMainThread) {
  (async function initThread() {
    const { Room } = await import("./Room");
    const room = new Room(workerData.roomId);
    parentPort!.on("message", (data: unknown) => {
      if (isSocketConnectionMessage(data)) {
        room.onConnect(data.userId, data.socketPort);
      }
    });
  })();
}
