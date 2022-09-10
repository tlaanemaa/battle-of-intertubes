import { injectable } from "tsyringe";
import { Entity } from "../model/Entity";
import { Grid } from "../model/Grid";

@injectable()
export class Collider {
  private collisionSearchRadius = 500;
  private collisionElasticity = 1;

  public calculate(entities: Entity[]) {
    const grid = new Grid<Entity>(this.collisionSearchRadius);
    entities.forEach((entity) => grid.set(entity));

    entities.forEach((entity) => {
      let hasCollisions = false;
      grid
        .getArea(
          entity.x - this.collisionSearchRadius,
          entity.y - this.collisionSearchRadius,
          entity.x + this.collisionSearchRadius,
          entity.y + this.collisionSearchRadius
        )
        .forEach((neighbor) => {
          if (this.areColliding(entity, neighbor)) {
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
            hasCollisions = true;
          }
        });

      entity.isColliding = hasCollisions;
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
