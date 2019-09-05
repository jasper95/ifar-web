import React, { useMemo, useState, useEffect } from 'react';
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
  const [currentValue, setCurrentValue] = useState(setInitialValue);
  useEffect(() => {
    if (value && !currentValue) {
      if (props.isMulti) {
        setCurrentValue(value.map(e => selectOptions.find(ee => ee.value === e)));
      } else {
        const newVal = selectOptions.find(e => e.value === value);
        setCurrentValue(newVal ? { ...newVal } : newVal);
      }
    }
  }, [value]);
  return (
    <div className={`selectAutoComplete ${className}`}>
      {label && (
        <span className="selectAutoComplete_label">
          {label}
          {' '}
          {required && '*'}
        </span>
      )}
      <Select
        id={id}
        value={currentValue}
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

  function setInitialValue() {
    if (props.isMulti) {
      return value.map(i => selectOptions.find(j => j.value === i));
    }
    return selectOptions.find(i => i.value === value);
  }

  function handleChange(newVal) {
    if (props.isMulti) {
      onChange(newVal.map(e => e.value), id);
      setCurrentValue(newVal ? [...newVal] : newVal);
    } else {
      onChange(newVal.value, id, newVal);
      setCurrentValue(newVal ? { ...newVal } : newVal);
    }
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
