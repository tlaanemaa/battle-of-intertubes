import { WebSocket } from "ws";
import { singleton } from "tsyringe";
import { FastMap } from "@battle-of-intertubes/core";
import { Logger } from "@battle-of-intertubes/logger";
import { RoomThread } from "../room";

@singleton()
export class RoomManager {
  private readonly rooms = new FastMap<RoomThread>();

  constructor(private readonly logger: Logger) {}

  public connectSocket(userId: string, roomId: string, socket: WebSocket) {
    const room = this.getRoom(roomId);
    room.connectSocket(userId, socket);
  }

  private getRoom(id: string) {
    const existingRoom = this.rooms.get(id);
    if (existingRoom) return existingRoom;

    const room = new RoomThread(id);
    room.on("exit", (code) => {
      this.rooms.delete(id);
      this.logger.error("Room exited!", { id, code });
    });
    room.on("error", (err) => {
      this.logger.error("Room threw an error!", { id, err });
    });

    this.rooms.set(id, room);
    this.logger.info("Room created", { id });
    return room;
  }
}
