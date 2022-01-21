import React, { Component } from "react";

import "@syncfusion/ej2-base/styles/material.css";
import "@syncfusion/ej2-buttons/styles/material.css";
import "@syncfusion/ej2-dropdowns/styles/material.css";
import "@syncfusion/ej2-calendars/styles/material.css";
import "@syncfusion/ej2-inputs/styles/material.css";
import "@syncfusion/ej2-navigations/styles/material.css";
import "@syncfusion/ej2-popups/styles/material.css";
import "@syncfusion/ej2-react-schedule/styles/material.css";

import moment from "moment";

import {
  Inject,
  ScheduleComponent,
  Week,
  EventSettingsModel,
  ViewsDirTypecast,
  ViewDirective,
  ViewsDirective,
  ResourcesDirective,
  ResourceDirective,
} from "@syncfusion/ej2-react-schedule";

import { Query } from "@syncfusion/ej2-data";

class weekCalendar extends Component {
  constructor() {
    super();
    this.state = { weekdata: [] };
    this.dataQuery = new Query().from("Events").addParams("readOnly", "true");
  }

  render() {
    let outPut = "";
    let weeklyCalendarData = [];

    if (this.props.ioMonthlyData.length > 0) {
      let curr = new Date();
      let week = [];

      var firstDayOfWeek = new Date(
        curr.setDate(curr.getDate() - curr.getDay())
      ).toUTCString();

      var j = 7;
      var priorDate = [];
      while (j > 0) {
        priorDate.push(
          new Date(new Date().setDate(new Date(firstDayOfWeek).getDate() - j))
        );
        j--;
      }

      for (let i = 0; i <= 6; i++) {
        let first = curr.getDate() - curr.getDay() + i;
        let day = new Date(curr.setDate(first)).toISOString().slice(0, 10);
        week.push(new Date(day));
      }

      /*************************** */

      this.state.weekdata = [];

      for (const wk in priorDate) {
        this.state.weekdata.push(
          this.props.ioMonthlyData.filter(
            (i) =>
              new Date(i["timeStamp"]).setHours(0, 0, 0, 0) ===
              new Date(priorDate[wk]).setHours(0, 0, 0, 0)
          )
        );
      }

      for (const wk in week) {
        this.state.weekdata.push(
          this.props.ioMonthlyData.filter(
            (i) =>
              new Date(i["timeStamp"]).setHours(0, 0, 0, 0) ===
              week[wk].setHours(0, 0, 0, 0)
          )
        );
      }

      let data = [];

      data = this.state.weekdata.filter(
        (d) => !Object.values(d).every((v) => v === [])
      );

      let dataInOneArray = [];
      let dataCnt = [];

      for (let i = 0; i < data.length; i++) {
        dataCnt = data[i];
        for (let j = 0; j < dataCnt.length; j++) {
          dataInOneArray.push(dataCnt[j]);
        }
      }

      data = dataInOneArray;

      // data = data.slice(-5);

      //calculating the room temp. average on each day
      let preDt = "";
      let iotDataAvg = 0;
      let iotDataAvgCopy = 1;
      let iotRoomTemp = 0;
      let unitConsumption = 0;
      let humidity = 0;
      let externalTemp = 0;
      let prevHr = "";
      let preDtHr = "";

      for (var i = 0; i < data.length; i++) {
        var iotDt = new Date(
          new Date(data[i]["timeStamp"]).getFullYear(),
          new Date(data[i]["timeStamp"]).getMonth(),
          new Date(data[i]["timeStamp"]).getDate(),
          new Date(data[i]["timeStamp"]).getHours()
        );

        var iotHr = new Date(data[i]["timeStamp"]).getHours();

        var iotDtHr = new Date(
          new Date(data[i]["timeStamp"]).getFullYear(),
          new Date(data[i]["timeStamp"]).getMonth(),
          new Date(data[i]["timeStamp"]).getDate(),
          new Date(data[i]["timeStamp"]).getHours(),
          new Date(data[i]["timeStamp"]).getMinutes()
        );

        if (
          moment(preDt).format("YYYY-MM-DD HH") ===
          moment(iotDt).format("YYYY-MM-DD HH")
        ) {
          if (iotDataAvg === 1) {
            iotDataAvgCopy = 1;
          }
          iotDataAvg = iotDataAvg + 1;
          iotDataAvgCopy = iotDataAvg;

          iotRoomTemp =
            parseFloat(iotRoomTemp) + parseFloat(data[i]["roomtemp"]);
          unitConsumption =
            parseFloat(unitConsumption) +
            parseFloat(data[i]["unitConsumption"]);
          humidity = parseFloat(humidity) + parseFloat(data[i]["humidity"]);
          externalTemp =
            parseFloat(externalTemp) + parseFloat(data[i]["externalTemp"]);

          prevHr = iotHr;
          preDtHr = iotDtHr;
        } else {
          if (
            preDt !== "" &&
            moment(preDt).format("YYYY-MM-DD HH") !==
              moment(iotDt).format("YYYY-MM-DD HH")
          ) {
            var object = {
              id: data[i - 1]["id"],
              deviceID: data[i - 1]["deviceID"],
              unitConsumption: (unitConsumption / iotDataAvg).toFixed(2),
              humidity: (humidity / iotDataAvg).toFixed(2),
              roomtemp: (iotRoomTemp / iotDataAvg).toFixed(2),
              externalTemp: (externalTemp / externalTemp).toFixed(2),
              timeStamp: preDtHr,
            };

            prevHr = iotHr;

            weeklyCalendarData.push(object);
            preDt = iotDt;
          }

          iotDataAvg = 1;

          iotRoomTemp = parseFloat(data[i]["roomtemp"]);
          unitConsumption = parseFloat(data[i]["unitConsumption"]);
          humidity = parseFloat(data[i]["humidity"]);
          externalTemp = parseFloat(data[i]["externalTemp"]);

          // prevHr = iotHr;
          preDt = iotDt;
          preDtHr = iotDtHr;
        }
      }

      if (
        moment(preDt).format("YYYY-MM-DD HH") !==
        moment(iotDtHr).format("YYYY-MM-DD HH")
      ) {
        iotDataAvgCopy = 1;
      }

      //getting the last day room temp. average calculation which has not included in above loop
      if (iotDataAvgCopy > 0) {
        var object1 = {
          id: data[i - 1]["id"],
          deviceID: data[i - 1]["deviceID"],
          unitConsumption:
            Math.round((unitConsumption / iotDataAvg) * 100 + Number.EPSILON) /
            100,
          humidity:
            Math.round((humidity / iotDataAvg) * 100 + Number.EPSILON) / 100,
          roomtemp:
            Math.round((iotRoomTemp / iotDataAvg) * 100 + Number.EPSILON) / 100,
          externalTemp:
            Math.round((externalTemp / iotDataAvg) * 100 + Number.EPSILON) /
            100,
          timeStamp: iotDtHr,
        };

        weeklyCalendarData.push(object1);
      }

      let displayData = [...weeklyCalendarData];
      weeklyCalendarData = [];

      if (this.props.tempVal === "01") {
        weeklyCalendarData = displayData.map((i) => {
          return {
            Id: i.id,
            Subject: i.roomtemp,
            StartTime: new Date(
              new Date(i.timeStamp).setMinutes(0, 0, 0)
            ).toISOString(),
            EndTime: new Date(i.timeStamp),
          };
        });
      } else if (this.props.tempVal === "02") {
        weeklyCalendarData = displayData.map((i) => {
          return {
            Id: i.id,
            Subject: i.unitConsumption,
            StartTime: new Date(
              new Date(i.timeStamp).setMinutes(0, 0, 0)
            ).toISOString(),
            EndTime: new Date(i.timeStamp),
          };
        });
      } else if (this.props.tempVal === "03") {
        weeklyCalendarData = displayData.map((i) => {
          return {
            Id: i.id,
            Subject: i.humidity,
            StartTime: new Date(
              new Date(i.timeStamp).setMinutes(0, 0, 0)
            ).toISOString(),
            EndTime: new Date(i.timeStamp),
          };
        });
      }
    }

    console.log("weeklyCalendarData : ", weeklyCalendarData);

    outPut = (
      <ScheduleComponent
        height="550px"
        currentView="Week"
        // showHeaderBar={false}
        readonly={true}
        showWeekNumber={false}
        eventSettings={{
          dataSource: weeklyCalendarData.length > 0 ? weeklyCalendarData : [],
          query: this.dataQuery,
          // template: cellTemplate1,
        }}
      >
        <ViewsDirective>
          <ViewDirective option="Week"></ViewDirective>
        </ViewsDirective>
        <Inject services={[Week]} />
      </ScheduleComponent>
    );

    return <div>{outPut}</div>;
  }
}
export default weekCalendar;
