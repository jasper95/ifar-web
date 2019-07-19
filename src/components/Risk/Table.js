import React from 'react';
import Grid from 'react-md/lib/Grids/Grid';
import Button from 'react-md/lib/Buttons/Button';
import DataTable from 'components/DataTable';
import PropTypes from 'prop-types';


function RiskTable(props) {
  const {
    title, rows, columns, onClickAdd,
  } = props;
  return (
    <Grid className="RiskTable">
      <div className="RiskTable_header">
        <h3 className="RiskTable_header_title">
          {title}
        </h3>
        <div className="RiskTable_header_actions">
          <Button
            className="iBttn iBttn-primary"
            onClick={onClickAdd}
          >
            Add/Edit
          </Button>
        </div>
      </div>
      <DataTable
        rows={rows}
        columns={columns}
        className="RiskTable_table"
      />
    </Grid>
  );
}

RiskTable.propTypes = {
  title: PropTypes.string.isRequired,
  rows: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  onClickAdd: PropTypes.func.isRequired,
};
export default RiskTable;
