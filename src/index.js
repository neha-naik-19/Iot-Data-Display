import React, { Component } from "react";
import ReactDOM from "react-dom";

import "bootstrap/dist/css/bootstrap.css";
import Select from "./components/select";
import SelectTemp from "./components/selectTemp";
import Calendar from "./components/calendar";
import NavBar from "./components/navbar";
import PerDayTemp from "./components/perDayTemp";
import Temp from "./components/temp";

import moment from "moment";

class App extends Component {
  state = {
    iotOriginalData: [],
    iotData: [],
    iotItems: [],
    date: new Date(),
    displayedMonth: new Date().getMonth() + 1,
    displayedYear: new Date().getFullYear(),
    curSeletedDate: null,
    selectTempVal: "01",
    checkOnce: 1,
    loading: false,
  };

  componentWillUnmount() {
    sessionStorage.remove();
  }

  async componentDidMount() {
    try {
      let data = [];
      let getOtherMonthData = [];
      let otherMonthPageNum = [];
      let getSelectedMonthData = [];
      let deviceId = "D250AC01";

      if (!this.state.loading) {
        this.setState({ loading: true });
      }

      var pageNum = await this.getApiData(
        "http://10.1.19.25:5000/energygrid1?where={%22Device_ID%22:%22" +
          deviceId +
          "%22}&max_results=1440"
      );

      // let resp = await fetch(
      //   "http://10.1.19.25:5000/energygrid1?where={%22Device_ID%22:%22D250AC01%22}&max_results=1440&page=1"
      // );
      // let respData = await resp.text();
      // let respText = respData.replaceAll("NaN", "0");
      // var apiJson = JSON.parse(respText);

      // console.log(apiJson);

      let pageNumCopy = pageNum;

      while (pageNumCopy !== 0) {
        let itemData = await this.getApiDataPageWise(
          pageNum,
          otherMonthPageNum,
          deviceId,
          0
        );

        let getItemsData = itemData.map((i) => {
          return {
            id: i.id,
            deviceID: i.deviceID,
            humidity: i.humidity,
            roomtemp: i.roomtemp,
            unitConsumption: i.unitConsumption,
            timeStamp: new Date(i.timeStamp).toUTCString().substr(0, 25),
            externalTemp: i.externalTemp,
          };
        });

        getSelectedMonthData = getItemsData.filter(
          (i) =>
            new Date(i["timeStamp"]).getMonth() + 1 ===
            this.state.date.getMonth() + 1
        );

        if (getSelectedMonthData.length === 0) {
          pageNumCopy = 0;

          sessionStorage.setItem("deviceId", "D250AC01");
          sessionStorage.setItem("apiCurPageNum", pageNum);
          sessionStorage.setItem(
            "otherMonthPageNum",
            JSON.stringify(otherMonthPageNum)
          );

          this.setState({ iotItems: data, loading: false });

          break;
        } else {
          getOtherMonthData = getItemsData.filter(
            (i) =>
              new Date(i["timeStamp"]).getMonth() + 1 !==
              this.state.date.getMonth() + 1
          );

          getOtherMonthData = getItemsData.filter(
            (i) =>
              new Date(i["timeStamp"]).getMonth() + 1 <
              this.state.date.getMonth() + 1
          );

          if (getOtherMonthData.length > 0) {
            otherMonthPageNum.push(pageNum);
          }

          pageNum = pageNum - 1;
          data.push(getSelectedMonthData);
        }
      }

      window.scrollTo(0, 0);
    } catch (error) {
      console.log("Error Message: ", error);
    }
  }

  async getApiData(url) {
    let linksArray = [];
    let hrefValue = null;
    let linksData = "";
    let pageNum = 0;

    let resp = await fetch(url);
    let respData = await resp.text();
    let respText = respData.replaceAll("NaN", "0");
    var apiJson = JSON.parse(respText);

    Object.entries(apiJson["_links"]).forEach(([key, value]) => {
      if (key === "last") {
        linksData = value;
      }
    });

    if (linksData !== "") {
      linksData = Object.entries(apiJson["_links"]["last"]);

      sessionStorage.setItem(
        "iotOriginalData",
        Object.entries(apiJson["_items"]).length
      );

      for (const key in linksData) {
        if (key === "1") {
          linksArray = linksData[key];
          for (const key in linksArray) {
            if (key === "1") {
              hrefValue = linksArray[key];
            }
          }
        }
      }

      pageNum = parseInt(hrefValue.split("=")[hrefValue.split("=").length - 1]);
    } else {
      pageNum = 1;
    }

    return pageNum;
  }

  async fetchData(url) {
    let resp = await fetch(url);
    let respData = await resp.text();
    let respText = respData.replaceAll("NaN", "0");
    let dataJson = JSON.parse(respText);

    return Object.entries(dataJson["_items"]);
  }

  async getApiDataPageWise(pageNum, otherPageNum, deviceId, checkOnce) {
    let itemsData = [];
    let apiData = [];
    let count = 0;
    let otherPageData = [];
    let urlcopy = "";
    let itemsArray = [];

    count = count + 1;

    let url =
      "http://10.1.19.25:5000/energygrid1?where={%22Device_ID%22:%22" +
      deviceId +
      "%22}&max_results=1440&page=";

    // console.log("otherPageNum : ", otherPageNum);

    if (checkOnce === 1) {
      if (otherPageNum !== undefined) {
        if (otherPageNum.length > 0) {
          for (let i = 0; i < otherPageNum.length; i++) {
            urlcopy = "";
            urlcopy = url + otherPageNum[i];

            // console.log("otherPageData : ", urlcopy);

            otherPageData = await this.fetchData(urlcopy);

            otherPageData.map((item) => {
              itemsArray.push(item);
            });

            if (otherPageNum.length === 1 && otherPageNum[i] === pageNum) {
              pageNum = 0;
            }
          }
        }
      }
    }

    if (checkOnce === 1) {
      if (otherPageData.length > 0) {
        for (const item in itemsArray) {
          apiData.push({
            id: count++,
            deviceID: itemsArray[item][1]["Device_ID"],
            humidity: itemsArray[item][1]["Humidity"],
            roomtemp: itemsArray[item][1]["room_temp"],
            unitConsumption: itemsArray[item][1]["unit_consumption"],
            timeStamp: itemsArray[item][1]["Time_Stamp"],
            externalTemp: itemsArray[item][1]["External_temp"],
          });
        }
      }
    }

    if (pageNum > 0) {
      urlcopy = "";
      urlcopy = url + pageNum;

      if (checkOnce === 1) {
        itemsData = await this.fetchData(urlcopy);

        // console.log("itemsData : ", urlcopy);

        for (const item in itemsData) {
          apiData.push({
            id: count++,
            deviceID: itemsData[item][1]["Device_ID"],
            humidity: itemsData[item][1]["Humidity"],
            roomtemp: itemsData[item][1]["room_temp"],
            unitConsumption: itemsData[item][1]["unit_consumption"],
            timeStamp: itemsData[item][1]["Time_Stamp"],
            externalTemp: itemsData[item][1]["External_temp"],
          });
        }
      }
    }

    if (checkOnce === 0 || checkOnce > 1) {
      itemsData = await this.fetchData(urlcopy);

      // console.log("itemsData : ", urlcopy);

      for (const item in itemsData) {
        apiData.push({
          id: count++,
          deviceID: itemsData[item][1]["Device_ID"],
          humidity: itemsData[item][1]["Humidity"],
          roomtemp: itemsData[item][1]["room_temp"],
          unitConsumption: itemsData[item][1]["unit_consumption"],
          timeStamp: itemsData[item][1]["Time_Stamp"],
          externalTemp: itemsData[item][1]["External_temp"],
        });
      }
    }

    return apiData;
  }

  selectAc = async (options) => {
    console.log("adding a contact", options);

    try {
      let data = [];
      let getOtherMonthData = [];
      let getSelectedMonthData = [];
      let otherMonthPageNum = JSON.parse(
        sessionStorage.getItem("otherMonthPageNum")
      );

      var pageNum = await this.getApiData(
        "http://10.1.19.25:5000/energygrid1?where={%22Device_ID%22:%22" +
          options.label +
          "%22}&max_results=1440"
      );

      // console.log("pageNum : ", pageNum);

      let pageNumCopy = pageNum;
      while (pageNumCopy !== 0) {
        let itemData = await this.getApiDataPageWise(
          pageNum,
          otherMonthPageNum,
          options.label,
          0
        );

        let getItemsData = itemData.map((i) => {
          return {
            id: i.id,
            deviceID: i.deviceID,
            humidity: i.humidity,
            roomtemp: i.roomtemp,
            unitConsumption: i.unitConsumption,
            timeStamp: new Date(i.timeStamp).toUTCString().substr(0, 25),
            externalTemp: i.externalTemp,
          };
        });

        getSelectedMonthData = getItemsData.filter(
          (i) =>
            new Date(i["timeStamp"]).getMonth() + 1 ===
            this.state.date.getMonth() + 1
        );

        if (getSelectedMonthData.length === 0) {
          pageNumCopy = 0;

          sessionStorage.setItem("deviceId", options.label);
          sessionStorage.setItem("apiCurPageNum", pageNum);
          sessionStorage.setItem(
            "otherMonthPageNum",
            JSON.stringify(otherMonthPageNum)
          );

          this.setState({ iotItems: data });
          break;
        } else {
          getOtherMonthData = getItemsData.filter(
            (i) =>
              new Date(i["timeStamp"]).getMonth() + 1 !==
              this.state.date.getMonth() + 1
          );

          getOtherMonthData = getItemsData.filter(
            (i) =>
              new Date(i["timeStamp"]).getMonth() + 1 <
              this.state.date.getMonth() + 1
          );

          if (getOtherMonthData.length > 0) {
            otherMonthPageNum.push(pageNum);
          }

          pageNum = pageNum - 1;
          data.push(getSelectedMonthData);
        }
      }

      window.scrollTo(0, 0);
    } catch (error) {
      console.log("Error Message: ", error);
    }
  };

  selectTemp = (options) => {
    this.setState({ selectTempVal: Object.values(options)[0] });
  };

  barChartCalendarData = (dateVal) => {
    if (dateVal === 0) {
      this.setState({ curSeletedDate: dateVal });
    } else {
      this.setState({
        curSeletedDate: this.state.iotData.filter(
          (d) =>
            new Date(d.timeStamp).setHours(0, 0, 0, 0) ===
            dateVal.setHours(0, 0, 0, 0)
        ),
      });
    }
  };

  render() {
    //Get next month
    const handleNext = async () => {
      let curDate = null;
      let data = [];
      let getOtherMonthData = [];
      let pageNumCopy = 0;
      let getSelectedMonthData = [];
      let apiCurPageNum = sessionStorage.getItem("apiCurPageNum");
      let otherMonthPageNum = JSON.parse(
        sessionStorage.getItem("otherMonthPageNum")
      );

      if (!this.state.loading) {
        var nexMonth = new Date(
          this.state.date.getFullYear(),
          this.state.date.getMonth() + 1,
          1
        );

        let todayDate = new Date();

        if (
          this.state.date.getMonth() + 2 <=
            new Date(todayDate).getMonth() + 1 &&
          nexMonth.getFullYear() === new Date(todayDate).getFullYear()
        ) {
          if (nexMonth.getMonth() + 1 === 1) {
            curDate = new Date(nexMonth.getFullYear(), 0, 1);
          } else {
            curDate = new Date(nexMonth.getFullYear(), nexMonth.getMonth(), 1);
          }

          this.setState({
            date: curDate,
            displayedMonth: curDate.getMonth() + 1,
            displayedYear: curDate.getFullYear(),
            curSeletedDate: 0,
          });

          /*************************************************/
          for (const num in otherMonthPageNum) {
            if (parseInt(otherMonthPageNum[num]) > apiCurPageNum) {
              apiCurPageNum = parseInt(otherMonthPageNum[num]);
              otherMonthPageNum = [];
              otherMonthPageNum.push(apiCurPageNum);
              break;
            }
          }

          let checkOnce = 0;
          pageNumCopy = apiCurPageNum;
          this.setState({ iotItems: [] });

          while (pageNumCopy !== 0) {
            if (otherMonthPageNum !== undefined) {
              if (otherMonthPageNum.length > 0) {
                checkOnce = checkOnce + 1;
              } else {
                checkOnce = 0;
              }
            } else {
              checkOnce = 0;
            }

            let itemData = await this.getApiDataPageWise(
              apiCurPageNum,
              otherMonthPageNum,
              sessionStorage.getItem("deviceId"),
              checkOnce
            );

            let getItemsData = itemData.map((i) => {
              return {
                id: i.id,
                deviceID: i.deviceID,
                humidity: i.humidity,
                roomtemp: i.roomtemp,
                unitConsumption: i.unitConsumption,
                timeStamp: new Date(i.timeStamp).toUTCString().substr(0, 25),
                externalTemp: i.externalTemp,
              };
            });

            getSelectedMonthData = getItemsData.filter(
              (i) =>
                new Date(i["timeStamp"]).getMonth() + 1 ===
                this.state.date.getMonth() + 1
            );

            if (getSelectedMonthData.length === 0) {
              pageNumCopy = 0;

              sessionStorage.setItem("apiCurPageNum", apiCurPageNum);
              sessionStorage.setItem(
                "otherMonthPageNum",
                JSON.stringify(otherMonthPageNum)
              );

              this.setState({ iotItems: data });
              break;
            } else {
              getOtherMonthData = getItemsData.filter(
                (i) =>
                  new Date(i["timeStamp"]).getMonth() + 1 !==
                  this.state.date.getMonth() + 1
              );

              getOtherMonthData = getItemsData.filter(
                (i) =>
                  new Date(i["timeStamp"]).getMonth() + 1 <
                  this.state.date.getMonth() + 1
              );

              if (getOtherMonthData.length > 0) {
                if (!otherMonthPageNum.includes(apiCurPageNum)) {
                  otherMonthPageNum.push(apiCurPageNum);
                }
              }

              apiCurPageNum = apiCurPageNum + 1;
              data.push(getSelectedMonthData);
            }
          }
        }
      }
    };

    //Get previous month
    const handlePrevious = async () => {
      let curDate = null;
      let data = [];
      let getOtherMonthData = [];
      let pageNumCopy = 0;
      let getSelectedMonthData = [];
      let apiCurPageNum = sessionStorage.getItem("apiCurPageNum");
      let otherMonthPageNum = JSON.parse(
        sessionStorage.getItem("otherMonthPageNum")
      );

      if (!this.state.loading) {
        var prevMonth = new Date(
          this.state.date.getFullYear(),
          this.state.date.getMonth() - 1,
          1
        );

        let todayDate = new Date();

        if (prevMonth.getMonth() + 1 >= todayDate.getMonth()) {
          if (prevMonth.getMonth() + 1 === 12) {
            curDate = new Date(
              prevMonth.getFullYear(),
              prevMonth.getMonth(),
              1
            );
          } else {
            curDate = new Date(
              prevMonth.getFullYear(),
              prevMonth.getMonth(),
              1
            );
          }

          this.setState({
            date: curDate,
            displayedMonth: curDate.getMonth() + 1,
            displayedYear: curDate.getFullYear(),
            curSeletedDate: 0,
          });

          /*************************************************/
          for (const num in otherMonthPageNum) {
            if (parseInt(otherMonthPageNum[num]) < apiCurPageNum) {
              apiCurPageNum = parseInt(otherMonthPageNum[num]);
              otherMonthPageNum = [];
              otherMonthPageNum.push(apiCurPageNum);
              break;
            }
          }

          let checkOnce = 0;
          pageNumCopy = apiCurPageNum;
          this.setState({ iotItems: [] });

          while (pageNumCopy !== 0) {
            if (otherMonthPageNum !== undefined) {
              if (otherMonthPageNum.length > 0) {
                checkOnce = checkOnce + 1;
              } else {
                checkOnce = 0;
              }
            } else {
              checkOnce = 0;
            }

            let itemData = await this.getApiDataPageWise(
              apiCurPageNum,
              otherMonthPageNum,
              sessionStorage.getItem("deviceId"),
              checkOnce
            );

            let getItemsData = itemData.map((i) => {
              return {
                id: i.id,
                deviceID: i.deviceID,
                humidity: i.humidity,
                roomtemp: i.roomtemp,
                unitConsumption: i.unitConsumption,
                timeStamp: new Date(i.timeStamp).toUTCString().substr(0, 25),
                externalTemp: i.externalTemp,
              };
            });

            getSelectedMonthData = getItemsData.filter(
              (i) =>
                new Date(i["timeStamp"]).getMonth() + 1 ===
                this.state.date.getMonth() + 1
            );

            if (getSelectedMonthData.length === 0) {
              pageNumCopy = 0;

              sessionStorage.setItem("apiCurPageNum", apiCurPageNum);
              sessionStorage.setItem(
                "otherMonthPageNum",
                JSON.stringify(otherMonthPageNum)
              );

              this.setState({ iotItems: data });

              break;
            } else {
              getOtherMonthData = getItemsData.filter(
                (i) =>
                  new Date(i["timeStamp"]).getMonth() + 1 !==
                  this.state.date.getMonth() + 1
              );

              getOtherMonthData = getItemsData.filter(
                (i) =>
                  new Date(i["timeStamp"]).getMonth() + 1 <
                  this.state.date.getMonth() + 1
              );

              if (getOtherMonthData.length > 0) {
                otherMonthPageNum.push(apiCurPageNum);
              }

              apiCurPageNum = apiCurPageNum - 1;
              pageNumCopy = apiCurPageNum;
              data.push(getSelectedMonthData);
            }
          }
        }
      }
    };

    let outPut = "";
    let showSpinner = "";
    console.log("index rendered");
    // console.log("iotItems : ", this.state.iotItems);

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

    //Get everymonth full dates as per selection
    const monthDays = getRange(lastDay).map((index) => {
      return {
        date: shiftDate(firstDate, +index),
      };
    });

    let currentDateLastItem = [];
    let barChartData = [];
    let iotDataPerMonth = [];
    let currentSelectedMonthData = [];
    let iotDataCheckToDisplayOnCalendar = [];
    let calendarData = [];

    // if (this.state.iotOriginalData.length === 0) {
    if (sessionStorage.getItem("iotOriginalData") === 0) {
      outPut = <p className="text-center">Loading... Please wait..</p>;
    } else {
      let iotData = [];

      if (this.state.iotItems !== null) {
        if (this.state.iotItems.length > 0) {
          let iotItems = [];
          let dataCnt = [];

          iotItems = [...this.state.iotItems];
          let cnt = 1;

          for (let i = 0; i < iotItems.length; i++) {
            dataCnt = iotItems[i];
            for (let j = 0; j < dataCnt.length; j++) {
              iotData.push(dataCnt[j]);
            }
          }

          iotData = iotData.sort((a, b) => {
            return (
              new Date(a.timeStamp).getTime() - new Date(b.timeStamp).getTime()
            );
          });

          iotData = iotData.map((i) => {
            return {
              id: cnt++,
              deviceID: i.deviceID,
              humidity: parseFloat(i.humidity),
              roomtemp: parseFloat(i.roomtemp),
              unitConsumption: parseFloat(i.unitConsumption),
              timeStamp: new Date(i.timeStamp),
              externalTemp: parseFloat(i.externalTemp),
            };
          });

          this.state.iotData = [...iotData];

          //current date last item
          currentDateLastItem = this.state.iotData
            .filter(
              (d) =>
                new Date(d.timeStamp).setHours(0, 0, 0, 0) ===
                new Date().setHours(0, 0, 0, 0)
            )
            .pop();

          //get current date full data
          barChartData = this.state.iotData.filter(
            (d) =>
              new Date(d.timeStamp).setHours(0, 0, 0, 0) ===
              new Date().setHours(0, 0, 0, 0)
          );

          iotData = [...this.state.iotData];

          //comparing the current month with iotData month
          for (var i = 0; i < iotData.length; i++) {
            let dtMonth = moment(new Date(iotData[i]["timeStamp"])).format(
              "DD-MM-YYYY"
            );

            dtMonth = dtMonth.substring(dtMonth.indexOf("-") + 1);

            dtMonth = dtMonth.substring(0, dtMonth.indexOf("-"));

            if (firstDate.getMonth() + 1 === parseInt(dtMonth)) {
              var object = {
                id: iotData[i]["id"],
                deviceID: iotData[i]["deviceID"],
                humidity: iotData[i]["humidity"],
                roomtemp: iotData[i]["roomtemp"],
                unitConsumption: iotData[i]["unitConsumption"],
                timeStamp: new Date(new Date(iotData[i]["timeStamp"])),
                externalTemp: iotData[i]["externalTemp"],
              };

              calendarData.push(object);
            }
          }

          currentSelectedMonthData = [...calendarData];

          //calculating the room temp. average on each day
          let preDt = "";
          let iotDataAvg = 0;
          let iotRoomTemp = 0;
          let unitConsumption = 0;
          let humidity = 0;
          let externalTemp = 0;

          iotDataCheckToDisplayOnCalendar = [...calendarData];
          calendarData = [];

          for (var i = 0; i < iotDataCheckToDisplayOnCalendar.length; i++) {
            var iotDt = new Date(
              new Date(
                iotDataCheckToDisplayOnCalendar[i]["timeStamp"]
              ).getFullYear(),
              new Date(
                iotDataCheckToDisplayOnCalendar[i]["timeStamp"]
              ).getMonth(),
              new Date(
                iotDataCheckToDisplayOnCalendar[i]["timeStamp"]
              ).getDate()
            );

            if (
              new Date(preDt).setHours(0, 0, 0, 0) ===
              new Date(iotDt).setHours(0, 0, 0, 0)
            ) {
              iotDataAvg = iotDataAvg + 1;
              iotRoomTemp =
                parseFloat(iotRoomTemp) +
                parseFloat(iotDataCheckToDisplayOnCalendar[i]["roomtemp"]);
              unitConsumption =
                parseFloat(unitConsumption) +
                parseFloat(
                  iotDataCheckToDisplayOnCalendar[i]["unitConsumption"]
                );
              humidity =
                parseFloat(humidity) +
                parseFloat(iotDataCheckToDisplayOnCalendar[i]["humidity"]);
              externalTemp =
                parseFloat(externalTemp) +
                parseFloat(iotDataCheckToDisplayOnCalendar[i]["externalTemp"]);

              preDt = iotDt;
            } else {
              if (
                preDt != "" &&
                new Date(preDt).setHours(0, 0, 0, 0) !==
                  new Date(iotDt).setHours(0, 0, 0, 0)
              ) {
                var object = {
                  id: iotDataCheckToDisplayOnCalendar[i - 1]["id"],
                  deviceID: iotDataCheckToDisplayOnCalendar[i - 1]["deviceID"],
                  unitConsumption: (unitConsumption / iotDataAvg).toFixed(2),
                  humidity: (humidity / iotDataAvg).toFixed(2),
                  roomtemp: (iotRoomTemp / iotDataAvg).toFixed(2),
                  externalTemp: (externalTemp / externalTemp).toFixed(2),
                  timeStamp: preDt,
                };

                calendarData.push(object);
              }

              iotDataAvg = 1;

              iotRoomTemp = parseFloat(
                iotDataCheckToDisplayOnCalendar[i]["roomtemp"]
              );
              unitConsumption = parseFloat(
                iotDataCheckToDisplayOnCalendar[i]["unitConsumption"]
              );
              humidity = parseFloat(
                iotDataCheckToDisplayOnCalendar[i]["humidity"]
              );
              externalTemp = parseFloat(
                iotDataCheckToDisplayOnCalendar[i]["externalTemp"]
              );

              preDt = iotDt;
            }
          }

          //getting the last day room temp. average calculation which has not included in above loop
          if (iotDataAvg > 0) {
            var object = {
              id: iotDataCheckToDisplayOnCalendar[i - 1]["id"],
              deviceID: iotDataCheckToDisplayOnCalendar[i - 1]["deviceID"],
              unitConsumption:
                Math.round(
                  (unitConsumption / iotDataAvg) * 100 + Number.EPSILON
                ) / 100,
              humidity:
                Math.round((humidity / iotDataAvg) * 100 + Number.EPSILON) /
                100,
              roomtemp:
                Math.round((iotRoomTemp / iotDataAvg) * 100 + Number.EPSILON) /
                100,
              externalTemp:
                Math.round((externalTemp / iotDataAvg) * 100 + Number.EPSILON) /
                100,
              timeStamp: preDt,
            };

            calendarData.push(object);
          }
        }

        //checking for each day data of current month.
        //if not found include empty data object
        iotDataCheckToDisplayOnCalendar = [...calendarData];
        calendarData = [];

        function checkMonthData(items, i) {
          let dataFound = [];
          let dataObject = {};
          if (items.length > 0) {
            dataFound = items.find(
              (el) =>
                new Date(el.timeStamp).setHours(0, 0, 0, 0) ===
                new Date(monthDays[i]["date"]).setHours(0, 0, 0, 0)
            );

            if (dataFound !== undefined) {
              let deviceID = "";
              let unitConsumption = 0;
              let humidity = 0;
              let roomtemp = 0;
              let externalTemp = 0;
              let timeStamp = null;

              Object.entries(dataFound).forEach(([key, value]) => {
                if (key === "deviceID") {
                  deviceID = value;
                } else if (key === "unitConsumption") {
                  unitConsumption = parseFloat(value);
                } else if (key === "roomtemp") {
                  roomtemp = parseFloat(value);
                } else if (key === "timeStamp") {
                  timeStamp = value;
                } else if (key === "humidity") {
                  humidity = parseFloat(value);
                } else if (key === "externalTemp") {
                  externalTemp = parseFloat(value);
                }

                dataObject = {
                  id: i,
                  deviceID: deviceID,
                  unitConsumption: unitConsumption,
                  humidity: humidity,
                  roomtemp: roomtemp,
                  externalTemp: externalTemp,
                  timeStamp: new Date(timeStamp),
                };
              });

              items.splice(dataFound, 1);
            } else {
              dataObject = {
                id: i,
                deviceID: "",
                unitConsumption: "",
                humidity: "",
                roomtemp: "",
                externalTemp: "",
                timeStamp: monthDays[i]["date"],
              };
            }
          } else {
            dataObject = {
              id: i,
              deviceID: "",
              unitConsumption: "",
              humidity: "",
              roomtemp: "",
              externalTemp: "",
              timeStamp: monthDays[i]["date"],
            };
          }

          return dataObject;
        }

        //neha
        let newData = [];

        for (var i = 0; i < monthDays.length; i++) {
          if (iotDataCheckToDisplayOnCalendar[i] !== undefined) {
            if (
              monthDays[i]["date"].getDate() ===
              iotDataCheckToDisplayOnCalendar[i]["timeStamp"].getDate()
            ) {
              calendarData.push(iotDataCheckToDisplayOnCalendar[i]);
            } else {
              calendarData.push(checkMonthData(newData, i));

              newData.push(iotDataCheckToDisplayOnCalendar[i]);
            }
          } else {
            calendarData.push(checkMonthData(newData, i));
          }
        }

        if (this.state.selectTempVal === "01") {
          iotDataPerMonth = calendarData.map((d) => {
            return {
              date: new Date(d.timeStamp),
              temp: parseFloat(d.roomtemp) > 0 ? parseFloat(d.roomtemp) : "",
            };
          });
        } else if (this.state.selectTempVal === "02") {
          iotDataPerMonth = calendarData.map((d) => {
            return {
              date: new Date(d.timeStamp),
              temp:
                parseFloat(d.unitConsumption) > 0
                  ? parseFloat(d.unitConsumption)
                  : "",
            };
          });
        } else if (this.state.selectTempVal === "03") {
          iotDataPerMonth = calendarData.map((d) => {
            return {
              date: new Date(d.timeStamp),
              temp: parseFloat(d.humidity) > 0 ? parseFloat(d.humidity) : "",
            };
          });
        }
      }

      // iotDataPerMonth.map((result) => {
      //   console.log(
      //     new Date(new Date(result.date).toUTCString().substr(0, 25))
      //   );
      //   console.log(result.roomtemp);
      // });

      showSpinner = this.state.loading ? (
        <div className="d-flex justify-content-center">
          <div
            className="spinner-border"
            style={{
              width: "3rem",
              height: "3rem",
              bottom: 350,
              position: "relative",
              color: "#6B8E23",
            }}
            role="status"
          >
            <span className="sr-only">Loading</span>
          </div>
        </div>
      ) : (
        ""
      );

      outPut = (
        <div className="row">
          <div
            style={{
              height: 70,
              padding: 7,
            }}
          >
            <table>
              <tbody>
                <tr>
                  <td
                    className="wrapperBorder"
                    style={{
                      borderRadius: 4,
                      width: "35em",
                      height: "3.5em",
                      paddingTop: "0.2em",
                      paddingBottom: "0.2em",
                      marginRight: 20,

                      display: "inline-block",
                      backgroundColor: "#eeece7",
                    }}
                  >
                    <Temp
                      currentDateLastItemTemp={0}
                      tempVal={"03"}
                      current={1}
                      externalTemp={
                        currentDateLastItem !== undefined
                          ? currentDateLastItem.externalTemp
                          : 0
                      }
                    ></Temp>
                  </td>
                  <td
                    className="wrapperBorder subWrapperShadow"
                    style={{ backgroundColor: "#eeece7" }}
                  >
                    <Temp
                      currentDateLastItemTemp={
                        currentDateLastItem !== undefined
                          ? currentDateLastItem
                          : 0
                      }
                      tempVal={"01"}
                      current={0}
                      externalTemp={
                        currentDateLastItem !== undefined
                          ? currentDateLastItem.externalTemp
                          : 0
                      }
                    ></Temp>
                  </td>
                  <td
                    className="wrapperBorder subWrapperShadow"
                    style={{ backgroundColor: "#eeece7" }}
                  >
                    <Temp
                      currentDateLastItemTemp={
                        currentDateLastItem !== undefined
                          ? currentDateLastItem
                          : 0
                      }
                      tempVal={"02"}
                      current={0}
                      externalTemp={
                        currentDateLastItem !== undefined
                          ? currentDateLastItem.externalTemp
                          : 0
                      }
                    ></Temp>
                  </td>
                  <td
                    className="wrapperBorder subWrapperShadow"
                    style={{ backgroundColor: "#eeece7" }}
                  >
                    <Temp
                      currentDateLastItemTemp={
                        currentDateLastItem !== undefined
                          ? currentDateLastItem
                          : 0
                      }
                      tempVal={"03"}
                      current={0}
                    ></Temp>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="col-md-5" style={{ paddingTop: 6, marginRight: 0 }}>
            <table>
              <tbody>
                <tr>
                  <td style={{ width: 160, paddingRight: 10 }}>
                    <Select
                      selectAc={this.selectAc}
                      isLoading={this.state.loading}
                    />
                  </td>
                  <td style={{ width: 160 }}>
                    <SelectTemp
                      selectTemp={this.selectTemp}
                      isLoading={this.state.loading}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <Calendar
              date={this.state.date}
              firstDate={firstDate}
              lastDate={lastDate}
              shiftDate={shiftDate}
              getWeekOfMonth={getWeekOfMonth}
              handlePrevious={handlePrevious}
              handleNext={handleNext}
              iotDataPerMonth={iotDataPerMonth}
              iotData={currentSelectedMonthData}
              barChartCalendarData={this.barChartCalendarData}
              monthDays={monthDays}
              tempType={this.state.selectTempVal}
            />
          </div>
          <div className="col-md-7">
            <PerDayTemp
              barChartData={
                this.state.curSeletedDate === null
                  ? barChartData
                  : this.state.curSeletedDate
              }
              tempVal={this.state.selectTempVal}
            ></PerDayTemp>
          </div>
        </div>
      );
    }
    // }

    return (
      // <React.Fragment>
      <div>
        <NavBar />
        <div className="float-container">{outPut}</div>
        {showSpinner}
      </div>
      // </React.Fragment>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
