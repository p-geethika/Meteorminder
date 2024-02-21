import * as React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { useLoadScript } from "@react-google-maps/api";
import { useWeatherContext } from "./WeatherContext";

const SpotifyContext = createContext(undefined);

export const useSpotifyContext = () => {
  const spotifyContext = useContext(SpotifyContext);
  if (spotifyContext === undefined) {
    throw new Error("useWeatherContext must be called inside a GlobalStore");
  }
  return spotifyContext;
};

const playListURIs = {
  0: "spotify:playlist:37i9dQZF1DWV7EzJMK2FUI",
  500: "spotify:playlist:37i9dQZF1DWVV27DiNWxkR",
  501: "spotify:playlist:37i9dQZF1DWVV27DiNWxkR",
  502: "spotify:playlist:37i9dQZF1DWVV27DiNWxkR",
  503: "spotify:playlist:37i9dQZF1DWVV27DiNWxkR",
  504: "spotify:playlist:37i9dQZF1DWVV27DiNWxkR",
  511: "spotify:playlist:37i9dQZF1DWVV27DiNWxkR",
  520: "spotify:playlist:37i9dQZF1DWVV27DiNWxkR",
  521: "spotify:playlist:37i9dQZF1DWVV27DiNWxkR",
  522: "spotify:playlist:37i9dQZF1DWVV27DiNWxkR",
  531: "spotify:playlist:37i9dQZF1DWVV27DiNWxkR",
  800: "spotify:playlist:37i9dQZF1DX3rxVfibe1L0",
  751: "spotify:playlist:5KlUhhSR7sZOdl8Hxy3Guz",
  200: "spotify:album:6pYNEn4tMc6gdv5fIZf5yn",
  201: "spotify:album:6pYNEn4tMc6gdv5fIZf5yn",
  202: "spotify:album:6pYNEn4tMc6gdv5fIZf5yn",
  210: "spotify:album:6pYNEn4tMc6gdv5fIZf5yn",
  211: "spotify:album:6pYNEn4tMc6gdv5fIZf5yn",
  212: "spotify:album:6pYNEn4tMc6gdv5fIZf5yn",
  221: "spotify:album:6pYNEn4tMc6gdv5fIZf5yn",
  230: "spotify:album:6pYNEn4tMc6gdv5fIZf5yn",
  231: "spotify:album:6pYNEn4tMc6gdv5fIZf5yn",
  232: "spotify:album:6pYNEn4tMc6gdv5fIZf5yn",
  300: "spotify:playlist:37i9dQZF1DX7qK8ma5wgG1",
  301: "spotify:playlist:37i9dQZF1DX7qK8ma5wgG1",
  302: "spotify:playlist:37i9dQZF1DX7qK8ma5wgG1",
  310: "spotify:playlist:37i9dQZF1DX7qK8ma5wgG1",
  311: "spotify:playlist:37i9dQZF1DX7qK8ma5wgG1",
  312: "spotify:playlist:37i9dQZF1DX7qK8ma5wgG1",
  313: "spotify:playlist:37i9dQZF1DX7qK8ma5wgG1",
  314: "spotify:playlist:37i9dQZF1DX7qK8ma5wgG1",
  321: "spotify:playlist:37i9dQZF1DX7qK8ma5wgG1",
  600: "spotify:playlist:37i9dQZF1DX6R7QUWePReA",
  601: "spotify:playlist:37i9dQZF1DX6R7QUWePReA",
  602: "spotify:playlist:37i9dQZF1DX6R7QUWePReA",
  611: "spotify:playlist:37i9dQZF1DX6R7QUWePReA",
  612: "spotify:playlist:37i9dQZF1DX6R7QUWePReA",
  613: "spotify:playlist:37i9dQZF1DX6R7QUWePReA",
  615: "spotify:playlist:37i9dQZF1DX6R7QUWePReA",
  616: "spotify:playlist:37i9dQZF1DX6R7QUWePReA",
  620: "spotify:playlist:37i9dQZF1DX6R7QUWePReA",
  621: "spotify:playlist:37i9dQZF1DX6R7QUWePReA",
  622: "spotify:playlist:37i9dQZF1DX6R7QUWePReA",
  801: "spotify:playlist:37i9dQZF1DX0MLFaUdXnjA",
  802: "spotify:playlist:37i9dQZF1DX0MLFaUdXnjA",
  803: "spotify:playlist:37i9dQZF1DX0MLFaUdXnjA",
  804: "spotify:playlist:37i9dQZF1DX0MLFaUdXnjA",
  701: "spotify:playlist:37i9dQZF1DWXRqgorJj26U",
  711: "spotify:playlist:37i9dQZF1DWXRqgorJj26U",
  721: "spotify:playlist:37i9dQZF1DWXRqgorJj26U",
  731: "spotify:playlist:37i9dQZF1DWXRqgorJj26U",
  741: "spotify:playlist:37i9dQZF1DWXRqgorJj26U",
  762: "spotify:playlist:37i9dQZF1DWXRqgorJj26U",
  781: "spotify:playlist:37i9dQZF1DWXRqgorJj26U",
};

const track = {
  name: "",
  album: {
    images: [{ url: "" }],
  },
  artists: [{ name: "" }],
};

const SpotifyStore = ({ children }) => {
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
  const CLIENT_SECRET = process.env.REACT_APP_SPOTIFY_CLIENT_KEY;
  const REDIRECT_URI = process.env.REACT_APP_SPOTIFY_REDIRECT_URI;
  const RESPONSE_TYPE = "token";
  const scope =
    "streaming \
        user-read-currently-playing\
        user-read-playback-state\
        user-modify-playback-state\
        playlist-read-collaborative";

  const [token, setToken] = useState("");
  const [player, setPlayer] = useState(undefined);
  const [music, setMusic] = useState(new Audio());
  const [is_paused, setPaused] = useState(false);
  const [is_active, setActive] = useState(false);
  const [current_track, setTrack] = useState(track);
  const [img, setImg] = useState("");
  const { condition } = useWeatherContext();

  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");
    if (!token && hash) {
      token = hash
        .substring(1)
        .split("&")
        .find((elem) => elem.startsWith("access_token"))
        .split("=")[1];

      window.location.hash = "";
      window.localStorage.setItem("token", token);

      console.log(token);
    }
    setToken(token);
  }, []);

  const logout = () => {
    if (player !== undefined) {
      setToken("");
      player.disconnect();
      setPlayer(undefined);
    }
    window.localStorage.removeItem("token");
  };

  useEffect(() => {
    if (token !== "") {
      const script = document.createElement("script");
      script.src = "https://sdk.scdn.co/spotify-player.js";
      script.async = true;

      document.body.appendChild(script);
      window.onSpotifyWebPlaybackSDKReady = () => {
        // Define the Spotify Connect device, getOAuthToken has an actual token
        // hardcoded for the sake of simplicity
        let player = new window.Spotify.Player({
          name: "A Spotify Web SDK Player",
          getOAuthToken: (callback) => {
            callback(token);
          },
          volume: 0.1,
        });

        // Called when connected to the player created beforehand successfully
        player.addListener("ready", ({ device_id }) => {
          console.log("Ready with Device ID", device_id);

          const play = ({
            context_uri,
            playerInstance: {
              _options: { getOAuthToken, id },
            },
          }) => {
            getOAuthToken((access_token) => {
              fetch(
                `https://api.spotify.com/v1/me/player/play?device_id=${device_id}`,
                {
                  method: "PUT",
                  body: JSON.stringify({ context_uri: context_uri }),
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${access_token}`,
                  },
                }
              );
            });
          };

          player.addListener("player_state_changed", (state) => {
            if (!state) {
              return;
            }
            setTrack(state.track_window.current_track);

            setPaused(state.paused);

            player.getCurrentState().then((state) => {
              if (!state) {
                setActive(false);
              } else {
                setActive(true);
                if (state.track_window.current_track) {
                  setImg(state.track_window.current_track.album.images[0].url);
                }
              }
            });
          });
          console.log("Cond", condition, playListURIs[condition]);
          play({
            playerInstance: player,
            context_uri:
              condition === 0 || condition === undefined
                ? playListURIs[0]
                : playListURIs[condition],

            position_ms: 0,
          });
        });

        player.connect();
        setPlayer(player);
      };
    }
  }, [token]);

  const spotifyStoreValues = {
    token,
    setToken,
    logout,
    player,
    setPlayer,
    music,
    scope,
    setMusic,
    is_paused,
    setPaused,
    is_active,
    setActive,
    current_track,
    setTrack,
    AUTH_ENDPOINT,
    CLIENT_ID,
    REDIRECT_URI,
    RESPONSE_TYPE,
    img,
  };

  return (
    <SpotifyContext.Provider value={spotifyStoreValues}>
      {children}
    </SpotifyContext.Provider>
  );
};
export default SpotifyStore;
