import React from "react";
import { useState } from "react";
import {
  createTheme,
  FormControlLabel,
  Switch,
  ThemeProvider,
} from "@mui/material";
import { useWeatherContext } from "../store/WeatherContext";

export default function TempConvert(props) {
  const { unit, setUnit } = useWeatherContext();
  const [label, setLabel] = useState("Convert to °F");

  const toggleTheme = createTheme({
    components: {
      MuiSwitch: {
        styleOverrides: {
          root: {
            width: "46px",
            height: "20px",
            padding: "0px",
            marginLeft: "8px",
          },
          switchBase: {
            color: "lightgray",
            padding: "1px",
          },
          thumb: {
            color: "white",
            width: "20px",
            height: "20px",
            marginTop: "-1px",
            marginLeft: "-4px",
          },
          track: {
            borderRadius: "20px",
            backgroundColor: "#ea008c",
            opacity: "1 !important",
            "&:after, &:before": {
              color: "white",
              fontSize: "14px",
              position: "absolute",
              top: "1px",
            },
            "&:after": {
              content: "'°F'",
              left: "4px",
            },
            "&:before": {
              content: "'°C'",
              right: "4px",
            },
          },
        },
      },
    },
  });

  const convert = () => {
    console.log(props.currTemp);
    let newT = 0;
    let newUnit = "C";
    if (unit === "C") {
      newT = props.currTemp * 1.8 + 32;
      newUnit = "F";
      setUnit("F");
      setLabel("Convert to °C");
    } else if (unit === "F") {
      newT = ((props.currTemp - 32) * 5) / 9;
      newUnit = "C";
      setUnit("C");
      setLabel("Convert to °F");
    }
    props.tempHandler(newT, newUnit);
  };
  if (props.showButton == "false") {
    return (null);
  } else {
  return (
    <ThemeProvider theme={toggleTheme}>
      <FormControlLabel
        control={<Switch onClick={convert} defaultChecked color="warning" />}
      />
    </ThemeProvider>
  );
  }
}
