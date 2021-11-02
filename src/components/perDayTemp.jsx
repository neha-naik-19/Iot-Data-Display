import React, { Component } from "react";
import { Line } from "react-chartjs-2";
import moment from "moment";

class perDayTemp extends Component {
  state = { displayColor: [] };

  backColor() {
    if (this.props.tempVal === "01") {
    }
  }

  render() {
    let labels = [];
    let data = [];
    let dataColor = [];
    let chartLabel = "";
    let selectedDt = null;

    // console.log(this.props);

    if (this.props.barChartData !== 0) {
      this.props.barChartData.map((item) => {
        labels.push(
          // moment(
          //   new Date(new Date(item.timeStamp).toUTCString().substr(0, 25))
          // ).format("hh:mm A")
          moment(new Date(item.timeStamp)).format("hh:mm A")
        );
      });

      if (this.props.tempVal === "01") {
        chartLabel = `Room Temp.`;

        this.props.barChartData.map((item) => {
          data.push(
            parseFloat(item.roomtemp) > 0 ? parseFloat(item.roomtemp) : ""
          );
        });
      }

      if (this.props.tempVal === "02") {
        chartLabel = `Electricity`;

        this.props.barChartData.map((item) => {
          data.push(
            parseFloat(item.unitConsumption) > 0
              ? parseFloat(item.unitConsumption)
              : ""
          );
        });
      }

      if (this.props.tempVal === "03") {
        chartLabel = `Humidity`;

        this.props.barChartData.map((item) => {
          data.push(
            parseFloat(item.humidity) > 0 ? parseFloat(item.humidity) : ""
          );
        });
      }
    }

    dataColor = [];
    for (const cl in data) {
      if (parseInt(data[cl]) < 60) {
        dataColor.push("#718eff");
      } else if (parseInt(data[cl]) >= 60) {
        dataColor.push("#0235ff");
      }
    }

    let outPut = "";

    if (
      this.props.barChartData.length === 0 ||
      this.props.barChartData.length === undefined
    ) {
      outPut = (
        <div
          style={{ height: "152em", border: "1px solid #fff" }}
          className="centerDivContent"
        >
          <div
            style={{
              fontSize: 19,
              family: "arial",
              textAlign: "center",
            }}
          >
            No Data to Display
          </div>
          <div
            style={{
              fontSize: 14,
              family: "arial",
              textAlign: "center",
            }}
          >
            Please make a different filter selection
          </div>
        </div>
      );
    } else {
      selectedDt = this.props.barChartData
        .map((item) => {
          return {
            // lastDt: new Date(
            //   new Date(item.timeStamp).toUTCString().substr(0, 25)
            // ),
            lastDt: new Date(item.timeStamp),
          };
        })
        .pop();

      for (const dt in selectedDt) {
        selectedDt = selectedDt[dt].toString();
      }

      outPut = (
        <Line
          options={{
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: "x",
            scales: {
              y: {
                beginAtZero: false,
                ticks: {
                  color: "black",
                },
              },
              x: {
                display: true,
                ticks: {
                  color: "black",
                  font: {
                    size: 10.2,
                    family: "arial",
                  },
                },
              },
            },
            plugins: {
              // legend: {
              //   display: true,
              //   labels: {
              //     color: "#2F4F4F",
              //   },
              // },
              title: {
                display: true,
                text: new Date(selectedDt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }),
                color: "#2F4F4F",
                font: {
                  size: 15,
                  family: "arial",
                  weight: "bold",
                },
              },
            },
          }}
          data={{
            labels,
            datasets: [
              {
                label: chartLabel,
                data,
                backgroundColor: dataColor,
                fill: false,
                showLine: true,
                tension: 0.5,
                borderColor: "#a9dfbf",
                borderWidth: 1.5,
                pointRadius: 3.2,
                // pointBackgroundColor: "red",
                // pointStyle: "rect",
              },
            ],
          }}
        ></Line>
      );
    }

    return (
      <div
        className="bar card item-card card-block card-text"
        style={{
          // visibility: "visible",
          backgroundColor: "#f2f4f4",
        }}
      >
        {outPut}
      </div>
    );
  }
}

export default perDayTemp;
