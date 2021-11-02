import { React } from "react";

export const restApiData = (url, isRender, date, pageNum, hrefNoPageNum) => {
  var test = null;

  var itemsValue = [];
  let itemsArray = [];

  if (isRender === 0) {
    var test = fetchNow(url, pageNum, hrefNoPageNum, date, isNextDate);
  }

  // one for power consumption, one for temperature and another for humidity
  return test;
};

var changePageNum = 0;
var isNextDate = false;

var fetchNow = function (url, pageNum, hrefNoPageNum, date, isNextDate) {
  var itemsValue = [];
  let itemsArray = [];

  console.log(pageNum);

  var pageUrl =
    "http://10.1.19.25:5000/" + hrefNoPageNum + (pageNum - changePageNum);

  fetch(url, { mode: "cors" })
    .then(function (response) {
      return response.text();
    })
    .then(function (responseText) {
      responseText = responseText.replaceAll("NaN", "0");
      var responseData = JSON.parse(responseText);
      var itemsData = Object.entries(responseData["_items"]);

      itemsData.map((item) => {
        itemsArray.push(item);
      });
    });

  for (const item in itemsArray) {
    var createdDate = new Date(itemsArray[item][1]["_created"]);
    if (date === createdDate) {
      itemsValue.push({
        id: itemsArray[item][1]["_id"],
        deviceID: itemsArray[item][1]["Device_ID"],
        current: itemsArray[item][1]["Current"],
        humidity: itemsArray[item][1]["Humidity"],
        created: itemsArray[item][1]["_created"],
        roomtemp: itemsArray[item][1]["room_temp"],
        voltage: itemsArray[item][1]["voltage"],
      });
    } else {
      // isNextDate = true;
      // changePageNum = changePageNum + 1;
      break;
    }
  }

  console.log("test fetchNow 1234", pageUrl);
  console.log("itemsValue : ", itemsValue);
};
