import React from 'react';
import Grid from 'react-md/lib/Grids/Grid';
import Cell from 'react-md/lib/Grids/Cell';
import Button from 'react-md/lib/Buttons/Button';
import DataTable from 'components/DataTable';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

function RiskTable(props) {
  const dispatch = useDispatch();
  const {
    title, rows, columns, riskType,
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
            onClick={showDialog}>
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

  function showDialog() {
    dispatch({
      type: 'SHOW_DIALOG',
      payload: {
        path: `${riskType}Risk`,
        props: {
          title,
        },
      },
    });
  }
}

RiskTable.propTypes = {
  title: PropTypes.string.isRequired,
  rows: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  riskType: PropTypes.string.isRequired,
};
export default RiskTable;
