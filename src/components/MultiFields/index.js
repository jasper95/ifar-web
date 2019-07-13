import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from 'react-md/lib/Buttons/Button';
import uuid from 'uuid/v4';

function MultiFields(props) {
  const {
    fieldsRenderer: Component, value: valueProp, defaultItem,
    onChange, id, ...restProps
  } = props;
  const [value, setValue] = useState(valueProp);
  return (
    <div>
      {value.map(e => (
        <div>
          {value.length > 1 && <Button icon>remove</Button>}
          <Component key={e.id} onChange={handleChange} {...restProps} />
        </div>
      ))}
      <Button flat onChange={handleAdd}>Add New</Button>
    </div>
  );

  function handleAdd() {
    const newValue = [...value, { ...defaultItem, id: uuid() }];
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
};

MultiFields.defaultProps = {
  onChange: () => {},
  defaultItem: {},
};
