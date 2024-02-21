import React, { useState, useEffect } from "react";
import "./AirQuality.css";
import { useWeatherContext } from "../../store/WeatherContext";
import AirQualityAlisha from "../AirQuality";
import { main } from "@popperjs/core";
import "react-tooltip/dist/react-tooltip.css";
import { Tooltip as ReactTooltip } from "react-tooltip";
import ReactDOMServer from "react-dom/server";

const AirQuality = () => {
  const [airQuality, setAirQuality] = useState(null);
  const [airQualityIndex, setAirQualityIndex] = useState(null);
  const { city } = useWeatherContext();

  const aqi = [
    {
      color: "#2CC937",
      text: "Good",
    },
    {
      color: "#99C140",
      text: "Fair",
    },
    {
      color: "#E7B417",
      text: "Moderate",
    },
    {
      color: "#E77518",
      text: "Poor",
    },
    {
      color: "#EF1E1E",
      text: "Poor",
    },
  ];

  useEffect(() => {
    const geocodingUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${process.env.REACT_APP_APIKEY}`;
    try {
      fetch(geocodingUrl)
        .then((response) => response.json())
        .then((data) => {
          if (
            data.length > 0 &&
            data[0].hasOwnProperty("lat") &&
            data[0].hasOwnProperty("lon")
          ) {
            const { lat, lon } = data[0];
            const airQualityUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${process.env.REACT_APP_APIKEY}`;
            fetch(airQualityUrl)
              .then((response) => response.json())
              .then((data) => {
                setAirQuality(data.list[0]);
                setAirQualityIndex(data.list[0].main.aqi);
              })
              .catch((error) => console.log(error));
          }
        })
        .catch((error) => console.log(error));
    } catch (error) {
      console.log(error);
    }
  }, [city]);

  return (
    <>
      <a
        data-tooltip-id="my-tooltip"
        data-tooltip-html={ReactDOMServer.renderToStaticMarkup(
          <div>
            {" "}
            <h6>Air Quality Index Content</h6>
            <div className="aqi-tooltip">
              <div className="tooltip-contianer">
                <p>CO: {airQuality?.components?.co} µg/m³</p>
                <p>NO: {airQuality?.components?.no} µg/m³</p>
                <p>NO2: {airQuality?.components?.no2} µg/m³</p>
                <p>O3: {airQuality?.components?.o3} µg/m³</p>
              </div>
              <div className="tooltip-contianer">
                <p>SO2: {airQuality?.components?.so2} µg/m³</p>
                <p>PM2.5: {airQuality?.components?.pm2_5} µg/m³</p>
                <p>PM10: {airQuality?.components?.pm10} µg/m³</p>
                <p>NH3: {airQuality?.components?.nh3} µg/m³</p>
              </div>
            </div>
          </div>
        )}
      >
        <ReactTooltip id="my-tooltip" place="top" type="info" effect="float" />
        <section className="info-container">
          <h4>Air Quality Index: </h4>
          {airQuality ? (
            <>
              <div className="aqi-container">
                {aqi.map((item, index) => (
                  <div
                    className="aqi-box"
                    key={index}
                    style={{
                      backgroundColor: item.color,
                      border:
                        index + 1 === airQuality.main.aqi
                          ? "5px solid #fff"
                          : "none",
                      opacity: index + 1 === airQuality.main.aqi ? 1 : 0.3,
                    }}
                  />
                ))}
              </div>
              <div className="aqi-indicator">
                {aqi.map((item, index) => {
                  return (
                    <div className="aqi-indicator-box" key={index}>
                      <div
                        className="aqi-indicator-circle"
                        style={{
                          backgroundColor: item.color,
                        }}
                      />
                      <p className="aqi-indicator-text">{item.text}</p>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <p>Loading air quality data...</p>
          )}
        </section>
      </a>
    </>
  );
};

export default AirQuality;
