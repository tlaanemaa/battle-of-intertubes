export class PerlinNoise {
  private p: number[];

  constructor(seed?: number) {
    this.p = new Array(512);
    this.setSeed(seed);
  }

  private setSeed(seed?: number): void {
    if (typeof seed === "number" && isFinite(seed)) {
      for (let i = 0; i < 512; i++) {
        this.p[i] = Math.floor(Math.abs(seed) * 256);
      }
    } else {
      // Use a default unseeded permutation
      for (let i = 0; i < 512; i++) {
        this.p[i] = Math.floor(Math.random() * 256);
      }
    }
  }

  private fade(t: number): number {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  private lerp(t: number, a: number, b: number): number {
    return a + t * (b - a);
  }

  private grad(hash: number, x: number, y: number): number {
    const h = hash & 7; // Convert low 3 bits of hash code into gradient value
    const u = h < 4 ? x : y; // Select the gradient direction
    const v = h < 4 ? y : x;
    return ((h & 1) !== 0 ? -u : u) + ((h & 2) !== 0 ? -v : v);
  }

  noise(x: number, y: number): number {
    // Determine grid cell coordinates
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;

    // Relative coordinates within the cell
    x -= Math.floor(x);
    y -= Math.floor(y);

    // Compute the fade curves for x and y
    const u = this.fade(x);
    const v = this.fade(y);

    // Hash coordinates of the 4 corners of the cell
    const a = this.p[X] + Y;
    const b = this.p[X + 1] + Y;

    // And add blended results from 4 corners of the cell
    return this.lerp(
      v,
      this.lerp(u, this.grad(this.p[a], x, y), this.grad(this.p[b], x - 1, y)),
      this.lerp(
        u,
        this.grad(this.p[a + 1], x, y - 1),
        this.grad(this.p[b + 1], x - 1, y - 1)
      )
    );
  }
}

