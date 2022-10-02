import "reflect-metadata";
import { container } from "tsyringe";
import "@moose-rocket/game";
import { SocketServer } from "./server/SocketServer";

container.resolve(SocketServer);
