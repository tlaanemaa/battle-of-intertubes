export class KeyHandler {
  private static readonly key = "d7a6f927-ae99-47c9-8a4c-b57502b9f249";

  public static getKey(): string {
    return this.key;
  }

  public static keyIsValid(key: string): boolean {
    return key === this.key;
  }
}
