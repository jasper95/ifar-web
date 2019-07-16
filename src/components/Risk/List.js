import React from 'react';
import PropTypes from 'prop-types';
import FontIcon from 'react-md/lib/FontIcons/FontIcon';
import Grid from 'react-md/lib/Grids/Grid';
import Cell from 'react-md/lib/Grids/Cell';
import Button from 'react-md/lib/Buttons/Button';
import { useDispatch } from 'react-redux';
import businessUnits from 'lib/constants/riskManagement/businessUnits';
import { useCreateNode } from 'apollo/mutation';
import RiskItem from './Item';

function RiskList(props) {
  const { list } = props;
  const dispatch = useDispatch();
  const [, onCreate] = useCreateNode({ node: 'risk', callback: () => {} });
  return (
    <Grid>
      <Cell size={12}>
        <div>
          {businessUnits.map(e => (<Button key={e.id}>{e.name}</Button>))}
        </div>
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
          onValid: onCreate,
          initialFields: {
            likelihood: {
              basis: 'Frequency',
              rating: 1,
            },
            impact: {
              reputation: 1,
              financial: 1,
              legal_compliance: 1,
              operational: 1,
              health_safety_security: 1,
              management_action: 1,
            },
          },
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
