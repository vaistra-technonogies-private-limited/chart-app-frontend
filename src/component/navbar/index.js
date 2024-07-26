// import React from "react";
// import Dropdown from "../interval/IntervalDropdown";
// import IndicatorsDropdown from "../indicator";

// const Navbar = ({
//   intervalOptions,
//   indicatorOptions,
//   onIntervalSelect,
//   onIndicatorSelect,
// }) => {
//   return (
//     <nav className="navbar">
//       <h1>Vaistra Trade Analytics</h1>
//       <div className="dropdowns">
//         <Dropdown
//           options={intervalOptions}
//           onSelect={onIntervalSelect}
//           label="Interval"
//         />
//         <IndicatorsDropdown
//           options={indicatorOptions}
//           onSelect={onIndicatorSelect}
//           label="Indicators"
//         />
//       </div>
//     </nav>
//   );
// };

// export default Navbar;


import Dropdown from "../interval";
import IndicatorsDropdown from "../indicator";
import Modal from "../customModel/index";
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Navbar = ({
  intervalOptions,
  indicatorOptions,
  onIntervalSelect,
  onIndicatorSelect,
}) => {

  const [showModal, setShowModal] = useState(false);
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    if (showModal) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
  }, [showModal]);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:8081/StockProfile?pageNumber=0&pageSize=100');
      if (response.data.success) {
        const symbolNames = response.data.data.map(item => item.symbolName);
        setItems(symbolNames);
      } else {
        console.error('Error fetching symbols:', response.data);
        setError('Failed to fetch symbols');
      }
    } catch (error) {
      console.error('Error fetching symbols:', error);
      setError('Network Error: Could not fetch symbols');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <nav className="navbar">
      <h1>Vaistra Trade Analytics</h1>
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
        <button onClick={openModal} className="button">Open Modal</button>
        <Modal show={showModal} onClose={closeModal} items={items} />
      </div>
      {error && <div className="error">{error}</div>}
    </nav>
  );
};

export default Navbar;
