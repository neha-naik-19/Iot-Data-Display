import React, { Component } from "react";

import "bootstrap/dist/css/bootstrap.css";
import Select from "./components/select";
import SelectTemp from "./components/selectTemp";
import Calendar from "./components/calendar";
import NavBar from "./components/navbar";
import Temp from "./components/temp";
import TempTable from "./components/tempTable";
import WeekCalendar from "./components/weekCalendar";

import moment from "moment";

import { getItemData } from "./components/userDefined";

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
    type: "Monthly",
    dataCurrent: [],
    deviceIdCurrent: "",
    apiCurPageNum: [],
    otherMonthPageNum: [],
    onlyOnePrevMonth: false,
  };

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

      sessionStorage.clear();

      /*****************************************/

      // let resp = await fetch(
      //   "http://10.1.19.25:5000/energygrid1?where={%22Device_ID%22:%22D250AC02%22}&max_results=1440&page=43"
      // );
      // let respData = await resp.text();
      // let respText = respData.replaceAll("NaN", "0");
      // var apiJson = JSON.parse(respText);
      // var items = Object.entries(apiJson["_items"]);

      // var testData = [];
      // var itemDataToday = [];

      // items.map((item) => {
      //   testData.push(item);
      // });

      // for (const d in testData) {
      //   itemDataToday.push({
      //     deviceID: testData[d][1]["Device_ID"],
      //     humidity: testData[d][1]["Humidity"],
      //     roomtemp: testData[d][1]["room_temp"],
      //     timeStamp: testData[d][1]["Time_Stamp"],
      //   });
      // }

      // itemDataToday = itemDataToday.map((i) => {
      //   return {
      //     deviceID: i.deviceID,
      //     humidity: i.humidity,
      //     roomtemp: i.roomtemp,
      //     timeStamp: new Date(i.timeStamp.split(".")[0]).setHours(
      //       new Date(i.timeStamp.split(".")[0]).getHours() + 5
      //     ),
      //   };
      // });

      // itemDataToday = itemDataToday.map((i) => {
      //   return {
      //     deviceID: i.deviceID,
      //     humidity: i.humidity,
      //     roomtemp: i.roomtemp,
      //     timeStamp: new Date(i.timeStamp).setMinutes(
      //       new Date(i.timeStamp).getMinutes() + 30
      //     ),
      //   };
      // });

      // itemDataToday = itemDataToday.map((i) => {
      //   return {
      //     deviceID: i.deviceID,
      //     humidity: i.humidity,
      //     roomtemp: i.roomtemp,
      //     timeStamp: new Date(new Date(i.timeStamp)),
      //   };
      // });

      // itemDataToday = itemDataToday.sort((a, b) => {
      //   return (
      //     new Date(a.timeStamp).getTime() - new Date(b.timeStamp).getTime()
      //   );
      // });

      // console.log("03-01-2022 : ", itemDataToday);

      /*****************************************/

      let pageNumCopy = pageNum;

      while (pageNumCopy !== 0) {
        let itemData = await this.getApiDataPageWise(
          pageNum,
          otherMonthPageNum,
          deviceId,
          0
        );

        let getItemsData = getItemData(itemData);

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

          this.setState({
            iotItems: data,
            loading: false,
          });

          break;
        } else {
          getOtherMonthData = getItemsData.filter(
            (i) =>
              new Date(i["timeStamp"]).getMonth() + 1 !==
              this.state.date.getMonth() + 1
          );

          getOtherMonthData = getItemsData.filter(
            (i) =>
              (new Date(i["timeStamp"]).getMonth() + 1 === 12 &&
              this.state.date.getMonth() + 1 === 1
                ? 0
                : new Date(i["timeStamp"]).getMonth() + 1) <
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
      // window.location.reload(false);
      // window.addEventListener("focus", this.onFocus);
    } catch (error) {
      console.log("Error Message: ", error);
      sessionStorage.setItem("error", error);
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

    if (checkOnce === 1) {
      if (otherPageNum !== undefined) {
        if (otherPageNum.length > 0) {
          for (let i = 0; i < otherPageNum.length; i++) {
            urlcopy = "";
            urlcopy = url + otherPageNum[i];

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
      let otherMonthPageNum = [];

      if (this.state.date.getMonth() + 1 !== new Date().getMonth() + 1) {
        this.setState({ date: new Date() });
      }

      var pageNum = await this.getApiData(
        "http://10.1.19.25:5000/energygrid1?where={%22Device_ID%22:%22" +
          options.label +
          "%22}&max_results=1440"
      );

      let pageNumCopy = pageNum;

      if (pageNumCopy > 0) {
        if (!this.state.loading) {
          this.setState({ loading: true });
        }
      }

      while (pageNumCopy !== 0) {
        let itemData = await this.getApiDataPageWise(
          pageNum,
          otherMonthPageNum,
          options.label,
          0
        );

        let getItemsData = getItemData(itemData);

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

          this.setState({
            iotItems: data,
            loading: false,
            onlyOnePrevMonth: false,
          });
          break;
        } else {
          getOtherMonthData = getItemsData.filter(
            (i) =>
              new Date(i["timeStamp"]).getMonth() + 1 !==
              this.state.date.getMonth() + 1
          );

          getOtherMonthData = getItemsData.filter(
            (i) =>
              (new Date(i["timeStamp"]).getMonth() + 1 === 12 &&
              this.state.date.getMonth() + 1 === 1
                ? 0
                : new Date(i["timeStamp"]).getMonth() + 1) <
              this.state.date.getMonth() + 1
          );

          if (getOtherMonthData.length > 0) {
            otherMonthPageNum.push(pageNum);
          }

          pageNum = pageNum - 1;
          data.push(getSelectedMonthData);
        }
      }

      //get current date full data
      if (this.state.iotItems.length > 0) {
        this.setState({
          curSeletedDate: this.state.iotData.filter(
            (d) =>
              new Date(d.timeStamp).setHours(0, 0, 0, 0) ===
              new Date().setHours(0, 0, 0, 0)
          ),
        });
      } else {
        this.setState({ curSeletedDate: null });
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

  calType = async (selVal) => {
    this.setState({ type: selVal });

    if (selVal === "Monthly") {
      try {
        let data = [];
        let getOtherMonthData = [];
        let getSelectedMonthData = [];
        let otherMonthPageNum = [];
        let devId = "";

        if (sessionStorage.getItem("deviceId") === null) {
          devId = [...this.state.deviceIdCurrent];
        } else {
          devId = sessionStorage.getItem("deviceId");
        }

        if (this.state.date.getMonth() + 1 !== new Date().getMonth() + 1) {
          this.setState({ date: new Date() });
        }

        var pageNum = await this.getApiData(
          "http://10.1.19.25:5000/energygrid1?where={%22Device_ID%22:%22" +
            devId +
            "%22}&max_results=1440"
        );

        let pageNumCopy = pageNum;

        if (pageNumCopy > 0) {
          if (!this.state.loading) {
            this.setState({ loading: true });
          }
        }

        while (pageNumCopy !== 0) {
          let itemData = await this.getApiDataPageWise(
            pageNum,
            otherMonthPageNum,
            devId,
            0
          );

          let getItemsData = getItemData(itemData);

          getSelectedMonthData = getItemsData.filter(
            (i) =>
              new Date(i["timeStamp"]).getMonth() + 1 ===
              this.state.date.getMonth() + 1
          );

          if (getSelectedMonthData.length === 0) {
            pageNumCopy = 0;

            sessionStorage.setItem("deviceId", devId);
            sessionStorage.setItem("apiCurPageNum", pageNum);
            sessionStorage.setItem(
              "otherMonthPageNum",
              JSON.stringify(otherMonthPageNum)
            );

            this.setState({
              iotItems: data,
              loading: false,
            });
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

        //get current date full data
        this.setState({
          curSeletedDate: this.state.iotData.filter(
            (d) =>
              new Date(d.timeStamp).setHours(0, 0, 0, 0) ===
              new Date().setHours(0, 0, 0, 0)
          ),
        });

        window.scrollTo(0, 0);
      } catch (error) {
        console.log("Error Message: ", error);
      }
    }
  };

  render() {
    //refresh app
    const refreshPage = (e) => {
      e.preventDefault();
      sessionStorage.clear();
      window.location.reload(false);
    };

    // console.log(plusSlides(5));

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

      var nexMonth = new Date(
        this.state.date.getFullYear(),
        this.state.date.getMonth() + 1,
        1
      );

      let todayDate = new Date();

      let prevMonth = 0;

      if (this.state.date.getMonth() + 2 > 12) {
        prevMonth = 0;
      } else {
        prevMonth = this.state.date.getMonth() + 2;
      }

      if (
        prevMonth <= new Date(todayDate).getMonth() + 1 &&
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
          curSeletedDate: null,
          onlyOnePrevMonth: false,
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

        if (pageNumCopy > 0) {
          if (!this.state.loading) {
            this.setState({ loading: true });
          }
        }

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

          let getItemsData = getItemData(itemData);

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
              if (!otherMonthPageNum.includes(apiCurPageNum)) {
                otherMonthPageNum.push(apiCurPageNum);
              }
            }

            apiCurPageNum = apiCurPageNum + 1;
            data.push(getSelectedMonthData);
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

      var prevMonth = new Date(
        this.state.date.getFullYear(),
        this.state.date.getMonth() - 1,
        1
      );

      let todayDate = new Date();

      if (!this.state.onlyOnePrevMonth) {
        if (prevMonth.getMonth() + 1 === 12) {
          curDate = new Date(prevMonth.getFullYear(), prevMonth.getMonth(), 1);
        } else {
          curDate = new Date(prevMonth.getFullYear(), prevMonth.getMonth(), 1);
        }

        this.setState({
          date: curDate,
          displayedMonth: curDate.getMonth() + 1,
          displayedYear: curDate.getFullYear(),
          curSeletedDate: null,
          onlyOnePrevMonth: true,
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

        if (pageNumCopy > 0) {
          if (!this.state.loading) {
            this.setState({ loading: true });
          }
        }

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

          let getItemsData = getItemData(itemData);

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

            this.setState({
              iotItems: data,
              loading: false,
              apiCurPageNum: sessionStorage.getItem("apiCurPageNum"),
              otherMonthPageNum: JSON.parse(
                sessionStorage.getItem("otherMonthPageNum")
              ),
            });

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

        let deviceIdCopy = sessionStorage.getItem("deviceId");

        let pageNumForCurrentDate = await this.getApiData(
          "http://10.1.19.25:5000/energygrid1?where={%22Device_ID%22:%22" +
            deviceIdCopy +
            "%22}&max_results=1440"
        );

        let curentData = await fetch(
          "http://10.1.19.25:5000/energygrid1?where={%22Device_ID%22:%22" +
            deviceIdCopy +
            "%22}&max_results=1440&page=" +
            pageNumForCurrentDate
        );

        let respData = await curentData.text();
        let respText = respData.replaceAll("NaN", "0");
        var apiJson = JSON.parse(respText);
        var items = Object.entries(apiJson["_items"]);

        var testData = [];
        var dataToday = [];

        items.map((item) => {
          testData.push(item);
        });

        for (const d in testData) {
          dataToday.push({
            deviceID: testData[d][1]["Device_ID"],
            humidity: testData[d][1]["Humidity"],
            roomtemp: testData[d][1]["room_temp"],
            timeStamp: testData[d][1]["Time_Stamp"],
            externalTemp: testData[d][1]["External_temp"],
            unitConsumption: testData[d][1]["unit_consumption"],
          });
        }

        dataToday = dataToday.sort((a, b) => {
          return (
            new Date(a.timeStamp).getTime() - new Date(b.timeStamp).getTime()
          );
        });

        dataToday = dataToday
          .filter(
            (d) =>
              new Date(d.timeStamp).setHours(0, 0, 0, 0) ===
              new Date().setHours(0, 0, 0, 0)
          )
          .pop();

        this.setState({
          dataCurrent: dataToday,
          deviceIdCurrent: deviceIdCopy,
        });

        sessionStorage.setItem("deviceId", this.state.deviceIdCurrent);
        sessionStorage.setItem("apiCurPageNum", this.state.apiCurPageNum);
        sessionStorage.setItem(
          "otherMonthPageNum",
          JSON.stringify(otherMonthPageNum)
        );
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
      // outPut = <p className="text-center">Loading... Please wait..</p>;
      outPut = (
        <div id="content-wrapper" className="d-flex flex-column">
          <div id="content">
            <Temp
              currentDateLastItemTemp={0}
              deviceId={sessionStorage.getItem("deviceId")}
            ></Temp>
            <div className="container-fluid">
              <p className="text-center">
                No data to display !!... Please wait..
              </p>
            </div>
          </div>
        </div>
      );
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
          let iotDataAvgCopy = 1;
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
              // new Date(preDt).setHours(0, 0, 0, 0) ===
              // new Date(iotDt).setHours(0, 0, 0, 0)
              moment(preDt).format("YYYY-MM-DD") ===
              moment(iotDt).format("YYYY-MM-DD")
            ) {
              if (iotDataAvg === 1) {
                iotDataAvgCopy = 1;
              }

              iotDataAvg = iotDataAvg + 1;
              iotDataAvgCopy = iotDataAvg;

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
                // new Date(preDt).setHours(0, 0, 0, 0) !==
                //   new Date(iotDt).setHours(0, 0, 0, 0)
                moment(preDt).format("YYYY-MM-DD") !==
                  moment(iotDt).format("YYYY-MM-DD")
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

          if (
            moment(preDt).format("YYYY-MM-DD") !==
            moment(iotDt).format("YYYY-MM-DD")
          ) {
            iotDataAvgCopy = 1;
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
      //   console.log(new Date(result.date));
      //   console.log(result.temp);
      // });

      showSpinner = this.state.loading ? (
        <div className="spinner-border" role="status">
          <span className="sr-only">Loading</span>
        </div>
      ) : (
        ""
      );

      let changeCal = "";

      if (this.state.iotData.length > 0 && !this.state.loading) {
        if (this.state.type === "Monthly") {
          changeCal = (
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
          );
        } else if (this.state.type === "Weekly") {
          changeCal = (
            <WeekCalendar
              ioMonthlyData={currentSelectedMonthData}
              tempVal={this.state.selectTempVal}
            ></WeekCalendar>
          );
        }
      } else {
        changeCal = <div>{showSpinner}</div>;
      }

      outPut = (
        <div id="content-wrapper" className="d-flex flex-column">
          <div id="content">
            <Temp
              currentDateLastItemTemp={
                currentDateLastItem !== undefined
                  ? currentDateLastItem
                  : this.state.dataCurrent
              }
              deviceId={
                sessionStorage.getItem("deviceId") === null
                  ? this.state.deviceIdCurrent
                  : sessionStorage.getItem("deviceId")
              }
              isLoading={this.state.loading}
            ></Temp>
            <div className="container-fluid">
              <div className="row">
                <div className="col-xl-8 col-lg-7">
                  <div className="card shadow mb-4">
                    <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                      <span className="m-0 font-weight-bold text-primary">
                        Calendar
                      </span>
                      <span className="m-0 font-weight-bold text-primary">
                        {this.state.type}
                      </span>
                    </div>

                    <div className="card-body d-flex justify-content-center">
                      {changeCal}
                    </div>
                  </div>
                </div>
                <div className="col-xl-4 col-lg-5">
                  <div className="card shadow mb-4">
                    <div className="card-body">
                      <div className="row">
                        <div className="col">
                          <div className="row mt-2">
                            <div className="col-md-8">
                              <Select
                                selectAc={this.selectAc}
                                isLoading={this.state.loading}
                              />
                            </div>
                          </div>
                          <div className="row mt-4">
                            <div className="col-md-10">
                              <SelectTemp
                                selectTemp={this.selectTemp}
                                isLoading={this.state.loading}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      <div className="card shadow mb-4">
                        <TempTable
                          selTemp={this.state.selectTempVal}
                          lastThirtyData={
                            this.state.curSeletedDate === null
                              ? barChartData
                              : this.state.curSeletedDate
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    // }

    var element = (
      <div id="wrapper">
        <NavBar refreshPage={refreshPage} calType={this.calType} />
        {outPut}
      </div>
    );

    return <React.Fragment>{element}</React.Fragment>;
  }
}

export default App;
