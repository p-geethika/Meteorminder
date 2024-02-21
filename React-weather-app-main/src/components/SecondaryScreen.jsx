import React, { useRef, useEffect, useState } from "react";
import { useWeatherContext } from "../store/WeatherContext";
import { Button, Grid } from "@mui/material";
import TopBar from "./TopBar";
import {
  MainScreenCondition,
  MainScreenTemp,
  SmallText,
  SmallTextBold,
  Title,
  ScrollingText
} from "../TextStyle";
import back_button from "../components/BackButton.png";
import favorite from "../components/Favorite.png";
import favorite_hollow from "../components/Favorite_hollow.png";
import AirQuality1 from "./AirQuality/AirQuality";
import AirQuality from "./AirQuality";
import { Modal } from "react-bootstrap";
import Map from "./Map/Map";
// import SongRecommendation from "./SongRecommendation/SongRecommendation";
import { requiredThings } from "./../assets/constants";
import EquipmentTable from "./EquipmentTable";
import EquipmentCard from "./EquipmentCard";
import Forecast from "./Forecast/Forecast";
import WeeklyForecast from "./WeeklyForecast/WeeklyForecast";

function SecondaryScreen() {
  const {
    city,
    setCity,
    yourLocation,
    temp,
    unit,
    isLoaded,
    results,
    error,
    isVarLoaded,
    changeScreen,
    favCities,
    addFavorite,
    deleteFromFavorite,
    favoriteContain,
    location,
    weeklyForecast,
    screenWidth,
    setScreenWidth,
    screenHeight,
    setScreenHeight,
  } = useWeatherContext();
  const [showModal, setShowModal] = useState(false);

  let fav_img = favoriteContain(city) ? favorite : favorite_hollow;

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  const handleFavClick = () => {
    if (fav_img === favorite) {
      // remove
      fav_img = deleteFromFavorite(city) ? favorite_hollow : favorite;
    } else {
      // add
      fav_img = addFavorite(city) ? favorite : favorite_hollow;
    }
  };

  const handleBackButtonClick = () => {
    changeScreen();
    setCity(yourLocation);
  };

  const leftSectionCardStyle = {
    minHeight: "60vh",
    WebkitBackdropFilter: "blur(5px)",
    backdropFilter: "blur(5px)",
    borderRadius: "8px",
    boxShadow: "0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)",
    backgroundColor: "rgba(229, 195, 195, 0.25)",
  };

  const rightSectionCardStyle = {
    maxHeight: "250px",
    WebkitBackdropFilter: "blur(5px)",
    backdropFilter: "blur(5px)",
    borderRadius: "8px",
    boxShadow: "0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)",
    backgroundColor: "rgba(229, 195, 195, 0.25)",
    padding: "20px",
  };

  const hourlyForecastCard = isVarLoaded && results && <Forecast city={city} />;

  const mapCard = location.lat && location.lng && <Map city={city} />;

  const equipmentCard = !!results.weather && !!results.weather[0].main && (
                        <EquipmentTable
                          equipments={requiredThings[results.weather[0].main]}
                        />
                      );

  const aqCard = <div className="aq-container">
    <AirQuality1 city={city} />
  </div>;
  
  const weeklyForecastCard = isVarLoaded && results && (
    <WeeklyForecast weeklyForecast={weeklyForecast} />
  );

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (results === null) {
    return (
      <div style={{display: "flex", 
        justifyContent: "center", 
        alignItems: "center",
        height: "100vh",
        flexDirection: "column"}}>
        <div>Sorry, we will get back soon. </div> <br></br>
        <div>Err: results is null. Check if API key expired. </div>
      </div>
      );
  } else {

    if (screenWidth < 560) {
      return (
        <SmallScreenLayout handleBackButtonClick = {handleBackButtonClick} 
        temp={temp} results={results} handleFavClick={handleFavClick} 
        leftSectionCardStyle={leftSectionCardStyle}
        rightSectionCardStyle={rightSectionCardStyle}
        city={city} unit={unit} fav_img={fav_img}
        hourlyForecastCard={hourlyForecastCard} mapCard={mapCard} equipmentCard={equipmentCard}
        aqCard={aqCard} weeklyForecastCard={weeklyForecastCard} />
      )
    }

    if (screenWidth < 1080) {
      return (
        <MediumScreenLayout handleBackButtonClick = {handleBackButtonClick} 
        temp={temp} results={results} handleFavClick={handleFavClick} 
        leftSectionCardStyle={leftSectionCardStyle}
        rightSectionCardStyle={rightSectionCardStyle}
        city={city} unit={unit} fav_img={fav_img}
        hourlyForecastCard={hourlyForecastCard} mapCard={mapCard} equipmentCard={equipmentCard}
        aqCard={aqCard} weeklyForecastCard={weeklyForecastCard} />
      )
    }

    return (
      <BigScreenLayout screenWidth = {screenWidth} handleBackButtonClick = {handleBackButtonClick} 
      temp={temp} results={results} handleFavClick={handleFavClick} 
      leftSectionCardStyle={leftSectionCardStyle} location={location}
      rightSectionCardStyle={rightSectionCardStyle} isVarLoaded={isVarLoaded}
      city={city} unit={unit} fav_img={fav_img} weeklyForecast={weeklyForecast} 
      hourlyForecastCard={hourlyForecastCard} mapCard={mapCard} equipmentCard={equipmentCard}
      aqCard={aqCard} weeklyForecastCard={weeklyForecastCard} />
    );
  }
}

export default SecondaryScreen;

export function SmallScreenLayout({handleBackButtonClick, 
  temp, results, handleFavClick, leftSectionCardStyle,
  rightSectionCardStyle, city, unit, fav_img,
  hourlyForecastCard, mapCard, equipmentCard, aqCard, weeklyForecastCard}) {
  return (
    <div>
          <TopBar></TopBar>
          <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "0px 20px 0px",
          }}
          >
            {/* function area */}

            <div>
              {/* Left side */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  padding: "0px 10px 0px",
                }}
              >
                <img
                  src={back_button}
                  alt="Back Button"
                  onClick={handleBackButtonClick}
                  height={30}
                  width={30}
                />

                <ScrollingText text={
                  <MainScreenTemp text={city} color="White"
                />} />
                <MainScreenTemp
                  text={temp.toFixed(2) + "°" + unit}
                  color="White"
                />
                <MainScreenTemp text={results.weather[0].main} color="White" />
                <img
                  src={fav_img}
                  alt="Favorite Button"
                  onClick={handleFavClick}
                  height={30}
                  width={30}
                />
              </div>
              <div style={{ width: "100%" }}>
                <div style={leftSectionCardStyle}>
                  {hourlyForecastCard}
                </div>
              </div>
            </div>

            <div>
              {/* right side */}
              {mapCard}

              <div style={{ height: "10px" }}></div>

              <div style={rightSectionCardStyle}>
                {/* Reminder area */}
                <SmallText text={"Things to brings:"} />
                <div
                  style={{
                    overflowX: "auto",
                    display: "flex",
                    whiteSpace: "nowrap",
                    height: "170px",
                  }}
                >
                  {equipmentCard}
                </div>
              </div>

              <div style={{ height: "10px" }}></div>

              <div style={rightSectionCardStyle}>
                {/* Area Quality area */}
                {aqCard}
              </div>
            </div>
          </div>

          <div>
            {/* Button part */}
            <div style={{ overflowX: "auto",
                        display: "flex",
                        whiteSpace: "nowrap" }}>
              {weeklyForecastCard}
            </div>
          </div>
        </div>
  )
}

export function MediumScreenLayout({handleBackButtonClick, 
  temp, results, handleFavClick, leftSectionCardStyle,
  rightSectionCardStyle, city, unit, fav_img,
  hourlyForecastCard, mapCard, equipmentCard, aqCard, weeklyForecastCard}) {
  return (
    <div>
          <TopBar></TopBar>
          <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "0px 20px 0px",
          }}
          >
            {/* function area */}

            <div>
              {/* Left side */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  padding: "0px 10px 0px",
                }}
              >
                <img
                  src={back_button}
                  alt="Back Button"
                  onClick={handleBackButtonClick}
                  height={30}
                  width={30}
                />

                <ScrollingText text={
                  <MainScreenTemp text={city} color="White"
                />} />
                <MainScreenTemp
                  text={temp.toFixed(2) + "°" + unit}
                  color="White"
                />
                <MainScreenTemp text={results.weather[0].main} color="White" />
                <img
                  src={fav_img}
                  alt="Favorite Button"
                  onClick={handleFavClick}
                  height={30}
                  width={30}
                />
              </div>
              <div style={{ width: "100%" }}>
                <div style={leftSectionCardStyle}>
                  {hourlyForecastCard}
                </div>
              </div>
            </div>

            <div>
              {/* right side */}
              {mapCard}

              <div style={{ height: "10px" }}></div>

              <div
                style={{
                  display: "flex",
                  flex_direction: "row",
                  justify_content: "space-between",
                  align_items: "flex-start",
                  padding: "10px",
                  gap: "10px",
                  /* Inside auto layout */
                  order: 1,
                  align_self: "stretch",
                  flex_grow: 1,
                }}
              >
                {/* Reminder and airquality area */}

                <div style={{ width: "50%" }}>
                  <div style={rightSectionCardStyle}>
                    {/* Reminder area */}
                    <SmallText text={"Things to brings:"} />
                    <div
                      style={{
                        overflowX: "auto",
                        display: "flex",
                        whiteSpace: "nowrap",
                        height: "170px",
                      }}
                    >
                      {equipmentCard}
                    </div>
                  </div>
                </div>

                <div style={{ width: "50%" }}>
                  <div style={rightSectionCardStyle}>
                    {/* Area Quality area */}
                    {aqCard}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            {/* Button part */}
            <div style={{ overflowX: "scroll",
                        display: "flex",
                        whiteSpace: "nowrap"}}>
              {weeklyForecastCard}
            </div>
          </div>
        </div>
  )
}

export function BigScreenLayout({screenWidth, handleBackButtonClick, 
  temp, results, handleFavClick, leftSectionCardStyle,
  rightSectionCardStyle, city, unit, fav_img,
  hourlyForecastCard, mapCard, equipmentCard, aqCard, weeklyForecastCard}) {

  return (
    <>
    <TopBar></TopBar>
    <div
        style={{
          display: "flex",
          flexDirection: "row",
          padding: "0px 20px 0px",
        }}
      >
        {/* function area */}

        <div style={{ width: screenWidth * 0.5 }}>
          {/* Left side */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              padding: "0px 10px 0px",
            }}
          >
            <img
              src={back_button}
              alt="Back Button"
              onClick={handleBackButtonClick}
              height={30}
              width={30}
            />

            <ScrollingText text={
              <MainScreenTemp text={city} color="White"
            />} />
            <MainScreenTemp
              text={temp.toFixed(2) + "°" + unit}
              color="White"
            />
            <MainScreenTemp text={results.weather[0].main} color="White" />
            <img
              src={fav_img}
              alt="Favorite Button"
              onClick={handleFavClick}
              height={30}
              width={30}
            />
          </div>
          <div style={{ width: "100%" }}>
            <div style={leftSectionCardStyle}>
              {hourlyForecastCard}
            </div>
          </div>
        </div>

        <div style={{ width: screenWidth * 0.5, padding: "10px" }}>
          {/* right side */}
          {mapCard}

          <div style={{ height: "10px" }}></div>

          <div
            style={{
              display: "flex",
              flex_direction: "row",
              justify_content: "space-between",
              align_items: "flex-start",
              padding: "10px",
              gap: "10px",
              /* Inside auto layout */
              order: 1,
              align_self: "stretch",
              flex_grow: 1,
            }}
          >
            {/* Reminder and airquality area */}

            <div style={{ width: "50%" }}>
              <div style={rightSectionCardStyle}>
                {/* Reminder area */}
                <SmallText text={"Things to brings:"} />
                <div
                  style={{
                    overflowX: "auto",
                    display: "flex",
                    whiteSpace: "nowrap",
                    height: "172px",
                  }}
                >
                  {equipmentCard}
                </div>
              </div>
            </div>

            <div style={{ width: "50%" }}>
              <div style={rightSectionCardStyle}>
                {/* Area Quality area */}
                {aqCard}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        {/* Button part */}
        <div>
          {weeklyForecastCard}
        </div>
      </div>
    </>
  )
}