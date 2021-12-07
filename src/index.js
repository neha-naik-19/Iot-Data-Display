import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

ReactDOM.render(
  <Router basename={"/iotdashboard"}>
    <Routes>
      <Route path="/" element={<App />} />
    </Routes>
  </Router>,
  //<App />,
  document.getElementById("root")
);
