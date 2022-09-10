import { v4 as uuidV4 } from "uuid";
import { Object2D } from "../types/interfaces";
import { Texture } from "./Texture";

export abstract class Entity {
  public abstract texture: Texture;

  public readonly id = uuidV4();
  public x = 0;
  public y = 0;
  public height = 50;
  public width = 50;
  public dragCoefficient = 0.05;
  public rotation = 0;
  public velocity: Object2D = { x: 0, y: 0 };
  public mass = 1000;
  public children?: Entity[];
  public isColliding?: boolean;

  private lastCalculationTime = Date.now();

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
   * Recalculates the position and velocity of the object
   */
  public recalculatePosition() {
    const now = Date.now();
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
}
