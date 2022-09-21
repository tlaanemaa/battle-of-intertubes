export class Message {
  public serialize() {
    return JSON.stringify(this);
  }

  public static from(messageString: string) {
    // We kind of assume these messages are always correct, might want to add some validation later
    const objectLiteral = JSON.parse(messageString) as Message;
    return Object.assign(new Message(), objectLiteral);
  }
}
