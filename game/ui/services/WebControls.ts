import { injectable } from "inversify";
import { Object2D, UserInput, INTENT, Clock } from "@/game/core";
import { container } from "@/game/container";

@injectable()
export class WebControls {
  public target?: string;

  private pinchStartCoordinatesA?: Object2D;
  private pinchStartCoordinatesB?: Object2D;
  private pinchCurrentCoordinatesA?: Object2D;
  private pinchCurrentCoordinatesB?: Object2D;

  private touchStartCoordinates?: Object2D;
  private touchCurrentCoordinates?: Object2D;

  private readonly pressedKeys = new Set<string>();

  constructor(clock: Clock, private readonly userInput: UserInput) {
    this.attachListeners();
    clock.schedulePrimary(this.handlePressedKeys.bind(this));
  }

  private attachListeners() {
    window.addEventListener("wheel", (event: WheelEvent) => {
      if (!this.target) return;

      if (event.deltaY > 0) {
        this.userInput.trigger(this.target, INTENT.ZOOM_OUT);
      }

      if (event.deltaY < 0) {
        this.userInput.trigger(this.target, INTENT.ZOOM_IN);
      }
    });

    window.addEventListener("keydown", (event: KeyboardEvent) => {
      this.pressedKeys.add(event.code);
    });
    window.addEventListener("keyup", (event: KeyboardEvent) => {
      this.pressedKeys.delete(event.code);
    });

    window.addEventListener(
      "touchstart",
      (event: TouchEvent) => {
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

        this.handleTouch();
      },
      { passive: false }
    );
    window.addEventListener(
      "touchmove",
      (event: TouchEvent) => {
        event.preventDefault();
        if (this.pinchStartCoordinatesA) {
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

        this.handleTouch();
      },
      { passive: false }
    );
    window.addEventListener(
      "touchend",
      (event) => {
        event.preventDefault();
        this.pinchStartCoordinatesA = undefined;
        this.pinchStartCoordinatesB = undefined;
        this.pinchCurrentCoordinatesA = undefined;
        this.pinchCurrentCoordinatesB = undefined;
        this.touchStartCoordinates = undefined;
        this.touchCurrentCoordinates = undefined;

        this.handleTouch();
      },
      { passive: false }
    );
  }

  private handlePressedKeys() {
    this.pressedKeys.forEach((keyName) => {
      if (!this.target) return;
      switch (keyName) {
        case "ArrowUp":
          return this.userInput.trigger(this.target, INTENT.MOVE_UP);
        case "ArrowRight":
          return this.userInput.trigger(this.target, INTENT.MOVE_RIGHT);
        case "ArrowDown":
          return this.userInput.trigger(this.target, INTENT.MOVE_DOWN);
        case "ArrowLeft":
          return this.userInput.trigger(this.target, INTENT.MOVE_LEFT);
        case "Space":
          return this.userInput.trigger(this.target, INTENT.SHOOT);
      }
    });
  }

  private handleTouch() {
    if (!this.target) return;

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
        this.userInput.trigger(this.target, INTENT.ZOOM_IN);
      } else if (currentDistance < startDistance) {
        this.userInput.trigger(this.target, INTENT.ZOOM_OUT);
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
        this.userInput.trigger(this.target, INTENT.MOVE_LEFT);
      }
      if (scaledX > 0) {
        this.userInput.trigger(this.target, INTENT.MOVE_RIGHT);
      }
      if (scaledY < 0) {
        this.userInput.trigger(this.target, INTENT.MOVE_UP);
      }
      if (scaledY > 0) {
        this.userInput.trigger(this.target, INTENT.MOVE_DOWN);
      }
    }
  }

  private distance(x0: number, y0: number, x1: number, y1: number) {
    return Math.sqrt(Math.pow(x0 - x1, 2) + Math.pow(y0 - y1, 2));
  }
}

container.bind(WebControls).toSelf().inSingletonScope();
