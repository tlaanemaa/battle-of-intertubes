import { Entity } from "../model/Entity";
import { Grid } from "../primitives/Grid";

export class Collider {
  private readonly collisionSearchRadius = 200;
  private readonly collisionElasticity = 1;
  private readonly grid = new Grid<Entity>(this.collisionSearchRadius);

  constructor(private readonly entities: Entity[]) {
    this.entities.forEach((entity) => this.grid.set(entity));
  }

  /**
   * Calculates collisions between all provided entities and assigns new velocities based on that.
   */
  public calculate() {
    const calculated = new Set();

    this.entities.forEach((entity) => {
      let hasCollisions = false;
      this.grid
        .getArea(
          entity.x - this.collisionSearchRadius,
          entity.y - this.collisionSearchRadius,
          entity.x + this.collisionSearchRadius,
          entity.y + this.collisionSearchRadius
        )
        .forEach((neighbor) => {
          // TODO: Optimize this
          const pairId = [entity.id, neighbor.id].sort().join();

          if (
            entity === neighbor ||
            calculated.has(pairId) ||
            !this.areColliding(entity, neighbor) ||
            this.areMovingApart(entity, neighbor)
          ) {
            return;
          }

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
          calculated.add(pairId);
          hasCollisions = true;
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
    if (objectA.x - objectA.width / 2 > objectB.x + objectB.width / 2) {
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

  // TODO: This is really wonky
  private areMovingApart(entityA: Entity, entityB: Entity): boolean {
    const distanceNow = Math.sqrt(
      Math.pow(entityA.x - entityB.x, 2) + Math.pow(entityA.y - entityB.y, 2)
    );

    const distanceNext = Math.sqrt(
      Math.pow(
        entityA.x +
          entityA.velocity.x / 1000000000 -
          (entityB.x + entityB.velocity.x / 1000000000),
        2
      ) +
        Math.pow(
          entityA.y +
            entityA.velocity.y / 1000000000 -
            (entityB.y + entityB.velocity.y / 1000000000),
          2
        )
    );

    return distanceNext > distanceNow;
  }
}
