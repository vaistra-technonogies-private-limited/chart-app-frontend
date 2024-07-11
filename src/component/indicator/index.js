import React, { useState } from "react";

const IndicatorsDropdown = ({ options, onSelect }) => {
  const [selectedOption, setSelectedOption] = useState("CandleStick");

  const handleSelect = (event) => {
    const value = event.target.value;
    setSelectedOption(value);
    onSelect(value);
  };

  return (
    <div className="dropdown">
      <select value={selectedOption} onChange={handleSelect}>
        {/* <option value="" disabled>
          Select an option
        </option> */}
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default IndicatorsDropdown;
