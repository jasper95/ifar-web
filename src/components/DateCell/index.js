import React from 'react';
import PropTypes from 'prop-types';
import day from 'dayjs';

function DateCell({ row }) {
  const { start_date, end_date } = row;
  const format = 'MMM YYYY';
  return (
    <>
      {day(start_date).format(format)}
      {' '}
      -
      {end_date ? day(end_date).format(format) : 'Present' }
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
