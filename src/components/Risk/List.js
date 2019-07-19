import React, { useState } from 'react';
import Grid from 'react-md/lib/Grids/Grid';
import Button from 'react-md/lib/Buttons/Button';
import { useDispatch } from 'react-redux';
import { useCreateNode } from 'apollo/mutation';
import useQuery from 'apollo/query';
import gql from 'graphql-tag';
import QueryContext from './Context';
import RiskItem from './Item';

import 'sass/components/risk/index.scss';

const riskListQuery = gql`
  query getList($id: uuid!){
    risk(where: {business_unit: {id: {_eq: $id }}}) {
      causes
      classification {
        name
      }
      current_treatments
      definition
      future_treatments
      id
      impact
      impacts
      inherent_rating
      likelihood
      name
      residual_rating
      stakeholders
      target_rating
      business_unit {
        name
        id
      }
    }
    business_unit {
      id
      name
      risks_aggregate {
        aggregate {
          count
        }
      }
    }
  }
`;


function RiskList() {
  const dispatch = useDispatch();
  const [, onCreate] = useCreateNode({ node: 'risk', callback: () => {} });
  const [currentBusinessUnit, setBusinessUnit] = useState('871637c4-5510-4500-8e78-984fce5001ff');
  const queryResponse = useQuery(riskListQuery, { variables: { id: currentBusinessUnit } });
  const { data: { risk: list, business_unit: businessUnits = [] } } = queryResponse;
  const selected = businessUnits.find(e => e.id === currentBusinessUnit);
  return (
    <QueryContext.Provider value={{ refetchRisk: queryResponse.refetch }}>
      <Grid className="riskList">
        <div className="riskList_unitList">
          {businessUnits && businessUnits.map(e => (
            <Button
              flat
              className="riskList_unitList_item"
              onClick={() => changeBusinessUnit(e.id)}
              iconBefore={false}
              children={e.name}
              key={e.id}
              iconEl={(
                <span className="riskList_unitList_item_badge">
                  {e.risks_aggregate.aggregate.count}
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
                  {selected && selected.name}
                </div>
              </h1>
            </div>
            <div className="actions">
              <Button
                flat
                className="actions_addRisk iBttn iBttn-teal"
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
    </QueryContext.Provider>
  );

  function changeBusinessUnit(id) {
    setBusinessUnit(id);
    queryResponse.refetch({ id });
  }

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
              business_unit_id: currentBusinessUnit,
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
          dialogClassName: 'i_dialog_container--sm',
        },
      },
      type: 'SHOW_DIALOG',
    });
  }
}


export default RiskList;
