import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";
import usePlacesAutocomplete from "use-places-autocomplete";
import "@reach/combobox/styles.css";
import { useEffect } from "react";
import React from "react";

// Function to check whether a given place has streetweather data
const hasStreetWeatherData = async (place) => {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${place}&appid=${process.env.REACT_APP_APIKEY}`
  );
  const data = await response.json();
  return data.cod === 200;
};

export default function AutoComp(props) {
  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete({
    // Filter function that only includes suggestions with streetweather data
    requestOptions: {
      types: ["(cities)"],
    },
    debounce: 300,
    filter: (suggestion) => hasStreetWeatherData(suggestion),
  });

  useEffect(() => {
    if (!props.city) {
      setValue("New York", false);
      props.cityHandler("New York");
    } else {
      setValue(props.city, false);
    }
  }, [props.city]);

  const handleSelect = async (address) => {
    setValue(address, false);
    props.cityHandler(address);
    clearSuggestions();
  };

  return (
    <>
      <Combobox onSelect={handleSelect} className="locationBox">
        <ComboboxInput
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={!ready}
          style={{
            minWidth: "150px",
            width: "100%",
            border: "none !important",
            borderRadius: "20px",
            outline: "none !important",
          }}
        />
        <ComboboxPopover style={{ border: "none" }}>
          <ComboboxList>
            {status === "OK" && (
              <ComboboxOption
                className="optionBox"
                value={"Your location"}
                key={123}
              />
            )}
            {status === "OK" &&
              data.map(({ place_id, description }) => (
                <ComboboxOption
                  className="optionBox"
                  value={description}
                  key={place_id}
                />
              ))}
          </ComboboxList>
        </ComboboxPopover>
      </Combobox>
    </>
  );
}
