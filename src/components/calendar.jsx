import React, { Component } from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import "../styles.css";

import ReactTooltip from "react-tooltip";
import moment from "moment";

class Calendar extends Component {
  state = {
    lessColorBarVal: "<= 18",
    onClickChange: false,
  };

  render() {
    let svgTempColor = "";

    if (this.props.tempType === "01") {
      svgTempColor = (
        <svg
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            left: 0,
            top: 0,
          }}
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
        >
          <svg x="80" y="-3">
            <circle cx="10" cy="12" r="6" fill=" #ffa07a" />
          </svg>
          <svg x="-14" y="-3">
            <text x="112" y="17" fill="#696969" fontSize="0.7em">
              {"<= 18"}
            </text>
          </svg>

          <svg x="140" y="-3">
            <circle cx="12" cy="12" r="6" fill="#fa8072" />
          </svg>
          <svg x="68" y="-3">
            <text x="93" y="17" fill="#696969" fontSize="0.7em">
              {"<= 26"}
            </text>
          </svg>
          <svg x="210" y="-3">
            <circle cx="12" cy="12" r="6" fill="#ff0000" />
          </svg>
          <svg x="68" y="-3">
            <text x="165" y="17" fill="#696969" fontSize="0.7em">
              {"> 26"}
            </text>
          </svg>
        </svg>
      );
    } else {
      svgTempColor = "";
    }

    return (
      <div>
        <div
          className={`mainWrapper wrapperBorder wrapperShadow calendarDisplay ${
            this.props.getWeekOfMonth() === true
              ? "calendarHeight1"
              : "calendarHeight2"
          }`}
          style={{
            // marginTop: 10,
            paddingLeft: 10,
            paddingTop: 10,
            flex: 1,
            // height: this.props.getWeekOfMonth() === true ? "23em" : "27em",
            backgroundColor: "#fdfdfb",
          }}
        >
          <div>
            <div>
              <label className="cardLabel">
                {moment(this.props.date).format("MMM YYYY")}
              </label>
            </div>

            <div
              id="divPrevious"
              className="divPrevNext"
              style={{
                marginLeft: 65,
                marginTop: -23,
                borderTopLeftRadius: 8,
                borderBottomLeftRadius: 8,
              }}
            >
              <img
                style={{ marginTop: -4, marginLeft: 4 }}
                src="../images/previous_icon.png"
                onClick={() => this.props.handlePrevious()}
              />
            </div>

            <div
              div="divNext"
              className="divPrevNext"
              style={{
                marginLeft: 1,
                marginTop: -23,
                borderTopRightRadius: 8,
                borderBottomRightRadius: 8,
              }}
            >
              <img
                style={{
                  Width: "100%",
                  Height: "100%",
                  marginTop: -4,
                  marginLeft: 4,
                }}
                src="../images/next_icon.png"
                onClick={() => this.props.handleNext()}
              />
            </div>

            <div
              className="cardDiv1"
              style={{ marginRight: 20, marginTop: -18 }}
            >
              {svgTempColor}
            </div>
            <div
              className="cardDiv2"
              style={{ marginRight: 20, marginTop: 5, marginBottom: 9 }}
            ></div>
          </div>

          <CalendarHeatmap
            key={1}
            style={{ paddingBottom: 20 }}
            startDate={this.props.shiftDate(this.props.firstDate, -1)}
            endDate={this.props.lastDate}
            values={this.props.iotDataPerMonth}
            classForValue={(value) => {
              if (value != null) {
                if (this.props.tempType === "01") {
                  if (value.temp === "") {
                    return "color-empty";
                  } else if (value.temp <= 18) {
                    return "color-light";
                  } else if (value.temp > 18 && value.temp <= 26) {
                    return "color-medium";
                  } else if (value.temp > 26) {
                    return "color-high";
                  }
                } else if (this.props.tempType === "02") {
                  if (value.temp === "") {
                    return "color-empty";
                  } else {
                    return "color-filled1";
                  }
                } else if (this.props.tempType === "03") {
                  if (value.temp === "") {
                    return "color-empty";
                  } else {
                    return "color-filled1";
                  }
                }
              }
            }}
            tooltipDataAttrs={(value) => {
              return {
                "data-tip": `${moment(value.date).format("DD-MM-YYYY")}`,
              };
            }}
            horizontal={false}
            showWeekdayLabels={true}
            showMonthLabels={false}
            dayOfWeek={["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]}
            onClick={(value) => {
              if (value.temp !== "") {
                // alert(`Clicked on value with count: ${value.date}`);
                this.props.barChartCalendarData(value.date);
              } else {
                this.props.barChartCalendarData(0);
              }
            }}
            gutterSize={1}
            transformDayElement={(element, value, index) => (
              <g>
                <text
                  x={element["props"].x + 4}
                  y={element["props"].y + -1.5}
                  style={{
                    fontSize: "0.14em",
                    fill:
                      value.date.setHours(0, 0, 0, 0) ===
                      new Date().setHours(0, 0, 0, 0)
                        ? "#046307"
                        : "#000000",
                    textAnchor: "middle",
                    dominantBaseline: "middle",
                    alignmentBaseline: "middle",
                    fontWeight:
                      value.date.setHours(0, 0, 0, 0) ===
                      new Date().setHours(0, 0, 0, 0)
                        ? "bold"
                        : "normal",
                  }}
                >
                  {value.date.getDate()}
                </text>
                {React.cloneElement(element, {
                  width: "8%",
                  height: 5,
                  rx: 3,
                  ry: 3,
                })}
                <text
                  x={element["props"].x + 4}
                  y={element["props"].y + 3}
                  style={{
                    cursor: "default",
                    fontSize: "0.15em",
                    fill:
                      value.date.setHours(0, 0, 0, 0) ===
                      new Date().setHours(0, 0, 0, 0)
                        ? "#046307"
                        : "#FFFF",
                    textAnchor: "middle",
                    dominantBaseline: "middle",
                    alignmentBaseline: "middle",
                    fontWeight:
                      value.date.setHours(0, 0, 0, 0) ===
                      new Date().setHours(0, 0, 0, 0)
                        ? "bold"
                        : "normal",
                  }}
                  onClick={() => {
                    if (value.temp !== "") {
                      this.props.barChartCalendarData(value.date);
                    } else {
                      this.props.barChartCalendarData(0);
                    }
                  }}
                >
                  {value.temp}
                </text>
              </g>
            )}
          />
          <ReactTooltip />
        </div>
      </div>
    );
  }
}

export default Calendar;
