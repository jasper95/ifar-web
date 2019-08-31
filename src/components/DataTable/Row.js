import React from 'react';
import PropTypes from 'prop-types';
import TableColumn from 'react-md/lib/DataTables/TableColumn';
import Button from 'react-md/lib/Buttons/Button';
import get from 'lodash/get';

function Row(props) {
  const {
    type, row, accessor, bodyProps, actions,
    component: Cell, fn, index, componentProps,
  } = props;
  let children;
  if (type === 'actions') {
    children = actions.map(({
      label,
      className, icon, onClick, type: actionType, component: Action,
      conditionalRendering = () => true,
    }) => {
      if (!conditionalRendering(row)) {
        return null;
      }
      if (actionType === 'component') {
        return (
          <Action key={icon} row={row} label={label} icon={icon} onClick={onClick} />
        );
      }
      return (
        <Button
          icon
          children={icon}
          tooltipLabel={label}
          key={icon}
          className={className}
          onClick={(e) => {
            e.stopPropagation();
            onClick(row);
          }}
        />
      );
    });
  } else if (type === 'component') {
    children = (
      <Cell index={index} row={row} {...componentProps} />
    );
  } else if (type === 'function') {
    children = fn(row, index);
  } else {
    children = get(row, accessor);
  }
  return (
    <TableColumn {...bodyProps}>{children}</TableColumn>
  );
}

Row.propTypes = {
  bodyProps: PropTypes.object,
  type: PropTypes.oneOf(['actions', 'function', 'component']),
  actions: PropTypes.array,
  accessor: PropTypes.string,
  row: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
  component: PropTypes.func,
  fn: PropTypes.func,
  index: PropTypes.number.isRequired,
  componentProps: PropTypes.object,
};

Row.defaultProps = {
  bodyProps: {},
  type: 'value',
  actions: [],
  accessor: '',
  fn: () => null,
  component: () => null,
  componentProps: {},
};

export default Row;
