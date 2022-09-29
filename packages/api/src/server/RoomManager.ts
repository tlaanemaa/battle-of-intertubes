import { singleton } from "tsyringe";
import {
  AnyMessage,
  ClientLeftMessage,
  FastMap,
} from "@battle-of-intertubes/core";
import { Logger } from "@battle-of-intertubes/logger";
import { ConnectionStore } from "./ConnectionStore";
import { RoomThread } from "../room";

@singleton()
export class RoomManager {
  private readonly rooms = new FastMap<RoomThread>();
  private readonly connectionsToRooms = new FastMap<string>();

  constructor(
    private readonly logger: Logger,
    private readonly connectionStore: ConnectionStore
  ) {}

  public handleMessage(connectionId: string, message: AnyMessage) {
    if (message.type === "connection-request") {
      this.connectionsToRooms.set(connectionId, message.room);
    }

    const roomId = this.connectionsToRooms.get(connectionId);
    if (!roomId) {
      this.logger.error("No room selected!", { connectionId });
      return;
    }

    const room = this.getRoom(roomId);
    room.sendMessage(connectionId, message);
  }

  public handleDisconnect(connectionId: string) {
    const roomId = this.connectionsToRooms.get(connectionId);
    if (roomId) {
      this.connectionsToRooms.delete(connectionId);
      const room = this.getRoom(roomId);
      room.sendMessage(connectionId, new ClientLeftMessage());
    }
  }

  private getRoom(id: string) {
    const room = this.rooms.get(id);
    if (room) return room;

    const newRoom = this.createRoom(id);
    this.rooms.set(id, newRoom);
    this.logger.info("Room created", { id });
    return newRoom;
  }

  private createRoom(id: string) {
    const newRoom = new RoomThread(id);
    newRoom.onExit = (code) => {
      this.rooms.delete(id);
      this.logger.error("Room exited!", { id, code });
    };
    newRoom.onError = (err) => {
      this.logger.error("Room threw an error!", { err });
    };
    newRoom.onMessage = (connectionId, message) => {
      this.connectionStore.sendMessage(connectionId, message);
    };
    return newRoom;
  }
}
