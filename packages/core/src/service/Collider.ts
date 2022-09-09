import { singleton } from "tsyringe";
import { Entity } from "../model/Entity";
import { PhysicalEntity } from "../model/PhysicalEntity";
import { EntityStore } from "./EntityStore";

@singleton()
export class Collider {
  private collisionSearchRadius = 10;
  private collisionElasticity = 1;

  constructor(private readonly store: EntityStore) {}

  public calculate() {
    console.log("CollisionCalc")
    this.store.getAll().forEach((entity) => {
      if (!(entity instanceof PhysicalEntity)) return;

      this.store
        .getEntitiesInAnArea(
          entity.x - this.collisionSearchRadius,
          entity.y - this.collisionSearchRadius,
          2 * this.collisionSearchRadius,
          2 * this.collisionSearchRadius
        )
        .forEach((neighbor) => {
          if (
            neighbor instanceof PhysicalEntity &&
            this.areColliding(entity, neighbor)
          ) {
            const { newVelocityA: newVelocityAx, newVelocityB: newVelocityBx } =
              this.calculateNewVelocities(
                entity.velocity.x,
                entity.mass,
                neighbor.velocity.x,
                neighbor.mass
              );

            const { newVelocityA: newVelocityAy, newVelocityB: newVelocityBy } =
              this.calculateNewVelocities(
                entity.velocity.y,
                entity.mass,
                neighbor.velocity.y,
                neighbor.mass
              );

            entity.velocity = { x: newVelocityAx, y: newVelocityAy };
            neighbor.velocity = { x: newVelocityBx, y: newVelocityBy };
          }
        });
    });
  }

  private areColliding(objectA: Entity, objectB: Entity) {
    if (objectA.y + objectA.height / 2 < objectB.y - objectB.height / 2) {
      return false;
    }
    if (objectA.y - objectA.height / 2 > objectB.y + objectB.height / 2) {
      return false;
    }
    if (objectA.x + objectA.width / 2 < objectB.x - objectB.width / 2) {
      return false;
    }
    if (objectA.y - objectA.width / 2 > objectB.y + objectB.width / 2) {
      return false;
    }
    return true;
  }

  private calculateNewVelocities(
    velocityA: number,
    massA: number,
    velocityB: number,
    massB: number
  ) {
    const elasticity = this.collisionElasticity;
    const totalMomentum = massA * velocityA + massB * velocityB;
    const totalMass = massA + massB;

    const newVelocityA =
      (elasticity * massB * (velocityB - velocityA) + totalMomentum) /
      totalMass;

    const newVelocityB =
      (elasticity * massA * (velocityA - velocityB) + totalMomentum) /
      totalMass;

    return { newVelocityA, newVelocityB };
  }
}
