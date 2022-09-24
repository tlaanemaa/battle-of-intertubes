import { Audio } from "./Audio";

export interface AudioLoader {
  load(src: string): Audio;
}
