import * as React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { useLoadScript } from "@react-google-maps/api";

const WeatherContext = createContext(undefined);

export const useWeatherContext = () => {
  const weatherContext = useContext(WeatherContext);
  if (weatherContext === undefined) {
    throw new Error("useWeatherContext must be called inside a GlobalStore");
  }
  return weatherContext;
};

const WeatherStore = ({ children }) => {
  const [screen, setScreen] = useState(false);
  const [error, setError] = useState(null);
  const [isVarLoaded, setIsVarLoaded] = useState(false);
  const [city, setCity] = useState("Your location");
  const [temp, setTemp] = useState(null);
  const [unit, setUnit] = useState("C");
  const [results, setResults] = useState(null);
  const [yourLocation, setYourLocation] = useState("Your location");
  const [favCities, setFavCities] = useState(null);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
    libraries: ["places"],
  });
  const [condition, setCondition] = useState(0);
  const [location, setLocation] = useState({ lat: 0, lng: 0 });
  const [hourlyForecast, setHourlyForecast] = useState(null);
  const [weeklyForecast, setWeeklyForecast] = useState(null);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [screenHeight, setScreenHeight] = useState(window.innerHeight);
  const [noLocation, setNoLocation] = useState(false);

  const cityHandler = (city) => {
    if (city === "Your location") {
      setCity(yourLocation);
    } else {
      setCity(city);
      setScreen(true);
    }
  };

  const tempHandler = (temp, unit) => {
    setTemp(temp);
    setUnit(unit);
  };

  const changeScreen = () => {
    setScreen((prev) => !prev);
  };

  const addFavorite = (city) => {
    if (favCities === null) {
      setFavCities([city]);
      window.localStorage.setItem("MLH_FAV_CITIES", JSON.stringify([city]));
    } else {
      const cityIndex = favCities.indexOf(city);

      if (cityIndex > -1) {
        console.log(city, "already in favorite");
        return false;
      }

      setFavCities([...favCities, city]);

      // save to local storage
      window.localStorage.setItem(
        "MLH_FAV_CITIES",
        JSON.stringify([...favCities, city])
      );
    }

    console.log(city, "added to favorite city.");
    console.log(
      "local storage's favCities = ",
      JSON.parse(window.localStorage.getItem("MLH_FAV_CITIES"))
    );
    return true;
  };

  const deleteFromFavorite = (cityToDelete) => {
    // Find the index of the city you want to delete
    const cityIndex = favCities.indexOf(city);

    if (cityIndex > -1) {
      // Remove the city from the array using splice
      const newArray = favCities.filter((city) => city !== cityToDelete);
      setFavCities(newArray);

      // Store the updated array back in local storage
      window.localStorage.setItem("MLH_FAV_CITIES", JSON.stringify(favCities));

      console.log(city, "removed from favorite city.");
      console.log("Current fav_cities = ", favCities);
      return true;
    } else {
      console.log(city, "is not in favCities");
      return false;
    }
  };

  const favoriteContain = (city) => {
    if (favCities === null) {
      return false;
    } else {
      return favCities.indexOf(city) > -1;
    }
  };

  const options = {
    timeout: 5000,
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        let coordX = position.coords.latitude;
        let coordY = position.coords.longitude;
        setLocation({ lat: coordX, lng: coordY });
        fetch(
          "https://api.openweathermap.org/geo/1.0/reverse?lat=" +
            coordX +
            "&lon=" +
            coordY +
            "&appid=" +
            process.env.REACT_APP_APIKEY
        )
          .then((res) => {
            return res.json();
          })
          .then((result) => {
            setCity(result[0].name);
            setYourLocation(result[0].name);
            setCondition(result.weather[0].id);
            setLocation({
              lat: parseFloat(result[0].lat),
              lng: parseFloat(result[0].lon),
            });
          });
      },
      (err) => {
        console.log("Error:");
        console.log(err);
        let coordY = 40.73061;
        let coordX = -73.935242;
        setLocation({ lat: coordX, lng: coordY });
        setCity("New York City");
        console.log("Hello");
        setYourLocation("New York City");
        setNoLocation(true);
      },
      options
    );
  }, []);

  useEffect(() => {
    fetch(
      "https://api.openweathermap.org/data/2.5/weather?q=" +
        city +
        "&units=metric" +
        "&appid=" +
        process.env.REACT_APP_APIKEY
    )
      .then((res) => res.json())
      .then(
        (result) => {
          if (result["cod"] !== 200) {
            setIsVarLoaded(false);
          } else {
            setIsVarLoaded(true);
            setResults(result);
            setCondition(result.weather[0].id);
            setLocation({
              lat: parseFloat(result[0].lat),
              lng: parseFloat(result[0].lon),
            });
          }
        },
        (error) => {
          setIsVarLoaded(true);
          setError(error);
        }
      );
  }, [city]);

  useEffect(() => {
    if (results !== null) {
      if (unit === "F") {
        let newT = results.main.temp * 1.8 + 32;
        setTemp(newT);
      } else {
        setTemp(results.main.temp);
      }
    }
  }, [results]);

  useEffect(() => {
    if (!results) return;

    const fetchForecast = async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${process.env.REACT_APP_APIKEY}`
        );
        const data = await response.json();
        console.log("Forecast Data: ", data);

        // Hourly Forecast: slice the list array to get the next 24 hours of data
        if (unit === "C") {
          const hourlyForecastData = data.list.slice(0, 8).map((item) => ({
            date: item.dt_txt,
            temp: item.main.temp,
            description: item.weather[0].description,
            icon: item.weather[0].icon,
          }));
          setHourlyForecast(hourlyForecastData);
        } else {
          const hourlyForecastData = data.list.slice(0, 8).map((item) => ({
            date: item.dt_txt,
            temp: (item.main.temp * 1.8 + 32).toFixed(2),
            description: item.weather[0].description,
            icon: item.weather[0].icon,
          }));
          setHourlyForecast(hourlyForecastData);
        }

        // Weekly Forecast: group the list array by date to get 7 days of data
        if (unit === "C") {
          const weeklyForecastData = data.list.reduce((acc, item) => {
            const date = item.dt_txt.split(" ")[0];
            const hour = item.dt_txt.split(" ")[1];
            if (hour === "12:00:00") {
              acc.push({
                date,
                temp: item.main.temp,
                description: item.weather[0].description,
                icon: item.weather[0].icon,
              });
            }
            return acc;
          }, []);
          setWeeklyForecast(weeklyForecastData.slice(0, 7));
        } else {
          const weeklyForecastData = data.list.reduce((acc, item) => {
            const date = item.dt_txt.split(" ")[0];
            const hour = item.dt_txt.split(" ")[1];
            if (hour === "12:00:00") {
              acc.push({
                date,
                temp: (item.main.temp * 1.8 + 32).toFixed(2),
                description: item.weather[0].description,
                icon: item.weather[0].icon,
              });
            }
            return acc;
          }, []);
          setWeeklyForecast(weeklyForecastData.slice(0, 7));
        }
      } catch (error) {
        console.log("Error fetching forecast data: ", error);
      }
    };

    fetchForecast();
  }, [results, location, unit, city]);

  const weatherStoreValues = {
    location,
    setLocation,
    yourLocation,
    setYourLocation,
    screen,
    setScreen,
    error,
    setError,
    isLoaded,
    isVarLoaded,
    setIsVarLoaded,
    city,
    setCity,
    temp,
    setTemp,
    unit,
    setUnit,
    results,
    setResults,
    cityHandler,
    tempHandler,
    changeScreen,
    favCities,
    setFavCities,
    addFavorite,
    deleteFromFavorite,
    favoriteContain,
    condition,
    hourlyForecast,
    setHourlyForecast,
    weeklyForecast,
    setWeeklyForecast,
    screenWidth,
    setScreenWidth,
    screenHeight,
    setScreenHeight,
    noLocation,
  };

  return (
    <WeatherContext.Provider value={weatherStoreValues}>
      {children}
    </WeatherContext.Provider>
  );
};
export default WeatherStore;
