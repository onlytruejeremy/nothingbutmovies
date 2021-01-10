import React from "react";
import ReactDOM from "react-dom";
import { AuthProvider } from "./Auth";
import App from "./App";

import { BrowserRouter } from "react-router-dom";
const rootElement = document.getElementById("root");

ReactDOM.render(
  <AuthProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </AuthProvider>,
  rootElement
);
