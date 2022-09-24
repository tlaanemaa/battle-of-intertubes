import { FastMap } from "@battle-of-intertubes/core";
import { singleton } from "tsyringe";
import { Room } from "../components";

@singleton()
export class RoomStore {
  private readonly rooms = new FastMap<Room>();

  get(id: string) {
    const room = this.rooms.get(id);
    if (room) return room;
    const newRoom = new Room(id);
    this.rooms.set(id, newRoom);
    return newRoom;
  }
}
