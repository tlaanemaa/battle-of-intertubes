import { EventSource, Object2D } from "@battle-of-intertubes/core";

export enum INTENT {
  MOVE_UP,
  MOVE_DOWN,
  MOVE_RIGHT,
  MOVE_LEFT,
  ZOOM_IN,
  ZOOM_OUT,
  RESIZE_WINDOW,
}

export class UserInput extends EventSource<INTENT, number> {
  private touchStartCoordinates?: Object2D;
  private touchCurrentCoordinates?: Object2D;
  private readonly pressedKeys = new Set<string>();

  constructor() {
    super();
    this.attachListeners();

    // Run it about once every frame, but it doesn't have to be exact
    setInterval(() => this.handleHeldInput(), 17);
  }

  private attachListeners() {
    window.addEventListener("wheel", (event: WheelEvent) => {
      if (event.deltaY > 0) this.trigger(INTENT.ZOOM_OUT, 0.1);
      if (event.deltaY < 0) this.trigger(INTENT.ZOOM_IN, 0.1);
    });

    window.addEventListener("keydown", (event: KeyboardEvent) => {
      this.pressedKeys.add(event.key);
    });
    window.addEventListener("keyup", (event: KeyboardEvent) => {
      this.pressedKeys.delete(event.key);
    });
    window.addEventListener("touchstart", (event: TouchEvent) => {
      this.touchStartCoordinates = {
        x: event.touches[0].pageX,
        y: event.touches[0].pageY,
      };
    });
    window.addEventListener("touchmove", (event: TouchEvent) => {
      this.touchCurrentCoordinates = {
        x: event.touches[0].pageX,
        y: event.touches[0].pageY,
      };
    });
    window.addEventListener("touchend", () => {
      this.touchStartCoordinates = undefined;
      this.touchCurrentCoordinates = undefined;
    });
    window.addEventListener("resize", () => {
      this.trigger(INTENT.RESIZE_WINDOW, 0);
    });
  }

  private handleHeldInput() {
    this.handleTouch();
    this.handlePressedKeys();
  }

  private handleTouch() {
    if (this.touchStartCoordinates && this.touchCurrentCoordinates) {
      const diffX =
        this.touchCurrentCoordinates.x - this.touchStartCoordinates.x;
      const diffY =
        this.touchCurrentCoordinates.y - this.touchStartCoordinates.y;
      const divisor = Math.max(Math.abs(diffX), Math.abs(diffY));
      const scaledX = diffX / divisor;
      const scaledY = diffY / divisor;

      if (scaledX < 0) {
        this.trigger(INTENT.MOVE_LEFT, Math.abs(10 * scaledX));
      }
      if (scaledX > 0) {
        this.trigger(INTENT.MOVE_RIGHT, Math.abs(10 * scaledX));
      }
      if (scaledY < 0) {
        this.trigger(INTENT.MOVE_UP, Math.abs(10 * scaledY));
      }
      if (scaledY > 0) {
        this.trigger(INTENT.MOVE_DOWN, Math.abs(10 * scaledY));
      }
    }
  }

  private handlePressedKeys() {
    this.pressedKeys.forEach((keyName) => {
      switch (keyName) {
        case "ArrowUp":
          return this.trigger(INTENT.MOVE_UP, 10);
        case "ArrowRight":
          return this.trigger(INTENT.MOVE_RIGHT, 10);
        case "ArrowDown":
          return this.trigger(INTENT.MOVE_DOWN, 10);
        case "ArrowLeft":
          return this.trigger(INTENT.MOVE_LEFT, 10);
      }
    });
  }
}
