import React, { useState } from 'react';
import Grid from 'react-md/lib/Grids/Grid';
import Cell from 'react-md/lib/Grids/Cell';
import Button from 'react-md/lib/Buttons/Button';
import RiskStats from 'components/Charts/RiskStats';
import RiskList from 'components/Risk/List';
import classificationLegend from 'lib/constants/riskManagement/classificationLegend';
import impactDriverLegend from 'lib/constants/riskManagement/impactDriverLegend';
import vulnerabilityLegend from 'lib/constants/riskManagement/vulnerabilityLegend';
import colorMapping from 'lib/constants/riskManagement/colorMapping';
import history from 'lib/history';
import { useDispatch } from 'react-redux';
import gql from 'graphql-tag';
import useQuery from 'apollo/query';
import 'rc-pagination/assets/index.css';
import 'sass/pages/manage-risk.scss';

export const riskDetailsFragment = gql`
  fragment RiskDetails on risk {
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
  }
`;
export const riskListQuery = gql`
  subscription getList($id: uuid!, $offset:Int , $limit: Int =10){
    risk(where: {business_unit: {id: {_eq: $id }}}, order_by: {created_date: desc}, offset: $offset, limit: $limit) @connection(key: "risk", filter: ["type"]) {
      ...RiskDetails
      business_unit {
        name
        id
      }
    }
  }
  ${riskDetailsFragment}
`;

function ManageRisk() {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [currentBusinessUnit, setBusinessUnit] = useState('871637c4-5510-4500-8e78-984fce5001ff');
  const riskListResponse = useQuery(riskListQuery,
    { ws: true, variables: { id: currentBusinessUnit, offset: currentPage - 1 } });
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
            onClick={() => showDialog({
              type: 'Requests',
              dialogTitle: 'Requests',
              dialogSize: 'lg',
            })}
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
            colorMapper={e => colorMapping.classification[e.classification]}
          />
        </Cell>
        <Cell size={4}>
          <RiskStats
            filterFunc={impactDriverFilter}
            legend={impactDriverLegend}
            data={dashboardData}
            title="Impact Drivers"
            colorMapper={e => colorMapping.impact[e.impact]}
          />
        </Cell>
        <Cell size={4}>
          <RiskStats
            filterFunc={vulnerabilityFilter}
            legend={vulnerabilityLegend}
            data={dashboardData}
            title="Residual Vulnerability"
            colorMapper={e => colorMapping.vulnerability[e.label.toLowerCase()]}
          />
        </Cell>
      </Grid>
      <RiskList
        riskListResponse={riskListResponse}
        page={currentPage}
        businessUnit={currentBusinessUnit}
        onChangePage={setCurrentPage}
        onChangeBusinessUnit={setBusinessUnit}
      />
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

  function showDialog({ type, dialogTitle, dialogSize = 'md' }) {
    if (type === 'Requests') {
      dispatch({
        type: 'SHOW_DIALOG',
        payload: {
          path: type,
          props: {
            title: dialogTitle,
            onValid: () => {},
            dialogClassName: `i_dialog_container--${dialogSize}`,
          },
        },
      });
    }
  }
}

export default ManageRisk;
