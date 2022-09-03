import { Entity } from "./Entity";

export class PhysicalObject implements Entity {
  public readonly texture: CanvasImageSource;
  public readonly height = 20;
  public readonly width = 40;

  private lastCalculationTime = Date.now();
  private mass = 1000;
  private dragCoefficient = 0.95; // in a second
  private speedX = 0; // meter per sec
  private speedY = 0; // meter per sec
  private _x = 0;
  private _y = 0;

  constructor() {
    this.texture = new Image();
    this.texture.src =
      "https://images.vexels.com/media/users/3/227446/isolated/lists/7867873566b6dda4db49b5d752009b07-cute-moose-flat.png";
  }

  public get x() {
    this.recalculatePosition();
    return this._x;
  }

  public get y() {
    this.recalculatePosition();
    return this._y;
  }

  public applyForce(forceX: number, forceY: number) {
    this.recalculatePosition();
    this.speedX += forceX / this.mass;
    this.speedY += forceY / this.mass;
  }

  private recalculatePosition() {
    const timeDiffSeconds = (Date.now() - this.lastCalculationTime) / 1000;
    this.lastCalculationTime = Date.now();

    this.speedX *= this.dragCoefficient ** timeDiffSeconds;
    this.speedY *= this.dragCoefficient ** timeDiffSeconds;

    // We need to calculate the definite integral in the range of 0 - seconds passed
    // for this function "y = 0.95^x * 50" where 95 is the coef and 50 is starting speed
    // to get the cumulative distance moved in the time period.
    // Use this to fool around with the numbers: https://www.desmos.com/calculator
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
  public getDistanceTraveled(
    initialVelocity: number,
    secondsPassed: number,
    dragCoefficient = this.dragCoefficient
  ) {
    const integralAtStart = (1 / Math.log(dragCoefficient)) * initialVelocity;
    const integralAtEnd =
      (Math.pow(dragCoefficient, secondsPassed) / Math.log(dragCoefficient)) *
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
  public getCurrentVelocity(
    initialVelocity: number,
    secondsPassed: number,
    dragCoefficient = this.dragCoefficient
  ) {
    return initialVelocity * Math.pow(dragCoefficient, secondsPassed);
  }
}
