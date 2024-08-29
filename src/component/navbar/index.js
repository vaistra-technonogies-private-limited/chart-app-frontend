import Dropdown from "../interval";
import IndicatorsDropdown from "../indicator";
import Modal from "../customModel/index";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const Navbar = ({
  intervalOptions,
  indicatorOptions,
  onIntervalSelect,
  onIndicatorSelect,
  onHandleItemSelect,
  closeModal,
  openModal,
  showModal,
  selectedSymbol
}) => {
  // const [showModal, setShowModal] = useState(false);
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  // const [selectedSymbol, setSelectedSymbol] = useState({ symbolName: 'Nifty Bank', market: '' });

  // const openModal = () => {
  //   setShowModal(true);
  // };

  // const closeModal = () => {
  //   setShowModal(false);
  // };

  useEffect(() => {
    if (showModal) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
  }, [showModal]);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:8081/StockProfile?pageNumber=0&pageSize=20');
      if (response.data.success) {
        // const items = response.data.data.map(item => ({
        //   symbolName: item.symbolName,
        //   market: item.market,
        // }));
        setItems(response.data.data);
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

  // const handleItemSelect = (item) => {
  //   console.log("item selected",item)
  //   setSelectedSymbol(item);
  //   closeModal();
  // };

  return (
    <div className="navbars">
      <div className="row">
        <div className="col-lg-2 col-sm-4 col align-content-center">
          <h1>Vaistra Trade Analytics</h1>
        </div>
        <div className="col-lg-8 col-sm-6 col align-content-center">
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
        </div>
        <div className="col-lg-2 col-sm-2 col align-content-center">
          <div className="dropdowns">
            <button onClick={openModal} className="button">
              <FontAwesomeIcon icon={faSearch} className="search-icon" /> {selectedSymbol.symbolName}
            </button>
            <Modal
              show={showModal}
              onClose={closeModal}
              items={items}
              setItems={setItems}
              onItemSelect={onHandleItemSelect}
            />
          </div>
        </div>
      </div>
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default Navbar;
