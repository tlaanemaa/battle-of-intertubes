import { Entity } from "./Entity";

const round = (number: number, digits = 2) => {
  const multiplier = 10 ** digits;
  return Math.round(number * multiplier) / multiplier;
};

class MockEntity extends Entity {
  public texture = null!;
}

describe("PhysicalEntity", () => {
  describe("calculateDistanceTraveled", () => {
    it("calculates the distance traveled correctly", () => {
      // A bit of a hack here to test private methods but it'd be way too difficult to test the calculations otherwise
      const physicalEntity = new MockEntity();

      expect(
        round(physicalEntity["calculateDistanceTraveled"](50, 5.4, 0.05), 9),
      ).toBe(235.833179933);

      expect(
        round(
          physicalEntity["calculateDistanceTraveled"](
            75.07543,
            7.80643,
            0.017902,
          ),
          9,
        ),
      ).toBe(546.623985394);

      expect(
        round(
          physicalEntity["calculateDistanceTraveled"](
            662.0949877,
            0.069823,
            0.9052655,
          ),
          9,
        ),
      ).toBe(42.626240409);
    });
  });

  describe("calculateCurrentVelocity", () => {
    it("calculates the velocity correctly", () => {
      // A bit of a hack here to test private methods but it'd be way too difficult to test the calculations otherwise
      const physicalEntity = new MockEntity();

      expect(
        round(physicalEntity["calculateCurrentVelocity"](50, 5.4, 0.05), 3),
      ).toBe(37.903);

      expect(
        round(
          physicalEntity["calculateCurrentVelocity"](
            75.07543,
            7.80643,
            0.017902,
          ),
          10,
        ),
      ).toBe(65.2011163329);

      expect(
        round(
          physicalEntity["calculateCurrentVelocity"](
            662.0949877,
            0.069823,
            0.9052655,
          ),
          10,
        ),
      ).toBe(561.6387057634);
    });
  });

  describe("getHeading", () => {
    it("calculates the heading correctly for positive x and negative y", () => {
      const physicalEntity = new MockEntity();

      physicalEntity.velocity = { x: 10, y: -10 };
      expect(physicalEntity.getHeading()).toBe(45);

      physicalEntity.velocity = { x: 15, y: -10 };
      expect(physicalEntity.getHeading()).toBe(56.309932474020215);
    });

    it("calculates the heading correctly for positive x and y", () => {
      const physicalEntity = new MockEntity();

      physicalEntity.velocity = { x: 10, y: 10 };
      expect(physicalEntity.getHeading()).toBe(135);

      physicalEntity.velocity = { x: 15, y: 10 };
      expect(physicalEntity.getHeading()).toBe(123.69006752597979);
    });

    it("calculates the heading correctly for negative x and positive y", () => {
      const physicalEntity = new MockEntity();

      physicalEntity.velocity = { x: -10, y: 10 };
      expect(physicalEntity.getHeading()).toBe(225);

      physicalEntity.velocity = { x: -15, y: 10 };
      expect(physicalEntity.getHeading()).toBe(236.30993247402023);
    });

    it("calculates the heading correctly for negative x and y", () => {
      const physicalEntity = new MockEntity();

      physicalEntity.velocity = { x: -10, y: -10 };
      expect(physicalEntity.getHeading()).toBe(315);

      physicalEntity.velocity = { x: -15, y: -10 };
      expect(physicalEntity.getHeading()).toBe(303.69006752597977);
    });
  });
});
