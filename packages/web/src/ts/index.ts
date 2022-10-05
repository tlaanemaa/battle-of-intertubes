import "reflect-metadata";
import { container } from "@moose-rocket/container";
import { DEPENDENCIES, Game } from "@moose-rocket/core";
import "@moose-rocket/game";
import "./components";
import "./renderer";
import "./services";

container.get<Game>(DEPENDENCIES.Game).init();
