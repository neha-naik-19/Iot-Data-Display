import React, { Component } from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import "../styles.css";
import Select from "./select";
import RoomTemp from "./roomTemp";

import ReactTooltip from "react-tooltip";
import moment from "moment";

class Calendar extends Component {
  state = {
    lessColorBarVal: "< 60",
    date: new Date(),
    displayedMonth: new Date().getMonth() + 1,
    displayedYear: new Date().getFullYear(),
    iotData: [],
  };

  async componentDidMount() {
    this.setState({
      iotData: this.props.iotData.filter((d) => d.ac === "D250AC01"),
    });
  }

  selectAc = (options) => {
    console.log("adding a contact", options);
    this.setState({
      iotData: this.props.iotData.filter((d) => d.ac === options.label),
    });
  };

  render() {
    // console.log("calendar rendered");
    // console.log("calendar-props: ", this.props);

    // const date = new Date();
    const firstDate = new Date(
      this.state.date.getFullYear(),
      this.state.date.getMonth(),
      1
    );

    const lastDate = new Date(
      this.state.date.getFullYear(),
      this.state.date.getMonth() + 1,
      0
    );

    const lastDay = new Date(
      this.state.date.getFullYear(),
      this.state.date.getMonth() + 1,
      0
    ).getDate();

    function shiftDate(date, numDays) {
      const newDate = new Date(date);
      newDate.setDate(newDate.getDate() + numDays);
      return newDate;
    }

    function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function getRange(count) {
      return Array.from({ length: count }, (_, i) => i);
    }

    const randomValues = getRange(31).map((index) => {
      return {
        date: shiftDate(firstDate, +index),
        count: getRandomInt(1, 100),
      };
    });

    //get number of weeks of month
    function getWeekOfMonth() {
      var firstDay = new Date(firstDate.setDate(1)).getDay();
      var totalDays = new Date(
        firstDate.getFullYear(),
        firstDate.getMonth() + 1,
        0
      ).getDate();

      var totalWeek = Math.ceil((firstDay + totalDays) / 7);

      if (totalWeek <= 5) {
        return true;
      } else {
        return false;
      }
    }

    //Get next month data
    const handleNext = () => {
      let curDate = null;

      var nexMonth = new Date(
        this.state.date.getFullYear(),
        this.state.date.getMonth() + 1,
        1
      );

      if (nexMonth.getMonth() + 1 === 1) {
        curDate = new Date(nexMonth.getFullYear(), 0, 1);
      } else {
        curDate = new Date(nexMonth.getFullYear(), nexMonth.getMonth(), 1);
      }

      this.setState({ date: curDate });
      this.setState({ displayedMonth: curDate.getMonth() + 1 });
      this.setState({ displayedYear: curDate.getFullYear() });
    };

    //Get previous month data
    const handlePrevious = () => {
      let curDate = null;

      var prevMonth = new Date(
        this.state.date.getFullYear(),
        this.state.date.getMonth() - 1,
        1
      );

      if (prevMonth.getMonth() + 1 === 12) {
        curDate = new Date(prevMonth.getFullYear(), prevMonth.getMonth(), 1);
      } else {
        curDate = new Date(prevMonth.getFullYear(), prevMonth.getMonth(), 1);
      }

      this.setState({ date: curDate });
      this.setState({ displayedMonth: curDate.getMonth() + 1 });
      this.setState({ displayedYear: curDate.getFullYear() });
    };

    //Get iotData to display on calendar
    const monthDays = getRange(lastDay).map((index) => {
      return {
        date: shiftDate(firstDate, +index),
      };
    });

    //current date last item
    let currentDateLastItem = this.state.iotData
      .filter(
        (d) =>
          new Date(d.Time_Stamp).setHours(0, 0, 0, 0) ===
          new Date().setHours(0, 0, 0, 0)
      )
      .pop();

    let iotData = [...this.state.iotData];
    let calendarData = [];

    //comparing the current month with iotData month
    for (var i = 0; i < iotData.length; i++) {
      if (
        firstDate.getMonth() + 1 ===
        new Date(iotData[i]["Time_Stamp"]).getMonth() + 1
      ) {
        var object = {
          id: iotData[i]["id"],
          ac: iotData[i]["ac"],
          current: iotData[i]["current"],
          voltage: iotData[i]["voltage"],
          power_factor: iotData[i]["power_factor"],
          humidity: iotData[i]["humidity"],
          room_temp: iotData[i]["room_temp"],
          External_temp: iotData[i]["External_temp"],
          Time_Stamp: new Date(iotData[i]["Time_Stamp"]),
        };

        calendarData.push(object);
      }
    }

    //calculating the room temp. average on each day
    let preDt = "";
    let iotDataAvg = 0;
    let iotRoomTemp = 0;
    let current = 0;
    let voltage = 0;
    let power_factor = 0;
    let humidity = 0;
    let External_temp = 0;

    let iotDataCheckToDisplayOnCalendar = [...calendarData];
    calendarData = [];

    for (var i = 0; i < iotDataCheckToDisplayOnCalendar.length; i++) {
      // const iotMultipleData = iotDataCheckToDisplayOnCalendar.map((d) => {
      var iotDt = new Date(
        new Date(
          iotDataCheckToDisplayOnCalendar[i]["Time_Stamp"]
        ).getFullYear(),
        new Date(iotDataCheckToDisplayOnCalendar[i]["Time_Stamp"]).getMonth(),
        new Date(iotDataCheckToDisplayOnCalendar[i]["Time_Stamp"]).getDate()
      );

      if (
        new Date(preDt).setHours(0, 0, 0, 0) ===
        new Date(iotDt).setHours(0, 0, 0, 0)
      ) {
        iotDataAvg = iotDataAvg + 1;
        iotRoomTemp =
          parseFloat(iotRoomTemp) +
          parseFloat(iotDataCheckToDisplayOnCalendar[i]["room_temp"]);
        current =
          parseFloat(current) +
          parseFloat(iotDataCheckToDisplayOnCalendar[i]["current"]);
        voltage =
          parseFloat(voltage) +
          parseFloat(iotDataCheckToDisplayOnCalendar[i]["voltage"]);
        power_factor =
          parseFloat(power_factor) +
          parseFloat(iotDataCheckToDisplayOnCalendar[i]["power_factor"]);
        humidity =
          parseFloat(humidity) +
          parseFloat(iotDataCheckToDisplayOnCalendar[i]["humidity"]);
        External_temp =
          parseFloat(External_temp) +
          parseFloat(iotDataCheckToDisplayOnCalendar[i]["External_temp"]);

        preDt = iotDt;
      } else {
        if (
          preDt != "" &&
          new Date(preDt).setHours(0, 0, 0, 0) !==
            new Date(iotDt).setHours(0, 0, 0, 0)
        ) {
          var object = {
            id: iotDataCheckToDisplayOnCalendar[i - 1]["id"],
            ac: iotDataCheckToDisplayOnCalendar[i - 1]["ac"],
            current: current.toFixed(2),
            voltage: voltage.toFixed(2),
            power_factor: power_factor.toFixed(2),
            humidity: humidity.toFixed(2),
            room_temp: (iotRoomTemp / iotDataAvg).toFixed(2),
            External_temp: External_temp.toFixed(2),
            Time_Stamp: preDt,
          };

          calendarData.push(object);
        }

        iotDataAvg = 1;

        iotRoomTemp = parseFloat(
          iotDataCheckToDisplayOnCalendar[i]["room_temp"]
        );
        current = parseFloat(iotDataCheckToDisplayOnCalendar[i]["current"]);
        voltage = parseFloat(iotDataCheckToDisplayOnCalendar[i]["voltage"]);
        power_factor = parseFloat(
          iotDataCheckToDisplayOnCalendar[i]["power_factor"]
        );
        humidity = parseFloat(iotDataCheckToDisplayOnCalendar[i]["humidity"]);
        External_temp = parseFloat(
          iotDataCheckToDisplayOnCalendar[i]["External_temp"]
        );

        preDt = iotDt;
      }
    }

    //getting the last day room temp. average calculation which has not included in above for loop
    if (iotDataAvg > 0) {
      var object = {
        id: iotDataCheckToDisplayOnCalendar[i - 1]["id"],
        ac: iotDataCheckToDisplayOnCalendar[i - 1]["ac"],
        current: current.toFixed(2),
        voltage: voltage.toFixed(2),
        power_factor: power_factor.toFixed(2),
        humidity: humidity.toFixed(2),
        room_temp:
          Math.round((iotRoomTemp / iotDataAvg) * 100 + Number.EPSILON) / 100,

        External_temp: External_temp.toFixed(2),
        Time_Stamp: preDt,
      };

      calendarData.push(object);
    }

    //checking for each day data of current month.
    //if not found include empty data object
    let dateData = [];
    iotDataCheckToDisplayOnCalendar = [...calendarData];
    calendarData = [];
    for (var i = 0; i < monthDays.length; i++) {
      if (iotDataCheckToDisplayOnCalendar[i] !== undefined) {
        if (
          monthDays[i]["date"].getDate() !==
            iotDataCheckToDisplayOnCalendar[i]["Time_Stamp"].getDate() &&
          monthDays[i]["date"].getDate() <
            iotDataCheckToDisplayOnCalendar[i]["Time_Stamp"].getDate()
        ) {
          // calendarData.splice(calendarData[i], 1);

          var tempObj = {
            date: iotDataCheckToDisplayOnCalendar[i]["Time_Stamp"],
          };

          dateData.push(tempObj);

          let found = dateData.find(
            (el) =>
              new Date(el.date).setHours(0, 0, 0, 0) ===
              new Date(monthDays[i]["date"]).setHours(0, 0, 0, 0)
          );

          if (found === undefined) {
            var object = {
              id: i + 1,
              ac: "",
              current: "",
              voltage: "",
              power_factor: "",
              humidity: "",
              room_temp: "",
              External_temp: "",
              Time_Stamp: monthDays[i]["date"],
            };

            calendarData.push(object);
          }
          calendarData.push(iotDataCheckToDisplayOnCalendar[i]);
        }

        if (
          !(
            monthDays[i]["date"].getDate() <
            iotDataCheckToDisplayOnCalendar[i]["Time_Stamp"].getDate()
          ) &&
          !(
            monthDays[i]["date"].getDate() !==
            iotDataCheckToDisplayOnCalendar[i]["Time_Stamp"].getDate()
          )
        ) {
          calendarData.push(iotDataCheckToDisplayOnCalendar[i]);

          dateData = calendarData.map((t) => {
            return { date: new Date(t.Time_Stamp) };
          });
        }
      } else {
        let found = calendarData.find(
          (el) =>
            new Date(el.Time_Stamp).setHours(0, 0, 0, 0) ===
            new Date(monthDays[i]["date"]).setHours(0, 0, 0, 0)
        );

        if (found === undefined) {
          var object = {
            id: i + 1,
            ac: "",
            current: "",
            voltage: "",
            power_factor: "",
            humidity: "",
            room_temp: "",
            External_temp: "",
            Time_Stamp: new Date(monthDays[i]["date"]),
          };

          calendarData.push(object);

          dateData = calendarData.map((t) => {
            return { date: new Date(t.Time_Stamp) };
          });
        }
      }
    }

    const iotDataPerMonth = calendarData.map((d) => {
      return {
        date: new Date(d.Time_Stamp),
        roomtemp: parseFloat(d.room_temp) > 0 ? parseFloat(d.room_temp) : "",
      };
    });

    // iotDataPerMonth.map((result) => {
    //   console.log(result.date);
    //   console.log(result.roomtemp);
    // });

    return (
      <div>
        <div
          style={{
            display: "block",
            width: 200,
            padding: 10,
            marginTop: 9,
            // marginLeft: 94,
          }}
        >
          <Select selectAc={this.selectAc} />
        </div>
        <div
          className="mainWrapper wrapperBorder wrapperShadow"
          style={{
            // marginLeft: 75,
            marginTop: 10,
            paddingLeft: 10,
            paddingTop: 10,
            // paddingBottom: 20,
            flex: 1,
            height: getWeekOfMonth() === true ? "23em" : "27em",
          }}
        >
          <div>
            <div>
              <label className="cardLabel">
                {moment(this.state.date).format("MMM YYYY")}
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
                onClick={() => handlePrevious()}
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
                onClick={() => handleNext()}
              />
            </div>

            <div
              className="cardDiv1"
              style={{ marginRight: 20, marginTop: -18 }}
            >
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
                <svg x="137" y="-3">
                  <circle cx="10" cy="12" r="6" fill=" #718eff" />
                </svg>
                <svg x="-14" y="-3">
                  <text x="172" y="17" fill="#696969" fontSize="0.7em">
                    {this.state.lessColorBarVal}
                  </text>
                </svg>

                <svg x="210" y="-3">
                  <circle cx="12" cy="12" r="6" fill="#0235ff" />
                </svg>
                <svg x="68" y="-3">
                  <text x="165" y="17" fill="#696969" fontSize="0.7em">
                    60+
                  </text>
                </svg>
              </svg>
            </div>
            <div
              className="cardDiv2"
              style={{ marginRight: 20, marginTop: 5, marginBottom: 9 }}
            ></div>
          </div>

          <CalendarHeatmap
            key={1}
            style={{ paddingBottom: 20 }}
            startDate={shiftDate(firstDate, -1)}
            endDate={lastDate}
            values={iotDataPerMonth}
            classForValue={(value) => {
              if (value.roomtemp === "") {
                return "color-empty";
              } else if (value.roomtemp < 60) {
                return "color-filled1";
              } else {
                return "color-filled";
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
              if (value.roomtemp !== "") {
                alert(`Clicked on value with count: ${value.roomtemp}`);
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
                        ? "#8B0000"
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
                    fontSize: "0.15em",
                    fill:
                      value.date.setHours(0, 0, 0, 0) ===
                      new Date().setHours(0, 0, 0, 0)
                        ? "#8B0000"
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
                >
                  {value.roomtemp}
                </text>
              </g>
            )}
          />
          <ReactTooltip />
        </div>
        <div
          className="wrapperBorder subWrapperShadow"
          style={{
            // marginLeft: 100,
            width: "20em",
            height: "4.5em",
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.01)",
          }}
        >
          <RoomTemp
            currentDateLastItemRoomTemp={
              currentDateLastItem !== undefined ? currentDateLastItem : 0
            }
          ></RoomTemp>
        </div>
      </div>
    );
  }
}

export default Calendar;
