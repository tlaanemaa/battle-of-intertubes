import { EventSource } from "@battle-of-intertubes/core";

export enum INTENT {
  MOVE_UP,
  MOVE_DOWN,
  MOVE_RIGHT,
  MOVE_LEFT,
  ZOOM_IN,
  ZOOM_OUT,
  RESIZE_WINDOW,
}

export class UserInput extends EventSource<INTENT> {
  constructor() {
    super();
    this.attachListeners();
  }

  private attachListeners() {
    window.addEventListener("wheel", (event: WheelEvent) => {
      if (event.deltaY > 0) this.trigger(INTENT.ZOOM_OUT);
      if (event.deltaY < 0) this.trigger(INTENT.ZOOM_IN);
    });

    window.addEventListener("keydown", (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowUp":
          return this.trigger(INTENT.MOVE_UP);
        case "ArrowRight":
          return this.trigger(INTENT.MOVE_RIGHT);
        case "ArrowDown":
          return this.trigger(INTENT.MOVE_DOWN);
        case "ArrowLeft":
          return this.trigger(INTENT.MOVE_LEFT);
      }
    });

    window.addEventListener("resize", () => this.trigger(INTENT.RESIZE_WINDOW));
  }
}
