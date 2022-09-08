import { Entity } from "./Entity";
import { Object2D } from "./interfaces";

export class PhysicalEntity extends Entity {
  public height: number = 50;
  public width: number = 50;

  private lastCalculationTime = Date.now();
  private _x = 0;
  private _y = 0;
  private _dragCoefficient = 0.05;
  private _velocity: Object2D = { x: 0, y: 0 };
  private _mass = 1000;

  public get x() {
    this.recalculatePosition();
    return this._x;
  }

  public set x(x: number) {
    this.recalculatePosition(true);
    this._x = x;
  }

  public get y() {
    this.recalculatePosition();
    return this._y;
  }

  public set y(y: number) {
    this.recalculatePosition(true);
    this._y = y;
  }

  public get dragCoefficient() {
    return this._dragCoefficient;
  }

  public set dragCoefficient(value: number) {
    this.recalculatePosition(true);
    this._dragCoefficient = value;
  }

  public get velocity() {
    this.recalculatePosition();
    return this._velocity;
  }

  public set velocity(velocity: Object2D) {
    this.recalculatePosition(true);
    this._velocity = { ...velocity };
  }

  public get mass() {
    return this._mass;
  }

  public set mass(mass: number) {
    this._mass = mass;
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
    this.recalculatePosition(true);
    this._velocity.x += force.x / this.mass;
    this._velocity.y += force.y / this.mass;
  }

  /**
   * Recalculates the position and velocity of the object
   */
  public recalculatePosition(force = false) {
    const now = Date.now();
    if (!force && now - this.lastCalculationTime < 10) return;
    const secondsElapsed = (now - this.lastCalculationTime) / 1000;
    this.lastCalculationTime = now;

    this._x += this.calculateDistanceTraveled(this._velocity.x, secondsElapsed);
    this._y += this.calculateDistanceTraveled(this._velocity.y, secondsElapsed);
    this._velocity.x = this.calculateCurrentVelocity(
      this._velocity.x,
      secondsElapsed
    );
    this._velocity.y = this.calculateCurrentVelocity(
      this._velocity.y,
      secondsElapsed
    );
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
    dragCoefficient = this._dragCoefficient
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
    dragCoefficient = this._dragCoefficient
  ) {
    const dragMultiplier = 1 - dragCoefficient;
    return initialVelocity * Math.pow(dragMultiplier, secondsElapsed);
  }
}
