import React from 'react';
import Grid from 'react-md/lib/Grids/Grid';
import Cell from 'react-md/lib/Grids/Cell';
import Button from 'react-md/lib/Buttons/Button';
import RiskStats from 'components/Charts/RiskStats';
import RiskList from 'components/Risk/List';
import classificationLegend from 'lib/mock/classificationLegend';
import impactDriverLegend from 'lib/mock/impactDriverLegend';
import vulnerabilityLegend from 'lib/mock/vulnerabilityLegend';
import history from 'lib/history';
import { useDispatch } from 'react-redux';
import 'sass/pages/manage-risk.scss';
import gql from 'graphql-tag';
import useQuery from 'apollo/query';

export const riskListQuery = gql`
  query getList($id: uuid!, $offset:Int , $limit: Int =5){
    risk(where: {business_unit: {id: {_eq: $id }}}, order_by: {name: asc}, offset: $offset, limit: $limit) @connection(key: "risk", filter: ["type"]) {
      causes
      classification {
        name
      }
      impact_details
      previous_details
      classification_id
      current_treatments
      definition
      future_treatments
      id
      impacts
      name
      stakeholders
      basis
      target_rating
      residual_rating
      inherent_rating
      target_likelihood
      residual_likelihood
      inherent_likelihood
      residual_impact_driver
      business_unit {
        name
        id
      }
    }
  }
`;

function ManageRisk() {
  const dispatch = useDispatch();
  const riskListResponse = useQuery(riskListQuery, { variables: { id: '871637c4-5510-4500-8e78-984fce5001ff', offset: 0 }, fetchPolicy: 'cache-and-network' });
  const { data: { risk: dashboardData = [] } } = riskListResponse;
  return (
    <div className="dbContainer">
      <Grid className="row-ToolbarHeader">
        <Cell offset={6} size={6} className="col-actions">
          <Button
            flat
            className="iBttn iBttn-primary iBttn-counterBadge"
            iconBefore={false}
            children="Notifications"
            iconEl={(
              <span className="iBttn_badge">
                0
              </span>
            )}
          />
          <Button
            flat
            className="iBttn iBttn-primary iBttn-counterBadge"
            iconBefore={false}
            children="View All Requests"
            onClick={() => showDialog({ type: 'Requests', dialogTitle: 'Requests' })}
            iconEl={(
              <span className="iBttn_badge">
                0
              </span>
            )}
          />
          <Button
            flat
            className="iBttn iBttn-primary iBttn-counterBadge"
            children="View Strategic Map"
            onClick={() => history.push('/risk-map')}
          />
        </Cell>
      </Grid>
      <Grid className="row-riskCharts">
        <Cell size={4}>
          <RiskStats
            filterFunc={classificationFilter}
            legend={classificationLegend}
            data={dashboardData}
            title="Classification"
          />
        </Cell>
        <Cell size={4}>
          <RiskStats
            filterFunc={impactDriverFilter}
            legend={impactDriverLegend}
            data={dashboardData}
            title="Impact Drivers"
          />
        </Cell>
        <Cell size={4}>
          <RiskStats
            filterFunc={vulnerabilityFilter}
            legend={vulnerabilityLegend}
            data={dashboardData}
            title="Residual Vurnerability"
          />
        </Cell>
      </Grid>
      <RiskList riskListResponse={riskListResponse} />
    </div>
  );

  function classificationFilter(data, legend) {
    return data.classification_id === legend.classification;
  }

  function impactDriverFilter(data, legend) {
    return data.residual_impact_driver === legend.impact;
  }

  function vulnerabilityFilter(data, legend) {
    const score = (data.residual_rating || 0) * data.residual_likelihood;
    return score >= legend.min && score <= legend.max;
  }

  function showDialog({ type, dialogTitle }) {
    if (type === 'Request') {
      dispatch({
        type: 'SHOW_DIALOG',
        payload: {
          path: type,
          props: {
            title: dialogTitle,
            onValid: () => {},
          },
        },
      });
    }
  }
}

export default ManageRisk;
