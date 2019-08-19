import React from 'react';
import PropTypes from 'prop-types';
import Table from 'react-md/lib/DataTables/DataTable';
import TableBody from 'react-md/lib/DataTables/TableBody';
import TableRow from 'react-md/lib/DataTables/TableRow';
import TableColumn from 'react-md/lib/DataTables/TableColumn';
import TableHead from 'react-md/lib/DataTables/TableHeader';
import Button from 'react-md/lib/Buttons/Button';
import get from 'lodash/get';
import cn from 'classnames';

function DataTable(props) {
  const {
    rows, columns, onRowClick, className,
  } = props;

  return (
    <Table
      plain
      className={cn(`iTable ${className}`, {
        'iTable-empty': rows.length === 0,
      })}
    >
      <TableHead>
        <TableRow>
          {columns.map(({ title, headProps = {} }, idx) => (
            <TableColumn key={idx} {...headProps}>{title}</TableColumn>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.length === 0 && (
          <div>No Records Found</div>
        )}
        {rows.map((row, rowIndex) => (
          <TableRow
            key={row.id}
            onClick={(e) => {
              e.stopPropagation();
              onRowClick(row);
            }}
          >
            {columns.map((column, idx) => (
              <Row index={rowIndex} key={idx} {...column} row={row} />
            ))
            }
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

DataTable.propTypes = {
  rows: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  onRowClick: PropTypes.func,
};

DataTable.defaultProps = {
  onRowClick: () => {},
};

export default DataTable;

function Row(props) {
  const {
    type, row, accessor, bodyProps = {}, actions = [],
    component: Cell, fn, index,
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
      <Cell index={index} row={row} />
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
};

Row.defaultProps = {
  bodyProps: {},
  type: 'value',
  actions: [],
  accessor: '',
  fn: () => null,
  component: () => null,
};
