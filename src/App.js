import "./App.css";
import React, { useState, useCallback, useEffect } from "react";
import ApexChart from "./ApexChart";
import Navbar from "./component/navbar";

function App() {
  const [interval, setInterval] = useState("1minute");
  const [indicators, setIndicators] = useState(["Candlestick"]);
  const [selectedSymbol, setSelectedSymbol] = useState({ symbolName: 'Nifty Bank', symbol: "NSE_INDEX%7CNifty Bank", market: '' });

  const [showModal, setShowModal] = useState(false);
  const [toDate, setToDate] = useState(new Date());
  const [fromDate, setFromDate] = useState(new Date());
  const [intervalOptions, setIntervalOptions] = useState(["1minute", "30minute"]);
  const indicatorOptions = [
    "Candlestick",
    "SMA",
    "Bollinger Upper Band",
    "Bollinger Lower Band",
    "Bollinger Middle Band",
    "24-hour volume",
  ];

  const handleChangeToDate = (date) => {
    setToDate(date);
  };

  const handleChangeFromDate = (date) => {
    setFromDate(date);
  };

  const updateIntervalOptions = useCallback(() => {
    const from = new Date(fromDate).getTime();
    const to = new Date(toDate).getTime();
    const differenceInDays = (to - from) / (1000 * 3600 * 24);

    if (differenceInDays <= 2) {
      setIntervalOptions(["1minute", "30minute"]);
    }
    else if (differenceInDays <= 7) {
      setIntervalOptions(["30minute", "day"]);
    } else {
      setIntervalOptions(["day", "week", "month"]);
    }
  }, [fromDate, toDate]);

  useEffect(() => {
    updateIntervalOptions();
  }, [fromDate, toDate, updateIntervalOptions]);

  const handleIntervalSelect = (selectedOption) => {
    console.log("Selected Interval:", selectedOption);
    setInterval(selectedOption);
  };

  const handleIndicatorSelect = useCallback((selectedOptions) => {
    console.log("Selected Indicators:", selectedOptions);
    setIndicators(selectedOptions);
  }, []);

  const handleItemSelect = (item) => {
    console.log("item selected", item)
    setSelectedSymbol(item);
    closeModal();
  };
  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="App">
      <div className="row">
        <div className="col-md-12 div-bgground">
          <Navbar
            intervalOptions={intervalOptions}
            indicatorOptions={indicatorOptions}
            onIntervalSelect={handleIntervalSelect}
            onIndicatorSelect={handleIndicatorSelect}
            onHandleItemSelect={handleItemSelect}
            openModal={openModal}
            closeModal={closeModal}
            showModal={showModal}
            selectedSymbol={selectedSymbol}
          />
          <div>
            <ApexChart interval={interval} indicators={indicators} selectedSymbol={selectedSymbol} handleChangeToDate={handleChangeToDate} handleChangeFromDate={handleChangeFromDate} toDate={toDate} fromDate={fromDate} />
          </div>
        </div>
        {/* <div className="col-md-2 div-bgground">
        </div> */}

      </div>


    </div>
  );
}

export default App;
