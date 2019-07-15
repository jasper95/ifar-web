import React from 'react';
import TextFieldMessage from 'react-md/lib/TextFields/TextFieldMessage';
import DatePicker from 'react-datepicker';

function CustomDatePicker(props) {
  const {
    value, label, onChange, id, error, ...restProps
  } = props;
  return (
    <>
      {label && (
        <span>Date of Birth</span>
      )}
      <DatePicker
        // placeholderText="Select Date"
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

export default CustomDatePicker;
