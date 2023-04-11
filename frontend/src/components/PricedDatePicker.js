import React, {useEffect, useRef, useState} from 'react';
import { DayPickerSingleDateController } from 'react-dates';
import moment from 'moment';

const PricedDatePicker = () => {
  const [selectedDate, setSelectedDate] = useState(moment());
  const [focused, setFocused] = useState(false);

  // Define your dates and prices
  const prices = {
    '2023-04-15': 50,
    '2023-04-18': 75,
    '2023-04-22': 100,
  };

  // Check if a date is pickable
  const isDatePickable = (date) => {
    return !!prices[date.format('YYYY-MM-DD')];
  };

  const renderDay = (day) => {
    const dateString = day.format('YYYY-MM-DD');
    const price = prices[dateString];

    return (
      <>
        {day.format('D')}
        {price && (
          <div style={{ fontSize: '12px', color: 'green' }}>{`$${price}`}</div>
        )}
        {!price && (
            <div style={{ fontSize: '12px', color: 'red' }}>{`-`}</div>
        )}
      </>
    );
  };

  return (
    <div className="datepicker-container">
      <input
        type="text"
        value={selectedDate ? selectedDate.format('YYYY-MM-DD') : ''}
        onClick={() => setFocused(!focused)}
        readOnly
        style={{ cursor: 'pointer' }}
      />
      {focused && (
        <DayPickerSingleDateController
          date={selectedDate}
          onDateChange={(date) => setSelectedDate(date)}
          focused={focused}
          onFocusChange={({ focused }) => setFocused(focused)}
          isOutsideRange={() => false}
          isDayBlocked={(date) => !isDatePickable(date)}
          numberOfMonths={1}
          renderDayContents={renderDay}
        />
      )}
    </div>
  );
};

export default PricedDatePicker;
