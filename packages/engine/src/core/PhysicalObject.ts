import { Object2D } from "./interfaces";

export class PhysicalObject {
  public height: number = 50;
  public width: number = 50;

  private lastCalculationTime = Date.now();
  private _x = 0;
  private _y = 0;
  private _dragCoefficient = 0.95; // in a second (FIXME: This makes no sense, fix this)
  private _velocity: Object2D = { x: 0, y: 0 };
  private _mass = 1000;

  private get positionIsStale() {
    return Date.now() - this.lastCalculationTime > 10;
  }

  public get x() {
    if (this.positionIsStale) this.recalculatePosition();
    return this._x;
  }

  public set x(x: number) {
    this.recalculatePosition();
    this._x = x;
  }

  public get y() {
    if (this.positionIsStale) this.recalculatePosition();
    return this._y;
  }

  public set y(y: number) {
    this.recalculatePosition();
    this._y = y;
  }

  public get dragCoefficient() {
    return this._dragCoefficient;
  }

  public set dragCoefficient(value: number) {
    this.recalculatePosition();
    this._dragCoefficient = value;
  }

  public get velocity() {
    if (this.positionIsStale) this.recalculatePosition();
    return this._velocity;
  }

  public set velocity(velocity: Object2D) {
    this.recalculatePosition();
    this._velocity = { ...velocity };
  }

  public get mass() {
    return this._mass;
  }

  public set mass(mass: number) {
    this._mass = mass;
  }

  public applyForce(force: Object2D) {
    this.recalculatePosition();
    this._velocity.x += force.x / this.mass;
    this._velocity.y += force.y / this.mass;
  }

  /**
   * Recalculates the position and velocity of the object
   */
  public recalculatePosition() {
    const now = Date.now();
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
    dragCoefficient = this.dragCoefficient
  ) {
    const integralAtStart = (1 / Math.log(dragCoefficient)) * initialVelocity;
    const integralAtEnd =
      (Math.pow(dragCoefficient, secondsElapsed) / Math.log(dragCoefficient)) *
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
    return initialVelocity * Math.pow(dragCoefficient, secondsElapsed);
  }
}
