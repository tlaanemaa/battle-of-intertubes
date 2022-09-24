export class KeyHandler {
  private readonly key = "d7a6f927-ae99-47c9-8a4c-b57502b9f249";

  public getKey(): string {
    return this.key;
  }

  public keyIsValid(key: string): boolean {
    return key === this.key;
  }
}
