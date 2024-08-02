// import "./App.css";
// import React, { useState } from "react";
// import ApexChart from "./ApexChart";
// // import Dropdown from "./component/IndicatorDropdown.";
// import Navbar from "./component/navbar";

// function App() {
//   const [interval, setInterval] = useState("1minute");
//   const [indicator, setIndicator] = useState("CandleStick");

//   // const options = ['1minute', '30minute', '1 day', '1 week', '1 month'];
//   const intervalOptions = ["1minute", "30minute"];
//   const indicatorOptions = [
//     "Candlestick",
//     "SMA",
//     "Bollinger Upper Band",
//     "Bollinger Lower Band",
//     "Bollinger Middle Band",
//   ];

//   // const handleSelect = (selectedOption) => {
//   //   console.log("Selected option:", selectedOption);
//   //   setInterval(selectedOption);
//   // };

//   const handleIntervalSelect = (selectedOption) => {
//     console.log("Selected interval:", selectedOption);
//     setInterval(selectedOption);
//   };

//   const handleIndicatorSelect = (selectedOption) => {
//     console.log("Selected indicator:", selectedOption);
//     setIndicator(selectedOption);
//   };

//   return (
//     <div className="App">
//       {/* <Dropdown options={options} onSelect={handleSelect} /> */}
//       <Navbar
//         intervalOptions={intervalOptions}
//         indicatorOptions={indicatorOptions}
//         onIntervalSelect={handleIntervalSelect}
//         onIndicatorSelect={handleIndicatorSelect}
//       />
//       <ApexChart interval={interval} indicator={indicator} />
//     </div>
//   );
// }

// export default App;

// import "./App.css";
// import React, { useState } from "react";
// import ApexChart from "./ApexChart";
// import Navbar from "./component/navbar";

// function App() {
//   const [interval, setInterval] = useState("1minute");
//   const [indicators, setIndicators] = useState(["Candlestick"]);

//   const intervalOptions = ["1minute", "30minute"];
//   const indicatorOptions = [
//     "Candlestick",
//     "SMA",
//     "Bollinger Upper Band",
//     "Bollinger Lower Band",
//     "Bollinger Middle Band",
//   ];

//   const handleIntervalSelect = (selectedOption) => {
//     console.log("Selected Interval:", selectedOption);
//     setInterval(selectedOption);
//   };

//   const handleIndicatorSelect = (selectedOptions) => {
//     console.log("Selected Indicators:", selectedOptions);
//     setIndicators(selectedOptions);
//   };

//   return (
//     <div className="App">
//       <Navbar
//         intervalOptions={intervalOptions}
//         indicatorOptions={indicatorOptions}
//         onIntervalSelect={handleIntervalSelect}
//         onIndicatorSelect={handleIndicatorSelect}
//       />
//       <ApexChart interval={interval} indicators={indicators} />
//     </div>
//   );
// }

// export default App;

import "./App.css";
import React, { useState, useCallback } from "react";
import ApexChart from "./ApexChart";
import Navbar from "./component/navbar";

function App() {
  const [interval, setInterval] = useState("1minute");
  const [indicators, setIndicators] = useState(["Candlestick"]);
  const [selectedSymbol, setSelectedSymbol] = useState({ symbolName: 'Nifty Bank', symbol: "NSE_INDEX%7CNifty Bank", market: '' });

  const [showModal, setShowModal] = useState(false);
  const intervalOptions = ["1minute", "30minute"];
  const indicatorOptions = [
    "Candlestick",
    "SMA",
    "Bollinger Upper Band",
    "Bollinger Lower Band",
    "Bollinger Middle Band",
  ];

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
      <ApexChart interval={interval} indicators={indicators} selectedSymbol={selectedSymbol}  />
    </div>
  );
}

export default App;
