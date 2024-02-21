import "./App.css";
import { useWeatherContext } from "./store/WeatherContext";
import InitialScreen from "./components/InitialScreen";
import SecondaryScreen from "./components/SecondaryScreen";
import { useEffect } from "react";

function App() {
  const { screen, favCities, setFavCities, screenWidth, screenHeight, setScreenWidth, setScreenHeight } = useWeatherContext();

  useEffect(() => {
    if (favCities === null) {
      const storedCities = window.localStorage.getItem("MLH_FAV_CITIES");
      if (storedCities) {
        setFavCities(JSON.parse(storedCities));
      }
    }

    function handleResize() {
      setScreenWidth(window.innerWidth);
      setScreenHeight(window.innerHeight);
      console.log("Screen width: ", screenWidth);
      console.log("Screen height: ", screenHeight);
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    }
  });

  return <>{!screen ? <InitialScreen /> : <SecondaryScreen />}</>;
}

export default App;
