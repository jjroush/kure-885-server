import readline from "readline";
import events from "events";
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

setTimeout(() => {}, 3000);

const EventEmitter = new events.EventEmitter();

let currentSong;

const songHandler = result => {
  currentSong = result;
  EventEmitter.emit("event");
};

icy.get("http://kure-network.stuorg.iastate.edu:8000/KUREBroadcast", res => {
  // log any "metadata" events that happen
  res.on("metadata", function(metadata) {
    var parsed = icy.parse(metadata);

    console.log("parsed-song", buildSongQueryFromMetadata(parsed));
    getSpotifySong(buildSongQueryFromMetadata(parsed))
      .then(result => songHandler(result))
      .catch(err => console.log(err));
  });

  res.resume();
});

server.on("connection", ws => {
  ws.on("message", message => {
    console.log("received: %s", message);
  });

  ws.send(JSON.stringify(currentSong));

  EventEmitter.on("event", () => {
    console.log("event found");
    ws.send(JSON.stringify(currentSong));
  });

  console.log("users connected", server.clients.size);
});
