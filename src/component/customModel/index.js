import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const Modal = ({ show, onClose, items }) => {
  const modalRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

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
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  const filteredItems = items.filter((item) =>
    item.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="modal-overlay">
      <div className="modal-content" ref={modalRef}>
        <div className="modal-header">
          <h4 className="modal-title">Symbol Search</h4>
          <FontAwesomeIcon icon={faTimes} className="close-icon" onClick={onClose} />
        </div>
        <hr></hr>
        <div className="modal-body">
          <input
            type="text"
            placeholder="Search"
            className="search-box"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <ul className="item-list">
            {filteredItems.map((item) => (
              <li
                key={item}
                className={`item ${item === selectedItem ? 'selected' : ''}`}
                onClick={() => handleItemClick(item)}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Modal;
