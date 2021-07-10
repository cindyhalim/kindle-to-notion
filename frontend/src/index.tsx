import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { App } from "./App";
import { ThemeProvider } from "emotion-theming";
import { theme } from "./layout/theme";

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
