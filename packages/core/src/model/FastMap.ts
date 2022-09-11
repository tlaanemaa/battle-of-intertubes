type Key = string | number;

export class FastMap<Value> {
  private readonly map: { [key: Key]: Value } = {};

  public isEmpty(): boolean {
    return this.size === 0;
  }

  public has(key: Key): boolean {
    return this.map[key] != null;
  }

  public get(key: Key): Value | undefined {
    return this.map[key];
  }

  public set(key: Key, value: Value): void {
    this.map[key] = value;
  }

  public delete(key: Key): boolean {
    return delete this.map[key];
  }

  public values(): Value[] {
    return Object.values(this.map);
  }

  public get size(): number {
    return Object.keys(this.map).length;
  }
}
