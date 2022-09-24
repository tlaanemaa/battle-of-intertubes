import "reflect-metadata";
import { container } from "tsyringe";
import { SocketServer } from "./services/SocketServer";

container.resolve(SocketServer);
