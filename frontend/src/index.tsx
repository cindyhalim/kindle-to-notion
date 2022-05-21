import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import { ThemeProvider } from "emotion-theming";

import "./index.css";
import { App } from "./App";
import { theme } from "./layout/theme";
import { getAuth } from "./core/auth/utils";

axios.interceptors.request.use((request) => {
  const { accessToken } = getAuth();

  if (accessToken) {
    request.headers["Authorization"] = `Bearer ${accessToken}`;
  }

  return request;
});

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
