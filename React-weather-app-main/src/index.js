import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import GlobalStore from "./store/GlobalStore";
import { Helmet } from "react-helmet";

ReactDOM.render(
  <React.StrictMode>
    <GlobalStore>
      <Helmet>
        <meta charSet="utf-8" />
        <title>MLH Weather</title>
        <link rel={"icon"} href={"./sun.png"} />
        <meta name="description" content="MLH Weather" />
      </Helmet>
      <App />
    </GlobalStore>
  </React.StrictMode>,
  document.getElementById("root")
);
