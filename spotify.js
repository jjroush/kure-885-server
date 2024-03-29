import { secrets } from "./secrets.js";
import SpotifyWebApi from "spotify-web-api-node";

const spotifyApi = new SpotifyWebApi({
  clientId: secrets.clientId,
  clientSecret: secrets.clientSecret
});

export const registerSpotify = () => {
  spotifyApi.clientCredentialsGrant().then(
    data => {
      console.log("The access token is " + data.body["access_token"]);

      // Save the access token so that it's used in future calls
      spotifyApi.setAccessToken(data.body["access_token"]);
      return true;
    },
    err => {
      console.log("Something went wrong when retrieving an access token", err);
    }
  );
};

export const getSpotifySong = async input => {
  if (!input) {
    return;
  }

  console.log(input);

  const currentSong = {
    spotify: {
      title: "",
      artist: "",
      album: "",
      image: "",
      url: ""
    },
    raw: ""
  };

  currentSong.raw = input;

  if (input.charAt(0) == "[") {
    currentSong.spotify = false;
    return currentSong;
  }

  if (input == "line2") {
  }

  await spotifyApi.search(input, ["track"], { limit: 1 }).then(
    data => {
      console.log("results", data.body.tracks.total);
      if (data.body.tracks.total === 0) {
        return currentSong;
      }

      currentSong.spotify.album = data.body.tracks.items[0].album.name;
      currentSong.spotify.title = data.body.tracks.items[0].name;
      currentSong.spotify.artist = data.body.tracks.items[0].artists[0].name;
      currentSong.spotify.url = data.body.tracks.items[0].external_urls.spotify;
      currentSong.spotify.image = data.body.tracks.items[0].album.images[1].url;
    },
    err => {
      console.log("Something went wrong!", err);
      if (err.statusCode === 401) {
        registerSpotify();
      }
    }
  );

  return currentSong;
};

export const buildSongQueryFromMetadata = string => {
  const values = string.StreamTitle.split(" - ");

  if (values.length > 2) {
    if (values[1].slice(0, 5) === "[Reco]") {
      values[1] = values[1].slice(5);
    }
  }

  return values
    .join(" ")
    .replace(/\[.*?\]/, "")
    .replace(/\[.*?\]/, "")
    .replace(/\uFFFD/g, "");
};
