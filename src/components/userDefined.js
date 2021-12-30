// export const plusSlides = (n) => {
//   return 5 + n;
// };

const monthFirstDate = (dt) => new Date(dt.getFullYear(), dt.getMonth(), 1);

const getRestApiData = async (deviceId, dt) => {
  let iotItems = [];

  // console.log("selected api data : ", deviceId, dt);

  try {
    let data = [];
    let getOtherMonthData = [];
    let otherMonthPageNum = [];
    let getSelectedMonthData = [];
    let barChartData = [];

    var pageNum = await getApiDataExport(
      "http://10.1.19.25:5000/energygrid1?where={%22Device_ID%22:%22" +
        deviceId +
        "%22}&max_results=1440"
    );

    let pageNumCopy = pageNum;

    while (pageNumCopy !== 0) {
      let itemData = await getApiDataPageWiseExport(
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
          timeStamp: new Date(i.timeStamp.split(".")[0]).setHours(
            new Date(i.timeStamp.split(".")[0]).getHours() + 5
          ),
          externalTemp: i.externalTemp,
        };
      });

      getItemsData = getItemsData.map((i) => {
        return {
          id: i.id,
          deviceID: i.deviceID,
          humidity: i.humidity,
          roomtemp: i.roomtemp,
          unitConsumption: i.unitConsumption,
          timeStamp: new Date(i.timeStamp).setMinutes(
            new Date(i.timeStamp).getMinutes() + 30
          ),
          externalTemp: i.externalTemp,
        };
      });

      getItemsData = getItemsData.map((i) => {
        return {
          id: i.id,
          deviceID: i.deviceID,
          humidity: i.humidity,
          roomtemp: i.roomtemp,
          unitConsumption: i.unitConsumption,
          timeStamp: new Date(new Date(i.timeStamp)),
          externalTemp: i.externalTemp,
        };
      });

      getSelectedMonthData = getItemsData.filter(
        (i) => new Date(i["timeStamp"]).getMonth() + 1 === dt.getMonth() + 1
      );

      if (getSelectedMonthData.length === 0) {
        pageNumCopy = 0;

        iotItems = [...data];

        // sessionStorage.setItem("chartIotData", JSON.stringify(iotItems));
        //const user = JSON.parse(localStorage.getItem('user'));

        break;
      } else {
        getOtherMonthData = getItemsData.filter(
          (i) => new Date(i["timeStamp"]).getMonth() + 1 !== dt.getMonth() + 1
        );

        getOtherMonthData = getItemsData.filter(
          (i) => new Date(i["timeStamp"]).getMonth() + 1 < dt.getMonth() + 1
        );

        if (getOtherMonthData.length > 0) {
          otherMonthPageNum.push(pageNum);
        }

        pageNum = pageNum - 1;
        data.push(getSelectedMonthData);
      }
    }

    let iotData = [];

    if (iotItems !== null) {
      if (iotItems.length > 0) {
        let iotItemsCopy = [];
        let dataCnt = [];

        iotItemsCopy = [...iotItems];

        let cnt = 1;

        for (let i = 0; i < iotItemsCopy.length; i++) {
          dataCnt = iotItemsCopy[i];
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

        barChartData = iotData.filter(
          (d) =>
            new Date(d.timeStamp).setHours(0, 0, 0, 0) ===
            new Date(dt).setHours(0, 0, 0, 0)
        );
      }
    }

    window.scrollTo(0, 0);

    return barChartData;
  } catch (error) {
    console.log("Error Message: ", error);
  }
};

async function fetchData(url) {
  let resp = await fetch(url);
  let respData = await resp.text();
  let respText = respData.replaceAll("NaN", "0");
  let dataJson = JSON.parse(respText);

  return Object.entries(dataJson["_items"]);
}

async function getApiDataExport(url) {
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

async function getApiDataPageWiseExport(
  pageNum,
  otherPageNum,
  deviceId,
  checkOnce
) {
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

          otherPageData = await fetchData(urlcopy);

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
      itemsData = await fetchData(urlcopy);

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
    itemsData = await fetchData(urlcopy);

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

const getItemData = (itemData) => {
  let getItemsData = itemData.map((i) => {
    return {
      id: i.id,
      deviceID: i.deviceID,
      humidity: i.humidity,
      roomtemp: i.roomtemp,
      unitConsumption: i.unitConsumption,
      timeStamp: new Date(i.timeStamp.split(".")[0]).setHours(
        new Date(i.timeStamp.split(".")[0]).getHours() + 5
      ),
      externalTemp: i.externalTemp,
    };
  });

  getItemsData = getItemsData.map((i) => {
    return {
      id: i.id,
      deviceID: i.deviceID,
      humidity: i.humidity,
      roomtemp: i.roomtemp,
      unitConsumption: i.unitConsumption,
      timeStamp: new Date(i.timeStamp).setMinutes(
        new Date(i.timeStamp).getMinutes() + 30
      ),
      externalTemp: i.externalTemp,
    };
  });

  getItemsData = getItemsData.map((i) => {
    return {
      id: i.id,
      deviceID: i.deviceID,
      humidity: i.humidity,
      roomtemp: i.roomtemp,
      unitConsumption: i.unitConsumption,
      timeStamp: new Date(new Date(i.timeStamp) /*.toISOString()*/),
      externalTemp: i.externalTemp,
    };
  });

  return getItemsData;
};

export { getRestApiData };
export { monthFirstDate };
export { getItemData };
