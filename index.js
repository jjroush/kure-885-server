import readline from "readline";
import EventEmitter from "events";
class MyEmitter extends EventEmitter {}
import WebSocket from "ws";
import icy from "icy";

import {
  registerSpotify,
  buildSongQueryFromMetadata,
  getSpotifySong
} from "./spotify.js";

const server = new WebSocket.Server(
  { port: 8080 },
  console.log("server started on port 8080")
);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

registerSpotify();

setTimeout(() => {}, 2000);

let currentSong;

const myEmitter = new MyEmitter();

icy.get("http://kure-network.stuorg.iastate.edu:8000/KUREBroadcast", res => {
  // log any "metadata" events that happen
  res.on("metadata", function(metadata) {
    var parsed = icy.parse(metadata);
    console.error(parsed);
    console.log("parsed-song", buildSongQueryFromMetadata(parsed));
    currentSong = getSpotifySong(buildSongQueryFromMetadata(parsed));
  });

  res.resume();
});

server.on("connection", ws => {
  ws.on("message", message => {
    console.log("received: %s", message);
  });

  myEmitter.on("event", () => {
    ws.send("initial message");
  });

  rl.on("line", input => {
    ws.send(JSON.stringify(currentSong));
  });
});
