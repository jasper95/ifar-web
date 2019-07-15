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
    <Grid>
      <Cell size={10}>
        <h3>{title}</h3>
      </Cell>
      <Cell size={2}>
        <Button onClick={showDialog}>Add/Edit</Button>
      </Cell>
      <hr />
      <Cell size={12}>
        <DataTable
          rows={rows}
          columns={columns}
        />
      </Cell>
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
