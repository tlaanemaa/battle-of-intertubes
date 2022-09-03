import { PhysicalObject } from "./PhysicalObject";

const round = (number: number, digits = 2) => {
  const multiplier = 10 ** digits;
  return Math.round(number * multiplier) / multiplier;
};

describe("PhysicalObject", () => {
  describe("calculateDistanceTraveled", () => {
    it("calculates the distance traveled correctly", () => {
      // A bit of a hack here to test private methods but it'd be way too difficult to test the calculations otherwise
      const physicalObject = new PhysicalObject();

      expect(
        round(physicalObject["calculateDistanceTraveled"](50, 5.4, 0.95), 9)
      ).toBe(235.833179933);

      expect(
        round(
          physicalObject["calculateDistanceTraveled"](
            75.07543,
            7.80643,
            0.982098
          ),
          9
        )
      ).toBe(546.623985394);

      expect(
        round(
          physicalObject["calculateDistanceTraveled"](
            662.0949877,
            0.069823,
            0.0947345
          ),
          9
        )
      ).toBe(42.626240409);
    });
  });

  describe("calculateCurrentVelocity", () => {
    it("calculates the velocity correctly", () => {
      // A bit of a hack here to test private methods but it'd be way too difficult to test the calculations otherwise
      const physicalObject = new PhysicalObject();

      expect(
        round(physicalObject["calculateCurrentVelocity"](50, 5.4, 0.95), 3)
      ).toBe(37.903);

      expect(
        round(
          physicalObject["calculateCurrentVelocity"](
            75.07543,
            7.80643,
            0.982098
          ),
          10
        )
      ).toBe(65.2011163329);

      expect(
        round(
          physicalObject["calculateCurrentVelocity"](
            662.0949877,
            0.069823,
            0.0947345
          ),
          10
        )
      ).toBe(561.6387057634);
    });
  });
});
