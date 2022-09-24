import "reflect-metadata";
import { container, Lifecycle } from "tsyringe";
import { Game } from "@battle-of-intertubes/game";
import { FrameTimer } from "./components/FrameTimer";
import { EntityRenderer } from "./renderer/EntityRenderer";
import { BackgroundRenderer } from "./renderer/BackgroundRenderer";
import { WebUserInput } from "./services/WebUserInput";
import { WebTextureLoader } from "./services/WebTextureLoader";
import { WebAudioLoader } from "./services/WebAudioLoader";

container.register(
  "Timer",
  { useClass: FrameTimer },
  { lifecycle: Lifecycle.Singleton }
);
container.register(
  "UserInput",
  { useClass: WebUserInput },
  { lifecycle: Lifecycle.Singleton }
);
container.register(
  "BackgroundRenderer",
  { useClass: BackgroundRenderer },
  { lifecycle: Lifecycle.Singleton }
);
container.register(
  "EntityRenderer",
  { useClass: EntityRenderer },
  { lifecycle: Lifecycle.Singleton }
);
container.register(
  "TextureLoader",
  { useClass: WebTextureLoader },
  { lifecycle: Lifecycle.Singleton }
);
container.register(
  "AudioLoader",
  { useClass: WebAudioLoader },
  { lifecycle: Lifecycle.Singleton }
);

container.resolve(Game).init();
