import readline from "readline";

import WebSocket from "ws";
import icy from "icy";

import { registerSpotify } from "./spotify.js";

const server = new WebSocket.Server(
  { port: 8080 },
  console.log("server started on port 8080")
);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

registerSpotify();

const currentSong = {
  title: "",
  artist: "",
  album: "",
  image: ""
};

rl.on("line", input => {
  spotifyApi.searchTracks(input, { limit: 1 }).then(
    data => {
      console.log(`Search tracks by: ${input}`, data.body);
      console.log(data.body.tracks.items[0]);
      currentSong.title = data.body.tracks.items[0].name;
      currentSong.artist = data.body.tracks.items[0].artists.name;
    },
    err => {
      console.log("Something went wrong!", err);
    }
  );
});

icy.get("http://kure-network.stuorg.iastate.edu:8000/KUREBroadcast", res => {
  // log the HTTP response headers
  console.error(res.headers);
  // log any "metadata" events that happen
  res.on("metadata", function(metadata) {
    var parsed = icy.parse(metadata);
    console.error(parsed);
  });

  res.resume();
});

server.on("connection", ws => {
  ws.on("message", message => {
    console.log("received: %s", message);
  });

  ws.send("initial message");

  rl.on("line", input => {
    ws.send(JSON.stringify(currentSong));
  });
});
