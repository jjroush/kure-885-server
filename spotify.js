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

export const getSongFromMetadata = string => {
  spotifyApi.search(input, { limit: 1 }).then(
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
};
