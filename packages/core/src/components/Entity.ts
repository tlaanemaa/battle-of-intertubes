import { container } from "tsyringe";
import { v4 as uuidV4 } from "uuid";
import { AudioLoader, TextureLoader, Texture } from "../types";
import { Object2D } from "../primitives";

export class Entity {
  // Properties
  public readonly id = uuidV4();
  public texture?: Texture;
  private _x = 0;
  private _y = 0;
  public width = 50;
  public height = 50;
  public dragCoefficient = 0.05;
  public rotation = 0;
  public velocity: Object2D = { x: 0, y: 0 };
  public mass = 1000;
  public children?: Entity[];

  // Flags
  public keepHeading = false;
  public collisionsEnabled = true;
  public isColliding?: boolean;

  // Event handler callbacks
  public onChange?: () => void;
  public onCollision?: (target: Entity) => void;

  // Internal data
  private lastCalculationTime = Date.now();
  private targetRotation = this.rotation;
  private readonly rotationDegreesPerSec = 720;

  // Hooks into services
  protected readonly textureLoader: TextureLoader =
    container.resolve("TextureLoader");
  protected readonly audioLoader: AudioLoader =
    container.resolve("AudioLoader");

  public get x() {
    this.recalculatePosition();
    return this._x;
  }

  public set x(value: number) {
    this._x = value;
  }

  public get y() {
    this.recalculatePosition();
    return this._y;
  }

  public set y(value: number) {
    this._y = value;
  }

  /**
   * Calculates the current heading in degrees.
   * 0 is up (x: 0, y: -1)
   */
  public getHeading() {
    const addition = this.velocity.x < 0 ? 180 : 0;
    return (
      90 -
      Math.atan(-this.velocity.y / this.velocity.x) * (180 / Math.PI) +
      addition
    );
  }

  public applyForce(force: Object2D) {
    this.recalculatePosition();
    this.velocity.x += force.x / this.mass;
    this.velocity.y += force.y / this.mass;
  }

  /**
   * Applies rotation in a smooth fashion
   */
  public setRotation(angle: number) {
    this.targetRotation = angle;
  }

  /**
   * Recalculates the position and velocity of the object
   */
  public recalculatePosition(force = false) {
    const now = Date.now();
    if (!force && now - this.lastCalculationTime < 8) return;
    const secondsElapsed = (now - this.lastCalculationTime) / 1000;
    this.lastCalculationTime = now;

    this.x += this.calculateDistanceTraveled(this.velocity.x, secondsElapsed);
    this.y += this.calculateDistanceTraveled(this.velocity.y, secondsElapsed);
    this.velocity.x = this.calculateCurrentVelocity(
      this.velocity.x,
      secondsElapsed
    );
    this.velocity.y = this.calculateCurrentVelocity(
      this.velocity.y,
      secondsElapsed
    );
    if (this.keepHeading) this.setRotation(this.getHeading());
    this.rotation += this.calculateRotationChange(secondsElapsed);
    this.triggerOnChange();
  }

  protected triggerOnChange() {
    if (this.onChange) this.onChange();
  }

  public triggerCollision(target: Entity) {
    if (this.onCollision) this.onCollision(target);
  }

  /**
   * Calculates the distance traveled using a definite integral of the velocity function.
   * The range of integration is from 0 to the number of seconds passed since last measurement.
   *
   * The velocity function is as follows:
   * ```
   * y = d^x * c
   * ```
   * where:
   * - c: initial velocity
   * - d: drag coefficient
   * - x: seconds elapsed since the initial velocity was measured
   * - y: current velocity
   *
   * This assumes that the drag coefficient is applied to the velocity by multiplication every second.
   */
  private calculateDistanceTraveled(
    initialVelocity: number,
    secondsElapsed: number,
    dragCoefficient = this.dragCoefficient
  ) {
    // A good calculator to visualize this stuff: https://www.desmos.com/calculator
    const dragMultiplier = 1 - dragCoefficient;
    const integralAtStart = (1 / Math.log(dragMultiplier)) * initialVelocity;
    const integralAtEnd =
      (Math.pow(dragMultiplier, secondsElapsed) / Math.log(dragMultiplier)) *
      initialVelocity;

    return integralAtEnd - integralAtStart;
  }

  /**
   * Calculates current velocity given initial velocity, seconds traveled and a drag coefficient
   *
   * The velocity function is as follows:
   * ```
   * y = d^x * c
   * ```
   * where:
   * - c: initial velocity
   * - d: drag coefficient
   * - x: seconds elapsed since the initial velocity was measured
   * - y: current velocity
   *
   * This assumes that the drag coefficient is applied to the velocity by multiplication every second.
   */
  private calculateCurrentVelocity(
    initialVelocity: number,
    secondsElapsed: number,
    dragCoefficient = this.dragCoefficient
  ) {
    const dragMultiplier = 1 - dragCoefficient;
    return initialVelocity * Math.pow(dragMultiplier, secondsElapsed);
  }

  private calculateRotationChange(secondsElapsed: number): number {
    if (this.targetRotation === this.rotation) return 0;

    const rotationRemaining =
      ((this.targetRotation - this.rotation + 540) % 360) - 180;

    if (rotationRemaining > 0) {
      return Math.min(
        this.rotationDegreesPerSec * secondsElapsed,
        rotationRemaining
      );
    } else if (rotationRemaining < 0) {
      return Math.max(
        -this.rotationDegreesPerSec * secondsElapsed,
        rotationRemaining
      );
    } else {
      return 0;
    }
  }
}
