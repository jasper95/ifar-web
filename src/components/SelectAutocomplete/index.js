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
    <div className={`selectAutoComplete ${className}`}>
      {label && (
        <span className='selectAutoComplete_label'>
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
        className="iField iField-rs"
        classNamePrefix="iField-rs"
        {...restProps}
      />
      <TextFieldMessage
        errorText={error}
        error={error}
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
