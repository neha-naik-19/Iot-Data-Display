import React from "react";

const temp = ({ currentDateLastItemTemp, tempVal, current, externalTemp }) => {
  let outPut = "";
  let imgOutPut = "";
  let tempOutPut = "";
  let tempStyle = "";
  let disp = 0;

  if (tempVal == "01") {
    outPut = <span>Room Temperature</span>;
  } else if (tempVal == "02") {
    outPut = <span>Unit Consumption</span>;
  } else if (tempVal == "03") {
    if (current === 0) {
      outPut = <span>Humidity</span>;
    }
  }

  if (tempVal == "01") {
    imgOutPut = <img src={process.env.PUBLIC_URL + "/acTemperature.png"} />;
  } else if (tempVal == "02") {
    imgOutPut = <img src={process.env.PUBLIC_URL + "/electricity.png"} />;
  } else if (tempVal == "03") {
    if (current === 0) {
      imgOutPut = <img src={process.env.PUBLIC_URL + "/humidity.png"} />;
    }
  }

  if (tempVal == "01") {
    tempOutPut =
      currentDateLastItemTemp.roomtemp != undefined
        ? currentDateLastItemTemp.roomtemp
        : "0 ";
  } else if (tempVal == "02") {
    tempOutPut =
      currentDateLastItemTemp.unitConsumption !== undefined
        ? currentDateLastItemTemp.unitConsumption
        : "0 ";
  } else if (tempVal == "03") {
    if (current === 0) {
      tempOutPut =
        currentDateLastItemTemp.humidity !== undefined
          ? currentDateLastItemTemp.humidity
          : "0 ";
    } else if (current === 1) {
      imgOutPut = (
        <li style={{ listStyleType: "none" }}>
          <ul
            style={{
              border: 0,
              paddingLeft: 6,
              margin: 0,
              fontSize: 14,
            }}
          >
            <span style={{ width: 10 }}>
              <img
                style={{ marginRight: 7 }}
                src={process.env.PUBLIC_URL + "/weather.png"}
              />
            </span>
            <span style={{ fontWeight: "bold", color: "#2F4F4F" }}>Today</span>
          </ul>
          <ul
            style={{
              border: 0,
              paddingLeft: 40,
              margin: 0,
              fontSize: 12,
            }}
          >
            <span style={{ marginLeft: 7, color: "#00008B" }}>
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              }) +
                " " +
                new Date().toLocaleTimeString(navigator.language, {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
            </span>
          </ul>
          <ul
            style={{
              border: 0,
              paddingLeft: 300,
              fontSize: 13,
              fontWeight: "bold",
              marginTop: -19,
            }}
          >
            <span style={{ color: "#2F4F4F" }}>Temperature</span>
            <span
              style={{
                fontWeight: "normal",
                paddingLeft: 10,
                color: "#00008B",
              }}
            >
              {externalTemp != undefined ? externalTemp : "0"}
              <span> &deg;C</span>
            </span>
            {/* <span style={{ paddingLeft: 20, marginLeft: 25, color: "#2F4F4F" }}>
              Humidity
            </span>
            <span
              style={{
                fontWeight: "normal",
                paddingLeft: 10,
                color: "#00008B",
              }}
            >
              {curHumidity}
            </span> */}
          </ul>
        </li>
      );
    }
  }

  if (tempVal == "01") {
    tempStyle = {
      position: "relative",
      bottom: 37,
      left: 52,
      fontSize: 12,
      fontWeight: "bold",
      color: "#00008B",
    };
  } else if (tempVal == "02") {
    tempStyle = {
      position: "relative",
      bottom: 26,
      left: 45,
      fontSize: 12,
      fontWeight: "bold",
      color: "#00008B",
    };
  } else if (tempVal == "03") {
    if (current === 0) {
      tempStyle = {
        position: "relative",
        bottom: 32,
        left: 39,
        fontSize: 12,
        fontWeight: "bold",
        color: "#00008B",
      };
    } else if (current === 1) {
      tempStyle = {
        position: "relative",
        bottom: 32,
        left: 39,
        fontSize: 12,
        fontWeight: "bold",
        color: "#00008B",
      };
    }
  }

  if (current === 0) {
    disp = 1;
  } else {
    disp = 0;
  }

  if (tempVal === "03") {
    disp = 0;
  } else {
    disp = 1;
  }

  return (
    <div>
      {imgOutPut}

      <div style={tempStyle}>
        {outPut} <br />
        {tempOutPut}
        {disp === 1 ? <span> &deg;C</span> : ""}
      </div>
    </div>
  );
};

export default temp;
