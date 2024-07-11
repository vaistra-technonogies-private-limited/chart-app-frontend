import "./App.css";
import React, { useState } from "react";
import ApexChart from "./ApexChart";
// import Dropdown from "./component/IndicatorDropdown.";
import Navbar from "./component/navbar";

function App() {
  const [interval, setInterval] = useState("1minute");
  const [indicator, setIndicator] = useState("CandleStick");

  // const options = ['1minute', '30minute', '1 day', '1 week', '1 month'];
  const intervalOptions = ["1minute", "30minute"];
  const indicatorOptions = [
    "Candlestick",
    "SMA",
    "Bollinger Upper Band",
    "Bollinger Lower Band",
    "Bollinger Middle Band",
  ];

  // const handleSelect = (selectedOption) => {
  //   console.log("Selected option:", selectedOption);
  //   setInterval(selectedOption);
  // };

  const handleIntervalSelect = (selectedOption) => {
    console.log("Selected interval:", selectedOption);
    setInterval(selectedOption);
  };

  const handleIndicatorSelect = (selectedOption) => {
    console.log("Selected indicator:", selectedOption);
    setIndicator(selectedOption);
  };

  return (
    <div className="App">
      {/* <Dropdown options={options} onSelect={handleSelect} /> */}
      <Navbar
        intervalOptions={intervalOptions}
        indicatorOptions={indicatorOptions}
        onIntervalSelect={handleIntervalSelect}
        onIndicatorSelect={handleIndicatorSelect}
      />
      <ApexChart interval={interval} indicator={indicator} />
    </div>
  );
}

export default App;
