import React from 'react';
import PropTypes from 'prop-types';
import Table from 'react-md/lib/DataTables/DataTable';
import TableBody from 'react-md/lib/DataTables/TableBody';
import TableRow from 'react-md/lib/DataTables/TableRow';
import TableColumn from 'react-md/lib/DataTables/TableColumn';
import TableHead from 'react-md/lib/DataTables/TableHeader';
import cn from 'classnames';
import Row from './Row';

function DataTable(props) {
  const {
    rows, columns, onRowClick, className, isSelectable, selected, onRowToggle,
    onSort, sort,
  } = props;
  return (
    <Table
      plain={!isSelectable}
      className={cn(`iTable ${className}`, {
        'iTable-empty': rows.length === 0,
      })}
      onRowToggle={onRowToggle}
    >
      <TableHead>
        <TableRow>
          {columns.map(({ title, accessor, headProps = {} }, idx) => (
            <TableColumn
              key={idx}
              onClick={() => onSort(accessor)}
              sorted={sort[accessor]}
              {...headProps}
            >
              {title}

            </TableColumn>
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
            selected={selected.includes(row.id)}
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
  className: PropTypes.string,
  rows: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  onRowClick: PropTypes.func,
  selected: PropTypes.array,
  isSelectable: PropTypes.bool,
  onRowToggle: PropTypes.func,
  onSort: PropTypes.func,
  sort: PropTypes.object,
};

DataTable.defaultProps = {
  className: '',
  onRowClick: () => {},
  onRowToggle: () => {},
  selected: [],
  isSelectable: false,
  onSort: () => {},
  sort: {},
};

export default DataTable;
