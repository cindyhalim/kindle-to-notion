import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { App } from "./App";
import { ThemeProvider } from "emotion-theming";
import { theme } from "./layout/theme";
import { Box } from "rebass";

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          height: "50px",
          backgroundColor: ["red", "yellow", "green", "blue", "magenta"],
        }}
      />
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
