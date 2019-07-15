import React from 'react';
import PropTypes from 'prop-types';
import FontIcon from 'react-md/lib/FontIcons/FontIcon';
import Grid from 'react-md/lib/Grids/Grid';
import Cell from 'react-md/lib/Grids/Cell';
import Button from 'react-md/lib/Buttons/Button';
import { useDispatch } from 'react-redux';
import businessUnits from 'lib/constants/riskManagement/businessUnits';
import RiskItem from './RiskItem';


function RiskList(props) {
  const { list } = props;
  const dispatch = useDispatch();
  return (
    <Grid>
      <Cell size={12}>
        <ul>
          {businessUnits.map(e => (<li key={e.id}>{e.name}</li>))}
        </ul>
      </Cell>
      <Grid>
        <Cell size={3}>
          <span>Strategic Risk Management Plan</span>
          <FontIcon>keyboard_arrow_right</FontIcon>
          <span>RAFI</span>
        </Cell>
        <Cell size={2}>
          <Button flat onClick={showRiskDialog}>Add Risk</Button>
        </Cell>
      </Grid>
      {list && list.map(e => (
        <RiskItem key={e.id} risk={e} />
      ))}
    </Grid>
  );

  function showRiskDialog() {
    dispatch({
      payload: {
        path: 'InherentRisk',
        props: {
          dialogId: 'InherentRisk',
          title: 'Inherent Risk',
          onValid: () => {},
        },
      },
      type: 'SHOW_DIALOG',
    });
  }
}

RiskList.propTypes = {
  list: PropTypes.array.isRequired,
};

export default RiskList;
