import "reflect-metadata";
import { container } from "@moose-rocket/container";
import { SocketServer } from "./server/SocketServer";

container.get(SocketServer);
