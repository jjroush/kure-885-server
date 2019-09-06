import { secrets } from "./secrets.js";
import SpotifyWebApi from "spotify-web-api-node";

const spotifyApi = new SpotifyWebApi({
  clientId: secrets.clientId,
  clientSecret: secrets.clientSecret
});

export const registerSpotify = () => {
  spotifyApi.clientCredentialsGrant().then(
    data => {
      console.log("The access token expires in " + data.body["expires_in"]);
      console.log("The access token is " + data.body["access_token"]);

      // Save the access token so that it's used in future calls
      spotifyApi.setAccessToken(data.body["access_token"]);
    },
    err => {
      console.log("Something went wrong when retrieving an access token", err);
    }
  );
};

export const getSpotifySong = input => {
  if (input === false) {
    return;
  }

  const currentSong = {
    title: "",
    artist: "",
    album: "",
    image: "",
    url: ""
  };

  spotifyApi.search(input, ["track"], { limit: 1 }).then(
    data => {
      currentSong.title = data.body.tracks.items[0].name;
      currentSong.artist = data.body.tracks.items[0].artists.name;
      currentSong.url = data.body.tracks.items[0].external_urls.spotify;
    },
    err => {
      console.log("Something went wrong!", err);
    }
  );

  return currentSong;
};

export const buildSongQueryFromMetadata = string => {
  if (string.StreamTitle.charAt(0) == "[") {
    return false;
  }

  const values = string.StreamTitle.split(" - ");

  if (values[1].slice(0, 5) === "[Reco]") {
    values[1] = values[1].slice(5);
  }

  // if (values.length === 3) {
  //   return {
  //     title: values[1],
  //     band: values[0],
  //     album: values[2]
  //   };
  // }

  return values.join(" ");
};
