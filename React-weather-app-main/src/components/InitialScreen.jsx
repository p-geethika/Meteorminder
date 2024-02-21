import { useEffect, useState } from "react";

import "./../App.css";
import "../TextStyle";
import logo from "./../mlh-prep.png";
import AutoComp from "./AutoComp";
import React from "react";
import TempConvert from "./TempConvert";
import { useWeatherContext } from "../store/WeatherContext";
import TopBar from "./TopBar";
import { Grid } from "@mui/material";

import sunny_img from "../weatherImage/sunny.png";
import snow_img from "../weatherImage/snow.png";
import rain_img from "../weatherImage/rain.jpeg";
import thunderstorm_img from "../weatherImage/Thunderstorm.png";
import cloudy_img from "../weatherImage/cloud.jpeg";
import fog_img from "../weatherImage/fog.jpg";
import unknown_img from "../weatherImage/unknown.jpeg";
import {
  MainScreenCondition,
  MainScreenTemp,
  SmallText,
  SmallTextBold,
  Title,
  ScrollingText,
} from "../TextStyle";
import AirQuality from "./AirQuality";
import LoadingSpinner from "./LoadingSpinner";

function InitialScreen() {
  const {
    yourLocation,
    error,
    isVarLoaded,
    favCities,
    screenWidth,
    screenHeight,
    noLocation,
  } = useWeatherContext();

  if (error) {
    return <div>Error: {error.message}</div>;
  } else {
    const currentWeatherTextAreaHeight = screenWidth > 600 ? "100px" : "150px";

    return (
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={2}
      >
        <Grid item>
          <Grid item maxHeight="15%">
            <TopBar></TopBar>
          </Grid>
          <Grid item maxHeight={currentWeatherTextAreaHeight}>
            <Title
              text={
                noLocation
                  ? "Default location weather:"
                  : "Your current location weather:"
              }
              color="White"
            />
          </Grid>

          <Grid item maxHeight="425px">
            <div align="center">
              {isVarLoaded ? (
                <BigCard
                  city={yourLocation}
                  screenWidth={screenWidth}
                  screenHeight={screenHeight}
                />
              ) : (
                <LoadingSpinner />
              )}
            </div>
          </Grid>

          <Grid item maxHeight="500px">
            <InitialScreenUserSection
              favCities={favCities}
              screenWidth={screenWidth}
              screenHeight={screenHeight}
            />
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export default InitialScreen;

export function InitialScreenUserSection({
  favCities,
  screenWidth,
  screenHeight,
}) {
  if (favCities === null || favCities.length === 0) {
    return (
      <>
        <Title text="Hi there!" color="White" /> <br></br>
        <Title text="You have no favorite city." color="White" />
      </>
    );
  } else {
    const cityBigCards = favCities.map((city) => (
      <div key={city} style={{ display: "inline-block", padding: "10px" }}>
        <BigCard city={city} screenWidth={600} screenHeight={screenHeight} />
      </div>
    ));

    return (
      <>
        <Title text="Here's your favorite cities' weather now:" color="White" />
        <div style={{ height: "40px" }}></div>
        <div
          style={{
            width: "100%",
            height: "500px",
            overflowX: "auto",
            whiteSpace: "nowrap",
          }}
        >
          {cityBigCards}
        </div>
      </>
    );
  }
}

export function BigCard({ city, screenWidth, screenHeight }) {
  const [error, setError] = useState(null);
  const [isVarLoaded, setIsVarLoaded] = useState(false);
  const [results, setResults] = useState(null);
  const { setCity, changeScreen, unit } = useWeatherContext();

  var api_url = "https://api.openweathermap.org/data/2.5/weather?q=" + city;

  if (unit === "F") {
    api_url += "&units=metric";
  } else {
    api_url += "&units=imperial";
  }

  api_url += "&appid=" + process.env.REACT_APP_APIKEY;

  useEffect(() => {
    console.log("Unit Has changed:", unit);
    fetch(api_url)
      .then((res) => res.json())
      .then(
        (result) => {
          if (result["cod"] !== 200) {
            setIsVarLoaded(false);
          } else {
            setIsVarLoaded(true);
            setResults(result);
            console.log("Result:", result);
          }
        },
        (error) => {
          setIsVarLoaded(true);
          setError(error);
        }
      );
  }, [city, unit]);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  // Reference: OpenWeatherAPI documentation
  // https://openweathermap.org/weather-conditions#Weather-Condition-Codes-2
  const background = (condition_code) => {
    if (condition_code < 300) {
      return `url(${thunderstorm_img})`;
    } else if (condition_code < 600) {
      return `url(${rain_img})`;
    } else if (condition_code < 700) {
      return `url(${snow_img})`;
    } else if (condition_code == 800) {
      return `url(${sunny_img})`;
    } else if (800 < condition_code && condition_code < 900) {
      return `url(${cloudy_img})`;
    } else {
      return `url(${fog_img})`;
    }
  };

  const speed = unit === "C" ? "kph" : "mph";
  const oppositeUnit = unit === "C" ? "F" : "C";

  const handleClick = () => {
    setCity(city);
    changeScreen();
  };

  let cityString = city;
  if (cityString.length > 15) {
    cityString = cityString.slice(0, 15) + "...";
  }

  return (
    <>
      {isVarLoaded && !!results && (
        <>
          <div
            className="BigCard"
            onClick={handleClick}
            style={{
              backgroundImage: background(results.weather[0].id),
              width: screenWidth * 0.8,
            }}
          >
            <div align="left">
              <MainScreenTemp text={cityString} color="White" />
            </div>

            <div align="center">
              <MainScreenTemp
                text={results.main.temp + "°" + oppositeUnit}
                color="White"
              />{" "}
              <br></br>
              <MainScreenCondition
                text={results.weather[0].main}
                color="White"
              />
            </div>

            <div style={{ height: "40px" }}></div>

            <BigCardStatContainer
              screenWidth={screenWidth}
              results={results}
              unit={unit}
              speed={speed}
            />
          </div>
        </>
      )}
    </>
  );
}

export function BigCardStatContainer({ screenWidth, results, unit, speed }) {
  const oppositeUnit = unit === "C" ? "F" : "C";
  if (screenWidth > 700) {
    return (
      <div id="container" style={{ minHeight: "50px" }}>
        {!!results && (
          <div id="inner">
            <div class="child" style={{ width: "25%" }}>
              <BigCardStatArea
                firstLine={"Air Quality"}
                secondLine={
                  <AirQuality
                    city={results.name}
                    lat={results.coord.lat}
                    lon={results.coord.lon}
                  ></AirQuality>
                }
              />
            </div>
            <div class="child" style={{ width: "25%" }}>
              <BigCardStatArea
                firstLine={"Humidity"}
                secondLine={results.main.humidity + "%"}
              />
            </div>
            <div class="child" style={{ width: "25%" }}>
              <BigCardStatArea
                firstLine={"Feel like"}
                secondLine={results.main.feels_like + "°" + oppositeUnit}
              />
            </div>
            <div class="child" style={{ width: "25%" }}>
              <BigCardStatArea
                firstLine={"Wind speed"}
                secondLine={results.wind.speed + speed}
              />
            </div>
          </div>
        )}
      </div>
    );
  } else {
    return (
      <div>
        {!!results && (
          <div id="container">
            <div id="inner">
              <div class="child" style={{ width: "50%" }}>
                <BigCardStatArea
                  firstLine={"Air Quality"}
                  secondLine={
                    <AirQuality
                      city={results.name}
                      lat={results.coord.lat}
                      lon={results.coord.lon}
                    ></AirQuality>
                  }
                />
              </div>
              <div class="child" style={{ width: "50%" }}>
                <BigCardStatArea
                  firstLine={"Humidity"}
                  secondLine={results.main.humidity + "%"}
                />
              </div>
            </div>
            <div style={{ height: "40px" }}></div>
            <div id="inner">
              <div class="child" style={{ width: "50%" }}>
                <BigCardStatArea
                  firstLine={"Feel like"}
                  secondLine={results.main.feels_like + "°" + unit}
                />
              </div>
              <div class="child" style={{ width: "50%" }}>
                <BigCardStatArea
                  firstLine={"Wind speed"}
                  secondLine={results.wind.speed + speed}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export function BigCardStatArea({ firstLine, secondLine }) {
  return (
    <>
      <div align="center">
        <SmallTextBold text={firstLine} color="white" />
      </div>
      <div align="center">
        <SmallText text={secondLine} color="white" />
      </div>
    </>
  );
}
