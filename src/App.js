import "./App.css";
import React from "react";
import io from "socket.io-client";
import { useEffect, useState } from "react";

const socket = io("http://io.nvdise.space", {
  timeout: 2000,
  secure: true,
  reconnection: false,
  transports: ["websocket"],
  // transports: ['polling'],
});

function App() {
  const [Daydata, setDayData] = useState([""]);
  const [data, setData] = useState([""]);
  const [data2, setData2] = useState([]);
  const [hourData, setHourData] = useState([]);
  const [hourData12, setHourData12] = useState([]);
  const [dataMarket1, setDataMarket1] = useState([]);
  const [dataMarket2, setDataMarket2] = useState(["aaaaa"]);
  let structureData = {};
  let tradeData = {};
  window.tradeData = tradeData;
  socket.on("market-data", (msg) => {
    if (msg.type === "trade") {
      // if(msg.symbol_id === 'BINANCE_SPOT_BTC_USDT')
      // setData2(msg)
      // else
      // setData(msg)
      structureData[msg.symbol_id] = 'BINANCE_SPOT_BTC_USDT';
      structureData[msg.symbol_id] = msg;
      for (var i in structureData[msg.symbol_id]) {
        if (i.symbol_id === "BINANCE_SPOT_BTC_USDT") {
          setDataMarket1(i);
          console.log(true);
          console.log(dataMarket1);
        } else {
          setDataMarket2(i);
          console.log(false);
        }
      }
    }

    if (msg.type === "ohlcv") {
      structureData[msg.symbol_id] = {};
      structureData[msg.symbol_id]["ohlcv"] = {};
      structureData[msg.symbol_id]["ohlcv"] = msg;
      let tempData = structureData[msg.symbol_id]["ohlcv"];

      if (tempData.period_id === "1DAY") {
        setDayData(tempData);
      } else if (tempData.period_id === "1HRS") {
        setHourData(tempData);
      } else if (tempData.period_id === "12HRS") {
        setHourData12(hourData12);
      }
    }
  });

  useEffect(() => {
    socket.on("connect", () => {
      console.log(socket.id);
    });
  }, []);

  return (
    <div className="App">
      <h1 id="ID">aaaaa</h1>
      {JSON.stringify(Daydata)}
      <div>-------------------------------------</div>
      {JSON.stringify(hourData)}
      <div>-------------------------------------</div>
      {JSON.stringify(hourData12)}
      {JSON.stringify(dataMarket1)}
      <div>---------------------------------------</div>
      {JSON.stringify(dataMarket2)}
    </div>
  );
}

export default App;
