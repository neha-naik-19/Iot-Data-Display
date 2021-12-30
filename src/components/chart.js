import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
import DatePicker from "react-datepicker";

import moment from "moment";

import NavBar from "./navbar";
import Select from "./select";
import SelectTemp from "./selectTemp";
import PerDayTemp from "./perDayTemp";

import { getRestApiData, monthFirstDate } from "./userDefined";

class Chart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: "",
      chartData: [],
      date: new Date(),
      deviceId: "D250AC01",
      selectTempVal: "01",
      chartDataThirty: [],
      chartDataThirtyCopy: [],
      lastData: [],
      nextData: [],
      nextAvailable: 0,
    };
  }

  calType = () => {
    this.setState({ type: "" });
  };

  async componentDidMount() {
    this.setState({
      chartData: await getRestApiData(this.state.deviceId, this.state.date),
    });

    let remLastThirtyData = [];
    let barChartData = [];

    remLastThirtyData = [...this.state.chartData];

    barChartData = remLastThirtyData.slice(-30);

    let elemsToDelete = 30;

    remLastThirtyData.splice(
      remLastThirtyData.length - elemsToDelete,
      elemsToDelete
    );

    this.setState({
      lastData: barChartData,
      chartDataThirty: remLastThirtyData,
      chartDataThirtyCopy: remLastThirtyData,
      nextAvailable: 0,
    });
  }

  render() {
    const refreshPage = (e) => {
      e.preventDefault();
      window.location.reload(false);
    };

    let dt = "";

    const selectAc = async (options) => {
      this.setState({
        chartData: await getRestApiData(options.label, this.state.date),
        date: this.state.date,
        deviceId: options.label,
      });

      let remLastThirtyData = [];
      let barChartData = [];

      remLastThirtyData = [...this.state.chartData];

      barChartData = remLastThirtyData.slice(-30);
      this.setState({ lastData: barChartData });

      let elemsToDelete = 30;

      remLastThirtyData.splice(
        remLastThirtyData.length - elemsToDelete,
        elemsToDelete
      );

      this.setState({
        chartDataThirty: remLastThirtyData,
        chartDataThirtyCopy: remLastThirtyData,
        nextAvailable: 0,
      });
    };

    const selectTemp = (options) => {
      this.setState({ selectTempVal: Object.values(options)[0] });

      let remLastThirtyData = [];
      let barChartData = [];

      remLastThirtyData = [...this.state.chartData];

      barChartData = remLastThirtyData.slice(-30);
      this.setState({ lastData: barChartData });

      let elemsToDelete = 30;

      remLastThirtyData.splice(
        remLastThirtyData.length - elemsToDelete,
        elemsToDelete
      );

      this.setState({
        chartDataThirty: remLastThirtyData,
        chartDataThirtyCopy: remLastThirtyData,
        nextAvailable: 0,
      });
    };

    const handleChange = async (date) => {
      dt = date;
      this.setState({
        date: date,
        chartData: await getRestApiData(this.state.deviceId, dt),
      });

      let remLastThirtyData = [];
      let barChartData = [];

      remLastThirtyData = [...this.state.chartData];

      barChartData = remLastThirtyData.slice(-30);
      this.setState({ lastData: barChartData });

      let elemsToDelete = 30;

      remLastThirtyData.splice(
        remLastThirtyData.length - elemsToDelete,
        elemsToDelete
      );

      this.setState({
        chartDataThirty: remLastThirtyData,
        chartDataThirtyCopy: remLastThirtyData,
        nextAvailable: 0,
      });
    };

    const handleChartPrevious = () => {
      let prevData = [];
      let remLastThirtyData = [];
      let barChartData = [];

      if (this.state.nextData.length > 0) {
        let lastDataCopy = [...this.state.lastData];

        let firstNextData = lastDataCopy.shift();

        prevData = this.state.chartData.filter(
          (i) =>
            new Date(i["timeStamp"]).getTime() <
            new Date(firstNextData.timeStamp).getTime()
        );

        this.state.chartDataThirty = prevData;
        this.state.nextAvailable = 1;
      } else if (
        this.state.nextData.length === 0 &&
        this.state.chartDataThirty.length === 0 &&
        this.state.nextAvailable === 1
      ) {
        this.state.chartDataThirty = [...this.state.chartDataThirtyCopy];
        this.state.nextAvailable = 0;
      }

      if (this.state.chartDataThirty.length > 0) {
        remLastThirtyData = [...this.state.chartDataThirty];

        barChartData = remLastThirtyData.slice(-30);
        this.setState({ lastData: barChartData });

        let elemsToDelete = 30;

        remLastThirtyData.splice(
          remLastThirtyData.length - elemsToDelete,
          elemsToDelete
        );

        this.setState({ chartDataThirty: remLastThirtyData });
      }
    };

    const handleChartNext = () => {
      let nextData = [];
      let remLastThirtyData = [];
      let barChartData = [];

      let lastPrevData = this.state.lastData.slice(-1).pop();

      nextData = this.state.chartData.filter(
        (i) =>
          new Date(i["timeStamp"]).getTime() >
          new Date(lastPrevData.timeStamp).getTime()
      );

      this.state.nextData = nextData;
      this.state.chartDataThirty = nextData;

      if (this.state.chartDataThirty.length > 0) {
        remLastThirtyData = [...this.state.chartDataThirty];

        barChartData = remLastThirtyData.slice(0, 30);
        this.setState({ lastData: barChartData });

        this.setState({ chartDataThirty: remLastThirtyData });
      }

      if (nextData.length === 0) {
        this.state.chartDataThirty = [...this.state.chartDataThirtyCopy];
        this.state.nextAvailable = 0;
      }
    };

    const outPut = (
      <div id="content-wrapper" className="d-flex flex-column">
        <div id="content">
          <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
            <button
              id="sidebarToggleTop"
              className="btn btn-link d-md-none rounded-circle mr-3"
            >
              <i className="fa fa-bars"></i>
            </button>
            <ul>
              <div>
                <span style={{ fontSize: 25, color: "#A9A9A9" }}>Chart</span>
              </div>
            </ul>
          </nav>
          <div className="container-fluid">
            <div className="d-sm-flex align-items-center justify-content-between mb-4">
              <h1 className="h3 mb-0 text-gray-800">{this.state.deviceId}</h1>
            </div>

            <div className="row">
              <div className="col-xl-3 col-md-6 mb-4">
                <div className="card border-left-primary shadow h-100 py-2">
                  <div className="card-body">
                    <div className="row no-gutters align-items-center">
                      <div className="col mr-2">
                        <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                          <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                            Select Date
                          </div>
                          <div>
                            <DatePicker
                              selected={this.state.date}
                              onChange={handleChange}
                              name="startDate"
                              dateFormat="dd/MM/yyyy"
                              minDate={monthFirstDate(this.state.date)}
                              maxDate={moment().toDate()}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-xl-3 col-md-6 mb-4">
                <div className="card border-left-success shadow h-100 py-2">
                  <div className="card-body">
                    <div className="row no-gutters align-items-center">
                      <div className="col mr-2">
                        <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                          Device
                        </div>
                        <div>
                          <Select selectAc={selectAc} isLoading={false} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-xl-3 col-md-6 mb-4">
                <div className="card border-left-warning shadow h-100 py-2">
                  <div className="card-body">
                    <div className="row no-gutters align-items-center">
                      <div className="col mr-2">
                        <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                          Temperature Type
                        </div>
                        <div>
                          <SelectTemp
                            selectTemp={selectTemp}
                            isLoading={false}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="container-fluid">
            <div className="row">
              <div className="col-xl-12 col-lg-7">
                <div className="card shadow mb-4">
                  <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                    <div className="container">
                      <div className="row">
                        <div className="col">
                          <button
                            onClick={() => handleChartPrevious()}
                            className="btn btn-outline-dark btn-sm"
                            style={{ borderRadius: "50%" }}
                          >
                            Prev
                          </button>
                        </div>
                        <div className="col">
                          <button
                            onClick={() => handleChartNext()}
                            className="btn btn-outline-dark btn-sm float-right"
                            style={{ borderRadius: "50%" }}
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <PerDayTemp
                      barChartData={this.state.lastData}
                      tempVal={this.state.selectTempVal}
                    ></PerDayTemp>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );

    return (
      <div id="wrapper">
        <NavBar refreshPage={refreshPage} calType={this.calType} />
        {outPut}
      </div>
    );
  }
}

export default Chart;
