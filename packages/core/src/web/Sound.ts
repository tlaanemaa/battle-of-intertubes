export class Sound {
  constructor(private readonly src: string) {}

  public play() {
    new Audio(this.src).play();
  }
}
