import { AssetCache } from "./AssetCache";

export class Sound {
  private audioBlob?: string;

  constructor(src?: string) {
    if (src) this.setAudio(src);
  }

  public play() {
    if (this.audioBlob) {
      new Audio(this.audioBlob).play();
    }
  }

  private async setAudio(src: string) {
    this.audioBlob = await AssetCache.getInstance().get(src);
  }
}
