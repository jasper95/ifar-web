import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-md/lib/Buttons/Button';

function Legend(props) {
  const {
    onClick, label, value, itemClassName
  } = props;

  // make label as key
  const labelKey = label.toLowerCase().replace(/ /g, '-');
  const uniqueItemClassName = `${itemClassName}-${labelKey}`;

  return (
    <Button
      flat
      onClick={onClick}
      className={`${itemClassName} ${uniqueItemClassName}`}
      iconBefore={false}
      children={label}
      iconEl={(
        <span className={itemClassName+'_badge'}>
          {value}
        </span>
      )}
    />
  );
}

Legend.propTypes = {
  onClick: PropTypes.func,
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
};

Legend.defaultProps = {
  onClick: () => {},
};

export default Legend;
