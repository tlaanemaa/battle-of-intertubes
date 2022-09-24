import { FastMap } from "@battle-of-intertubes/core";
import { Logger } from "@battle-of-intertubes/logger";
import { singleton } from "tsyringe";
import { Room } from "../components";

@singleton()
export class RoomStore {
  private readonly rooms = new FastMap<Room>();

  constructor(private readonly logger: Logger) {}

  get(id: string) {
    const room = this.rooms.get(id);
    if (room) return room;

    this.logger.info("Room created", { id });
    const newRoom = new Room(id);
    this.rooms.set(id, newRoom);
    return newRoom;
  }
}
