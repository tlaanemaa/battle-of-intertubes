import { container, Lifecycle } from "tsyringe";
import {
  AudioLoader,
  BackgroundRenderer,
  EntityRenderer,
  TextureLoader,
  Timer,
  UserInput,
} from "@moose-rocket/core";
import { ServerAudioLoader } from "./ServerAudioLoader";
import { ServerBackgroundRenderer } from "./ServerBackgroundRenderer";
import { ServerEntityRenderer } from "./ServerEntityRenderer";
import { ServerTextureLoader } from "./ServerTextureLoader";
import { ServerTimer } from "./ServerTimer";
import { ServerUserInput } from "./UserInput";

/**
 * FIXME: Dirty hack to temporarily allow running stuff that
 * relies on window in the server
 */
(global as any).window = { innerWidth: 1000, innerHeight: 1000 };

container.register<Timer>(
  "Timer",
  { useClass: ServerTimer },
  { lifecycle: Lifecycle.Singleton }
);
container.register<UserInput>(
  "UserInput",
  { useClass: ServerUserInput },
  { lifecycle: Lifecycle.Singleton }
);
container.register<BackgroundRenderer>(
  "BackgroundRenderer",
  { useClass: ServerBackgroundRenderer },
  { lifecycle: Lifecycle.Singleton }
);
container.register<EntityRenderer>(
  "EntityRenderer",
  { useClass: ServerEntityRenderer },
  { lifecycle: Lifecycle.Singleton }
);
container.register<TextureLoader>(
  "TextureLoader",
  { useClass: ServerTextureLoader },
  { lifecycle: Lifecycle.Singleton }
);
container.register<AudioLoader>(
  "AudioLoader",
  { useClass: ServerAudioLoader },
  { lifecycle: Lifecycle.Singleton }
);
