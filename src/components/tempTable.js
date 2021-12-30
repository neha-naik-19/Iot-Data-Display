import React from "react";
import moment from "moment";

const tempTable = ({ selTemp, lastThirtyData }) => {
  let lastThirtyDataCopy = [];
  let tempType = "";
  let tableData = [];
  let outPut = "";

  if (lastThirtyData.length > 0) {
    lastThirtyDataCopy = [...lastThirtyData.slice(-30)];

    if (selTemp === "01") {
      tempType = "Room Temp.";
      lastThirtyDataCopy = lastThirtyDataCopy.map((i) => {
        return {
          dt: i.timeStamp,
          data: parseFloat(i.roomtemp),
        };
      });
    } else if (selTemp === "02") {
      tempType = "Unit Consumption";
      lastThirtyDataCopy = lastThirtyDataCopy.map((i) => {
        return {
          dt: i.timeStamp,
          data: parseFloat(i.unitConsumption),
        };
      });
    } else if (selTemp === "03") {
      tempType = "Humidity";
      lastThirtyDataCopy = lastThirtyDataCopy.map((i) => {
        return {
          dt: i.timeStamp,
          data: parseFloat(i.humidity),
        };
      });
    }

    tableData = lastThirtyDataCopy.reverse();

    let selectedDt = tableData.pop();

    let inCelsius = new Date(selectedDt.dt).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    outPut = (
      <div>
        <span style={{ fontWeight: "bold" }}>{inCelsius}</span>
        <div
          className="tableFixHead table-responsive"
          style={{ height: 355, overflow: "auto", marginTop: 10 }}
        >
          <table className="table table-hover">
            <thead className="thead-dark">
              <tr>
                <th scope="col">Time</th>
                <th scope="col">{tempType}</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((item) => (
                <tr key={item.key}>
                  <td
                    style={{
                      color:
                        selTemp === "01"
                          ? item.data > 26
                            ? "#ff0000"
                            : "#858796"
                          : "#858796",
                    }}
                  >
                    {moment(item.dt).format("hh:mm A")}
                  </td>
                  <td
                    className="text-center"
                    style={{
                      color:
                        selTemp === "01"
                          ? item.data > 26
                            ? "#ff0000"
                            : "#858796"
                          : "#858796",
                    }}
                  >
                    {item.data}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  } else {
    outPut = <div>No Data available</div>;
  }

  return <div className="card-body">{outPut}</div>;
};
export default tempTable;
