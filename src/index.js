import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import "./styles.css";
import "./sb-admin-2.min.css";
import "./fontawesome-free/css/all.min.css";
import "./fontawesome-free/css/fontawesome.min.css";
import "react-datepicker/dist/react-datepicker.css";

import App from "./App";
import Chart from "./components/chart";

ReactDOM.render(
  <Router basename={"/iotdashboard"}>
    <Routes>
      <Route path="/" exact strict element={<App />} />
      <Route
        activeStyle={{ color: "red" }}
        path="/chart"
        exact
        strict
        element={<Chart />}
      />
    </Routes>
  </Router>,
  //<App />,
  document.getElementById("root")
);
