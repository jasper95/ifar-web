import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-md/lib/Buttons/Button';

function Legend(props) {
  const {
    onClick, label, value, itemClassName, colorClassname = '', parentKey,
  } = props;

  // make label as key
  const labelKey = label.toLowerCase().replace(/,/g, '').replace(/ /g, '-');
  const uniqueItemClassName = `${itemClassName}_${parentKey}-${labelKey}`;

  // console.log('LEGEND uniqueItemClassName === ', uniqueItemClassName)

  // console.log(`label = ${labelKey} && impact == ${(impact && impact.toLowerCase())}`)

  return (
    <Button
      flat
      onClick={onClick}
      className={`${itemClassName} ${uniqueItemClassName}`}
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
  onClick: PropTypes.func,
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  itemClassName: PropTypes.string.isRequired,
};

Legend.defaultProps = {
  onClick: () => {},
};

export default Legend;
