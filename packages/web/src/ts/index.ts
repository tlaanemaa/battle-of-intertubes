import "reflect-metadata";
import { container, Lifecycle } from "tsyringe";
import "@moose-rocket/game";
import { Game } from "@moose-rocket/core";
import { FrameTimer } from "./components";
import { EntityRenderer, BackgroundRenderer } from "./renderer";
import { WebUserInput, WebTextureLoader, WebAudioLoader } from "./services";

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

container.resolve<Game>("Game").init();
