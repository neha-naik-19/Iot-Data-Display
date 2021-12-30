import React, { Component } from "react";
import { Line } from "react-chartjs-2";
import moment from "moment";

class perDayTemp extends Component {
  state = { displayColor: [], isMultiRender: false };

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
    let loading = true;
    let showSpinner = "";

    let outPut = "";

    showSpinner = loading ? (
      <div className="spinner-border" role="status">
        <span className="sr-only">Loading</span>
      </div>
    ) : (
      ""
    );

    if (this.props.barChartData.length > 0) {
      this.state.isMultiRender = true;

      this.props.barChartData.map((item) => {
        labels.push(moment(new Date(item.timeStamp)).format("hh:mm A"));
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

      dataColor = [];
      if (this.props.tempVal === "01") {
        for (const cl in data) {
          if (parseInt(data[cl]) <= 18) {
            dataColor.push("#ffa07a");
          } else if (parseInt(data[cl]) <= 26) {
            dataColor.push("#fa8072");
          } else if (parseInt(data[cl]) > 26) {
            dataColor.push("#ff0000");
          }
        }
      } else {
        for (const cl in data) {
          if (parseInt(data[cl]) < 60) {
            dataColor.push("#718eff");
          } else if (parseInt(data[cl]) >= 60) {
            dataColor.push("#0235ff");
          }
        }
      }

      selectedDt = this.props.barChartData
        .map((item) => {
          return {
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
    } else {
      outPut = <div>{showSpinner}</div>;
    }

    return (
      <div
        className="card-body d-flex justify-content-center align-items-center"
        style={{ height: 520 }}
      >
        {outPut}
      </div>
    );
  }
}

export default perDayTemp;
