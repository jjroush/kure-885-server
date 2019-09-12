import events from "events";
import WebSocket from "ws";
import icy from "icy";

import {
  registerSpotify,
  buildSongQueryFromMetadata,
  getSpotifySong
} from "./spotify.js";

registerSpotify();

const server = new WebSocket.Server(
  { port: 8080 },
  console.log("server started on port 8080")
);

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
    console.log(parsed);
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
    ws.send(JSON.stringify(currentSong));
  });

  console.log("users connected", server.clients.size);
});
