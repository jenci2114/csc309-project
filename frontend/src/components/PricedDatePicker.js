import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';

const PricedDatePicker = ( {dateAndPrice, selectedDate, changeSelectedDate} ) => {
    const setSelectedDate = (date) => {
        changeSelectedDate(date);
    }

    var prices = {};
    for (var i = 0; i < dateAndPrice.length; i++) {
        prices[dateAndPrice[i].date] = dateAndPrice[i].price;
    }

    // Check if a date is pickable
    const isDatePickable = (date) => {
        return !!prices[date.format('YYYY-MM-DD')];
    };

    const renderDay = (date, currentDate) => {
        const dateString = moment(currentDate).format('YYYY-MM-DD');
        const price = prices[dateString];

        return (
            <>
                {date}
                {price && (
                    <div style={{ fontSize: '10px', color: 'green' }}>{`$${price}`}</div>
                )}
                {!price && (
                    <div style={{ fontSize: '10px', color: 'red' }}>{`--`}</div>
                )}
            </>
        );
    };

    return (
        <div className="datepicker-container">
            <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                filterDate={(date) => isDatePickable(moment(date))}
                renderCustomHeader={({
                                         date,
                                         decreaseMonth,
                                         increaseMonth,
                                         prevMonthButtonDisabled,
                                         nextMonthButtonDisabled,
                                     }) => (
                    <div>
                        <button
                            onClick={decreaseMonth}
                            disabled={prevMonthButtonDisabled}
                            className="prev-month-button"
                        >
                            {'<'}
                        </button>
                        <span>{moment(date).format('MMMM YYYY')}</span>
                        <button
                            onClick={increaseMonth}
                            disabled={nextMonthButtonDisabled}
                            className="next-month-button"
                        >
                            {'>'}
                        </button>
                    </div>
                )}
                dateFormat="yyyy-MM-dd"
                renderDayContents={renderDay}
            />
        </div>
    );
};

export default PricedDatePicker;
