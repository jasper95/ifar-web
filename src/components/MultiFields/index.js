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
  return (
    <div className="iFieldMultiversion">
      <h1 className="iFieldMultiversion_label">
        <span className="text">{label}</span>
        <span className="isReq">{required && '*'}</span>
      </h1>
      {/* {fieldLabels.length && (
        <div>
          {fieldLabels.map(e => (
            <div>
              {`${e.label} *`}
            </div>
          ))}
        </div>
      )} */}
      <div className="iFieldMultiversion_list">
        {value.map((e, idx) => (
          <div className="iFieldMultiversion_list_item">
            <Button
              icon
              className="iBttn iBttn-error iFieldMultiversion_list_item_remove"
              onClick={() => handleRemove(e.id)}
            >
              remove
            </Button>
            <div className="iFieldMultiversion_list_item_field">
              <Component
                id={id}
                index={idx}
                key={e.id}
                onChange={handleChange}
                value={e}
                {...restProps}
              />
            </div>
          </div>
        ))}
      </div>
      <Button
        flat
        onClick={handleAdd}
        iconChildren="add"
        className="iBttn iFieldMultiversion_add"
      >
        Add New
      </Button>
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
