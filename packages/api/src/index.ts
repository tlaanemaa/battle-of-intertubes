import "reflect-metadata";
import { WebSocketServer } from "ws";
import { Parser } from "@battle-of-intertubes/core";

const PORT = parseInt(process.env.PORT!) || 8080;
const wss = new WebSocketServer({ port: PORT }, () =>
  console.log(`Websocket server listening at ws://localhost:${PORT}`)
);

wss.on("connection", (ws) => {
  ws.on("message", (data) => {
    const message = Parser.parse(data.toString());
    console.log(message);
  });
});
