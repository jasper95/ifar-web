import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from 'react-md/lib/Buttons/Button';
import uuid from 'uuid/v4';

function MultiFields(props) {
  const {
    fieldsRenderer: Component, value: valueProp, defaultItem,
    onChange, id, label, required, fieldLabels, ...restProps
  } = props;
  const [value, setValue] = useState(valueProp);
  console.log('value: ', value);
  return (
    <div>
      <span>
        {label}
        {' '}
        {' '}
        {' '}
        {required && '*'}
      </span>
      <div>
        {fieldLabels.map(e => (
          <span>
            {e.label}
            {' '}
            {e.required && '*'}
          </span>
        ))}
      </div>
      <div>
        {value.map(e => (
          <div>
            {value.length > 1 && <Button onClick={() => handleRemove(e.id)} icon>remove</Button>}
            <Component key={e.id} onChange={handleChange} value={e} />
          </div>
        ))}
      </div>
      <Button flat onClick={handleAdd}>Add New</Button>
    </div>
  );

  function handleAdd() {
    const newValue = [...value, { ...defaultItem, id: uuid() }];
    setValue(newValue);
    onChange(newValue, id);
  }

  function handleRemove(elId) {
    const newValue = value.filter(e => e.id !== elId);
    setValue(newValue);
    onChange(newValue, id);
  }

  function handleChange(data) {
    const newValue = value.map(e => (e.id === data.id ? data : e));
    setValue(newValue);
    onChange(newValue, id);
  }
}

MultiFields.propTypes = {
  value: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
  })).isRequired,
  fieldsRenderer: PropTypes.func.isRequired,
  onChange: PropTypes.func,
  id: PropTypes.string.isRequired,
  defaultItem: PropTypes.object,
  fieldLabels: PropTypes.array,
  label: PropTypes.string.isRequired,
  required: PropTypes.bool,
};

MultiFields.defaultProps = {
  onChange: () => {},
  defaultItem: {},
  fieldLabels: [],
  required: true,
};

export default MultiFields;
