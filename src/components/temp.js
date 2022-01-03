import React from "react";

const temp = ({ currentDateLastItemTemp, deviceId, isLoading }) => {
  let deviceIdCopy = "";

  if (deviceId === "") {
    deviceIdCopy = isLoading ? (
      <div className="spinner-border spinner-border-sm" role="status">
        <span className="sr-only">Loading</span>
      </div>
    ) : (
      ""
    );
  } else {
    deviceIdCopy = deviceId;
  }

  if (isLoading) {
    deviceIdCopy = "";

    if (deviceIdCopy === "") {
      deviceIdCopy = (
        <div className="spinner-border spinner-border-sm" role="status">
          <span className="sr-only">Loading</span>
        </div>
      );
    }
  }

  return (
    <div>
      <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
        <button
          id="sidebarToggleTop"
          className="btn btn-link d-md-none rounded-circle mr-3"
        >
          <i className="fa fa-bars"></i>
        </button>
        <ul>
          <div>
            <span style={{ fontSize: 25, color: "#A9A9A9" }}>Dashboard</span>
          </div>
        </ul>
      </nav>
      <div className="container-fluid">
        <div className="d-sm-flex align-items-center justify-content-between mb-4">
          <h1 className="h3 mb-0 text-gray-800">{deviceIdCopy}</h1>
        </div>

        <div className="row">
          <div className="col-xl-3 col-md-6 mb-4">
            <div className="card border-left-primary shadow h-100 py-2">
              <div className="card-body">
                <div className="row no-gutters align-items-center">
                  <div className="col mr-2">
                    <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                      Room Temperature
                    </div>
                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                      {currentDateLastItemTemp !== undefined
                        ? currentDateLastItemTemp.roomtemp
                        : ""}
                    </div>
                  </div>
                  <div className="col-auto">
                    <i className="fas fa-temperature-high fa-2x text-gray-300"></i>
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
                      Unit Consumption
                    </div>
                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                      {currentDateLastItemTemp !== undefined
                        ? currentDateLastItemTemp.unitConsumption
                        : ""}
                    </div>
                  </div>
                  <div className="col-auto">
                    <i className="fas fa-mountain fa-2x text-gray-300"></i>
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
                      Humidity
                    </div>
                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                      {currentDateLastItemTemp !== undefined
                        ? currentDateLastItemTemp.humidity
                        : ""}
                    </div>
                  </div>
                  <div className="col-auto">
                    <i className="fas fa-sun fa-2x text-gray-300"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-md-6 mb-4">
            <div className="card border-left-info shadow h-100 py-2">
              <div className="card-body">
                <div className="row no-gutters align-items-center">
                  <div className="col mr-2">
                    <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                      External Temp.
                    </div>
                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                      <span>
                        {currentDateLastItemTemp !== undefined
                          ? currentDateLastItemTemp.externalTemp
                          : ""}
                      </span>
                      <span> &deg;C</span>
                    </div>
                  </div>
                  <div className="col-auto">
                    <i className="fas fa-temperature-high fa-2x text-gray-300"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default temp;
