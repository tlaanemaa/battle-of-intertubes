type K = string;

export class FastMap<V> {
  private readonly map: { [key: K]: V } = {};

  public get(key: K): V | undefined {
    return this.map[key];
  }

  public set(key: K, value: V): void {
    this.map[key] = value;
  }

  public delete(key: K): boolean {
    return delete this.map[key];
  }

  public values(): V[] {
    return Object.values(this.map);
  }

  public get size(): number {
    return Object.keys(this.map).length;
  }
}
