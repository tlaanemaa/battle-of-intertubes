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
  private pinchStartCoordinatesA?: Object2D;
  private pinchStartCoordinatesB?: Object2D;
  private pinchCurrentCoordinatesA?: Object2D;
  private pinchCurrentCoordinatesB?: Object2D;

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
      if (event.deltaY > 0)
        this.trigger(INTENT.ZOOM_OUT, Math.abs(event.deltaY));
      if (event.deltaY < 0)
        this.trigger(INTENT.ZOOM_IN, Math.abs(event.deltaY));
    });
    window.addEventListener("keydown", (event: KeyboardEvent) => {
      this.pressedKeys.add(event.key);
    });
    window.addEventListener("keyup", (event: KeyboardEvent) => {
      this.pressedKeys.delete(event.key);
    });
    window.addEventListener("touchstart", (event: TouchEvent) => {
      event.preventDefault();
      if (event.touches.length > 1) {
        this.pinchStartCoordinatesA = {
          x: event.touches[0].pageX,
          y: event.touches[0].pageY,
        };
        this.pinchStartCoordinatesB = {
          x: event.touches[1].pageX,
          y: event.touches[1].pageY,
        };
      } else {
        this.touchStartCoordinates = {
          x: event.touches[0].pageX,
          y: event.touches[0].pageY,
        };
      }
    });
    window.addEventListener("touchmove", (event: TouchEvent) => {
      event.preventDefault();
      if (this.pinchCurrentCoordinatesA) {
        this.pinchCurrentCoordinatesA = {
          x: event.touches[0].pageX,
          y: event.touches[0].pageY,
        };
        this.pinchCurrentCoordinatesB = {
          x: event.touches[1].pageX,
          y: event.touches[1].pageY,
        };
      } else {
        this.touchCurrentCoordinates = {
          x: event.touches[0].pageX,
          y: event.touches[0].pageY,
        };
      }
    });
    window.addEventListener("touchend", () => {
      event.preventDefault();
      this.pinchStartCoordinatesA = undefined;
      this.pinchStartCoordinatesB = undefined;
      this.pinchCurrentCoordinatesA = undefined;
      this.pinchCurrentCoordinatesB = undefined;
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
    if (
      this.pinchStartCoordinatesA &&
      this.pinchStartCoordinatesB &&
      this.pinchCurrentCoordinatesA &&
      this.pinchCurrentCoordinatesB
    ) {
      const startDistance = this.distance(
        this.pinchStartCoordinatesA.x,
        this.pinchStartCoordinatesA.y,
        this.pinchStartCoordinatesB.x,
        this.pinchStartCoordinatesB.y
      );
      const currentDistance = this.distance(
        this.pinchCurrentCoordinatesA.x,
        this.pinchCurrentCoordinatesA.y,
        this.pinchCurrentCoordinatesB.x,
        this.pinchCurrentCoordinatesB.y
      );

      if (currentDistance > startDistance) {
        this.trigger(INTENT.ZOOM_IN, 100);
      } else if (currentDistance < startDistance) {
        this.trigger(INTENT.ZOOM_OUT, 100);
      }
    }

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

  private distance(x0: number, y0: number, x1: number, y1: number) {
    return Math.sqrt(Math.pow(x0 - x1, 2) + Math.pow(y0 - y1, 2));
  }
}
