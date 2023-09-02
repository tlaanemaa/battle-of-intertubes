export class BaseMessage {
  public serialize() {
    return JSON.stringify(this, (k, v) => {
      if (v != null) return v;
    });
  }
}
