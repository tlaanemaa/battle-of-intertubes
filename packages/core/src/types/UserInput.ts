import { EventSource } from "../primitives/EventSource";

export enum INTENT {
  MOVE_UP,
  MOVE_DOWN,
  MOVE_RIGHT,
  MOVE_LEFT,
  ZOOM_IN,
  ZOOM_OUT,
  SHOOT,
}

export interface UserInput extends EventSource<INTENT, number> {}
