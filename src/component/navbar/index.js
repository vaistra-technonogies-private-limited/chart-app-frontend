import React from "react";
import Dropdown from "../interval/IntervalDropdown";
import IndicatorsDropdown from "../indicator";

const Navbar = ({
  intervalOptions,
  indicatorOptions,
  onIntervalSelect,
  onIndicatorSelect,
}) => {
  return (
    <nav className="navbar">
      <h1>Vaistra Trading Analytics</h1>
      <div className="dropdowns">
        <Dropdown
          options={intervalOptions}
          onSelect={onIntervalSelect}
          label="Interval"
        />
        <IndicatorsDropdown
          options={indicatorOptions}
          onSelect={onIndicatorSelect}
          label="Indicators"
        />
      </div>
    </nav>
  );
};

export default Navbar;
