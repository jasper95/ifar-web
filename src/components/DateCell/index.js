import React from 'react';
import PropTypes from 'prop-types';
import day from 'dayjs';

function DateCell({ row }) {
  const { start_date: startDate, end_date: endDate } = row;
  const format = 'MMM YYYY';
  return (
    <>
      {day(startDate).format(format)}
      {' '}
      -
      {endDate ? day(endDate).format(format) : 'Present' }
    </>
  );
}

DateCell.propTypes = {
  row: PropTypes.shape({
    start_date: PropTypes.string,
    end_date: PropTypes.string,
  }).isRequired,
};

export default DateCell;
