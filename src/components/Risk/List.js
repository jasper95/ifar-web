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

import 'sass/components/risk/index.scss';

function RiskList(props) {
  const { list } = props;
  const dispatch = useDispatch();
  const [, onCreate] = useCreateNode({ node: 'risk', callback: () => {} });
  return (
    <Grid className="riskList">
      <div className="riskList_unitList">
        {businessUnits.map(e => (
          <Button
            flat
            className="riskList_unitList_item"
            iconBefore={false}
            children={e.name}
            iconEl={(
              <span className="riskList_unitList_item_badge">
                0
              </span>
            )}
          />
        ))}
      </div>

      <div className="riskList_risk">
        <div className="riskList_risk_header">
          <div className="crumb">
            <h1 className="crumb_main">
              <div className="text">
                Strategic Risk Management Plan
              </div>
            </h1>
            <h1 className="crumb_sub">
              <div className="text">
                RAFI
              </div>
            </h1>
          </div>
          <div className="actions">
            <Button
              flat
              className='actions_addRisk iBttn iBttn-teal'
              iconChildren="add_circle"
              onClick={showRiskDialog}
            >
              Add Risk
            </Button>
          </div>
        </div>
        <div className="riskList_risk_content">
          {list && list.map(e => (
            <RiskItem
              risk={e}
              key={e.id}
              className="riskList_risk_content_item"
            />
          ))}
        </div>
      </div>
    </Grid>
  );

  function showRiskDialog() {
    dispatch({
      payload: {
        path: 'InherentRisk',
        props: {
          dialogId: 'InherentRisk',
          title: 'Inherent Risk',
          onValid: data => onCreate({
            data: {
              ...data,
              business_unit_id: '871637c4-5510-4500-8e78-984fce5001ff',
              inherent_rating: 1,
            },
          }),
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
