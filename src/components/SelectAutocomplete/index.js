import React, { useMemo } from 'react';
import Select from 'react-select';
import PropTypes from 'prop-types';
import TextFieldMessage from 'react-md/lib/TextFields/TextFieldMessage';

function SelectAutocomplete(props) {
  const {
    label, error, required, className, id, value, options, onChange,
    ...restProps
  } = props;
  const selectOptions = useMemo(() => {
    const [first] = options;
    if (['number', 'string'].includes(typeof first)) {
      return options.map(e => ({ label: e, value: e }));
    }
    return options;
  },
  [options]);
  return (
    <div className={className}>
      {label && (
        <span>
          {label}
          {' '}
          {required && '*'}
        </span>
      )}
      <Select
        id={id}
        value={selectOptions.find(e => e.value === value)}
        options={selectOptions}
        onChange={handleChange}
        {...restProps}
      />
      <TextFieldMessage
        errorText={error[id]}
        error={error[id]}
      />
    </div>
  );

  function handleChange(newVal) {
    onChange(newVal.value, id, newVal);
  }
}

SelectAutocomplete.defaultProps = {
  required: true,
  className: '',
  error: '',
};

SelectAutocomplete.propTypes = {
  id: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  label: PropTypes.string.isRequired,
  error: PropTypes.string,
  required: PropTypes.bool,
  className: PropTypes.string,
};

export default SelectAutocomplete;