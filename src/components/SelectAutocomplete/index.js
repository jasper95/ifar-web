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
    if (isNotEqualValue()) {
      if (props.isMulti) {
        setCurrentValue(value ? value.map(e => selectOptions.find(ee => ee.value === e)) : value);
      } else {
        setCurrentValue(selectOptions.find(e => e.value === value));
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

  function isNotEqualValue() {
    const result = (value && !currentValue) || (!value && currentValue);
    if (value && currentValue) {
      if (props.isMulti) {
        return value.join(',') !== currentValue.map(e => e.value).join(',');
      }
      return value !== currentValue.value;
    }
    return result;
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
