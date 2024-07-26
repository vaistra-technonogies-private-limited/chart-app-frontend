import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DatePickerComponent = ({ selectedDate, handleChange }) => {
  return (
    <DatePicker selected={selectedDate} onChange={handleChange} />
  );
};

export default DatePickerComponent;
