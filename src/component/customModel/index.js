import React, { useEffect, useRef, useState, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import debounce from 'lodash.debounce';

const Modal = ({ show, onClose, items, setItems, onItemSelect }) => {
  const modalRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState({ symbolName: 'Nifty Bank', market: '' });

  const fetchSearchResults = async (keyword) => {
    const url = keyword
      ? `http://localhost:8081/StockProfile?keyword=${keyword}`
      : 'http://localhost:8081/StockProfile?pageNumber=0&pageSize=20';

    try {
      const response = await axios.get(url);
      if (response.data.success) {
        // const items = response.data.data.map((item) => ({
        //   symbolName: item.symbolName,
        //   market: item.market,
        // }));
        setItems(response.data.data);
      } else {
        console.error('Error fetching symbols:', response.data);
        setItems([]);
      }
    } catch (error) {
      console.error('Error fetching symbols:', error);
      setItems([]);
    }
  };

  const debouncedFetchSearchResults = useCallback(
    debounce((keyword) => {
      fetchSearchResults(keyword);
    }, 500),
    []
  );

  useEffect(() => {
    if (searchTerm.length >= 3) {
      setItems([]); // Clear the items before fetching new ones
      debouncedFetchSearchResults(searchTerm);
    } else if (searchTerm.length <= 3) {
      setItems([]); // Clear the items before fetching new ones
      debouncedFetchSearchResults(searchTerm);
    } else {
      fetchSearchResults('');
    }
  }, [searchTerm, debouncedFetchSearchResults]);

  useEffect(() => {
    const { current: modal } = modalRef;

    if (show) {
      const focusableElements = modal.querySelectorAll(
        'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex], [contenteditable]'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      const handleTabKey = (e) => {
        if (e.key === 'Tab') {
          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              e.preventDefault();
              lastElement.focus();
            }
          } else {
            if (document.activeElement === lastElement) {
              e.preventDefault();
              firstElement.focus();
            }
          }
        }
      };

      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };

      modal.addEventListener('keydown', handleTabKey);
      modal.addEventListener('keydown', handleKeyDown);
      firstElement.focus();

      return () => {
        modal.removeEventListener('keydown', handleTabKey);
        modal.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [show, onClose, modalRef]);

  if (!show) {
    return null;
  }

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    // setItems([]); // Clear items when search term changes
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
    onItemSelect(item);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" ref={modalRef}>
        <div className="modal-header">
          <h4 className="modal-title">Symbol Search</h4>
          <FontAwesomeIcon icon={faTimes} className="close-icon" onClick={onClose} />
        </div>
        <hr />
        <div className="modal-body">
          <input
            type="text"
            placeholder="Search"
            className="search-box"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <ul className="item-list">
            {items.map((item) => (
              <li
                key={item.symbolName}
                className={`item ${item.symbolName === selectedItem.symbolName ? 'selected' : ''}`}
                onClick={() => handleItemClick(item)}
              >
                {item.symbolName} - {item.market}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Modal;
