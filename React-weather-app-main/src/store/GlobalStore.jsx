import * as React from "react";
import WeatherStore from "./WeatherContext";
import SpotifyStore from "./SpotifyContext";

const GlobalStore = ({ children }) => {
  return (
    <WeatherStore>
      <SpotifyStore>{children}</SpotifyStore>
    </WeatherStore>
  );
};

export default GlobalStore;
