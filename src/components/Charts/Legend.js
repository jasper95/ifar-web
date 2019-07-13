import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-md/lib/Buttons/Button';

function Legend(props) {
  const {
    onClick, classification, value,
  } = props;
  return (
    <Button onClick={onClick} flat>
      <span>
        {classification}
      </span>
      <span>{value}</span>
    </Button>
  );
}

Legend.propTypes = {
  onClick: PropTypes.func,
  classification: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
};

Legend.defaultProps = {
  onClick: () => {},
};

export default Legend;
