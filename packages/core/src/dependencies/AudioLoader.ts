export interface Audio {
  play(): void;
}

export interface AudioLoader {
  load(src: string): Audio;
}
