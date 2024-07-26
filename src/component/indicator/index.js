// import React, { useState } from "react";

// const IndicatorsDropdown = ({ options, onSelect }) => {
//   const [selectedOption, setSelectedOption] = useState("CandleStick");

//   const handleSelect = (event) => {
//     const value = event.target.value;
//     setSelectedOption(value);
//     onSelect(value);
//   };

//   return (
//     <div className="dropdown">
//       <select value={selectedOption} onChange={handleSelect}>
//         {/* <option value="" disabled>
//           Select an option
//         </option> */}
//         {options.map((option, index) => (
//           <option key={index} value={option}>
//             {option}
//           </option>
//         ))}
//       </select>
//     </div>
//   );
// };

// export default IndicatorsDropdown;


// import React, { useState } from "react";
// import { MultiSelect } from "react-multi-select-component";

// const IndicatorsDropdown = ({ options, onSelect }) => {
//   const [selectedOptions, setSelectedOptions] = useState([]);

//   const handleSelect = (selected) => {
//     setSelectedOptions(selected);
//     onSelect(selected.map((option) => option.value));
//   };

//   const formattedOptions = options.map((option) => ({
//     label: option,
//     value: option,
//   }));

//   return (
//     <div className="multiselect_dropdown">
//       <MultiSelect className="select"
//         options={formattedOptions}
//         value={selectedOptions}
//         onChange={handleSelect}
      
//       />
//     </div>
//   );
// };

// export default IndicatorsDropdown;

import React, { useState, useEffect, useMemo } from "react";
import { MultiSelect } from "react-multi-select-component";

const IndicatorsDropdown = ({ options, onSelect }) => {
  const defaultIndicator = useMemo(() => [{ label: "Candlestick", value: "Candlestick" }], []);
  const [selectedOptions, setSelectedOptions] = useState(defaultIndicator);

  useEffect(() => {
    onSelect(defaultIndicator.map((option) => option.value));
  }, [onSelect, defaultIndicator]);

  const handleSelect = (selected) => {
    const candlestickOption = { label: "Candlestick", value: "Candlestick" };
    // Ensure "Candlestick" is always selected
    if (!selected.some(option => option.value === "Candlestick")) {
      selected = [...selected, candlestickOption];
    }
    setSelectedOptions(selected);
    onSelect(selected.map((option) => option.value));
  };

  const formattedOptions = options.map((option) => ({
    label: option,
    value: option,
  }));

  return (
    <div className="multiselect_dropdown">
      <MultiSelect
        className="select"
        options={formattedOptions}
        value={selectedOptions}
        onChange={handleSelect}
      />
    </div>
  );
};

export default IndicatorsDropdown;
