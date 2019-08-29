import readline from "readline";

import WebSocket from "ws";

const server = new WebSocket.Server(
  { port: 8080 },
  console.log("server started on port 8080")
);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

server.on("connection", ws => {
  ws.on("message", message => {
    console.log("received: %s", message);
  });

  ws.send("initial message");

  rl.on("line", input => {
    ws.send(input);
  });
});
