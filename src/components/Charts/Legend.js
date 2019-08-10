import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-md/lib/Buttons/Button';
import cn from 'classnames';

function Legend(props) {
  const {
    label, value, itemClassName,
    parentKey, selected, onChangeSelected,
    filterValue,
  } = props;
  // make label as key
  const labelKey = label.toLowerCase().replace(/,/g, '').replace(/ /g, '-');
  const uniqueItemClassName = `${itemClassName}_${parentKey}-${labelKey}`;

  return (
    <Button
      flat
      onClick={() => {
        onChangeSelected(filterValue);
      }}
      className={cn(`${itemClassName} ${uniqueItemClassName}`, { active: selected === filterValue })}
      iconBefore={false}
      iconEl={(
        <span className={`${itemClassName}_badge`}>
          {value}
        </span>
      )}
    >
      {label}
    </Button>
  );
}

Legend.propTypes = {
  onChangeSelected: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  itemClassName: PropTypes.string.isRequired,
};

Legend.defaultProps = {
  onClick: () => {},
};

export default Legend;
