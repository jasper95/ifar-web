import React from 'react';
import PropTypes from 'prop-types';
import TextFieldMessage from 'react-md/lib/TextFields/TextFieldMessage';
import DatePicker from 'react-datepicker';

function CustomDatePicker(props) {
  const {
    value, label, onChange, id, error, ...restProps
  } = props;
  return (
    <>
      {label && (
        <span>{label}</span>
      )}
      <DatePicker
        selected={value ? new Date(value) : null}
        onChange={newVal => onChange(newVal.toISOString(), id)}
        {...restProps}
      />
      <TextFieldMessage
        errorText={error}
        error={error}
      />
    </>
  );
}

CustomDatePicker.propTypes = {
  value: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  error: PropTypes.string,
};

CustomDatePicker.defaultProps = {
  error: '',
};


export default CustomDatePicker;
