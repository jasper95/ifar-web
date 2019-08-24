import React, { useState, useContext } from 'react';
import Grid from 'react-md/lib/Grids/Grid';
import Cell from 'react-md/lib/Grids/Cell';
import Button from 'react-md/lib/Buttons/Button';
import RiskStats from 'components/Charts/RiskStats';
import RiskList from 'components/Risk/List';
import AuthContext from 'apollo/AuthContext';
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

import { ChartSkeleton } from 'components/Skeletons';


const riskListQuery = gql`
  subscription getList($id: uuid!, $offset:Int , $limit: Int =10){
    risk(where: {business_unit: {id: {_eq: $id }}}){
      classification_id
      residual_impact_driver
      residual_rating
      residual_likelihood
      business_unit {
        name
        id
      }
    }
  }
`;

const notifCountQuery = gql`
  subscription getRequestNotifCount($user_id: jsonb, $business_unit_id: uuid) {
    notification_aggregate(where: {receivers: {_contains: $user_id }, business_unit_id: { _eq: $business_unit_id }}) {
      aggregate {
        count
      }
    }
  }
`;

const requestCountQuery = gql`
  subscription getRequestNotifCount($user_id: jsonb, $business_unit_id: uuid) {
    request_aggregate(where: {business_unit_id: { _eq: $business_unit_id }}) {
      aggregate {
        count
      }
    }
  }
`;
function ManageRisk() {
  const dispatch = useDispatch();
  const { data: user } = useContext(AuthContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentBusinessUnit, setBusinessUnit] = useState('871637c4-5510-4500-8e78-984fce5001ff');
  const [currentClassification, setCurrentClassification] = useState(null);
  const [currentImpactDriver, setCurrentImpactDriver] = useState(null);
  const [currentVulnerability, setCurrentVulnerability] = useState();
  const riskListResponse = useQuery(riskListQuery,
    { ws: true, variables: { id: currentBusinessUnit, offset: currentPage - 1 } });
  const requestNotifCountVars = {
    ...user && !['ADMIN'].includes(user.role) && { business_unit_id: currentBusinessUnit, user_id: user.id },
  };
  const notifCount = useQuery(
    notifCountQuery,
    {
      ws: true,
      variables: requestNotifCountVars,
    },
  );
  const requestCount = useQuery(
    requestCountQuery,
    {
      ws: true,
      variables: requestNotifCountVars,
    },
  );
  const { data: { risk: dashboardData = [] }, loading } = riskListResponse;
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
                {!notifCount.loading && notifCount.data.notification_aggregate.aggregate.count}
              </span>
            )}
            onClick={() => showDialog({
              type: 'Notifications',
              dialogTitle: 'Notifications',
              dialogSize: 'sm',
            })}
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
                {!requestCount.loading && requestCount.data.request_aggregate.aggregate.count}
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
          {loading ? (
            <ChartSkeleton/>
          ) : (
            <RiskStats
              filterFunc={classificationFilter}
              legend={classificationLegend}
              data={dashboardData}
              title="Classification"
              colorMapper={e => colorMapping.classification[e.classification]}
              selected={currentClassification}
              onChangeSelected={newVal => setCurrentClassification(prev => (prev !== newVal ? newVal : null))}
              filterKey="classification"
            />
          )}
        </Cell>
        <Cell size={4}>
          {loading ? (
            <ChartSkeleton/>
          ) : (
            <RiskStats
              filterFunc={impactDriverFilter}
              legend={impactDriverLegend}
              data={dashboardData}
              title="Impact Drivers"
              colorMapper={e => colorMapping.impact[e.impact]}
              selected={currentImpactDriver}
              onChangeSelected={newVal => setCurrentImpactDriver(prev => (prev !== newVal ? newVal : null))}
              filterKey="impact"
            />
          )}
        </Cell>
        <Cell size={4}>
          {loading ? (
            <ChartSkeleton/>
          ) : (
            <RiskStats
              filterFunc={vulnerabilityFilter}
              legend={vulnerabilityLegend}
              data={dashboardData}
              title="Residual Vulnerability"
              colorMapper={e => colorMapping.vulnerability[e.level]}
              selected={currentVulnerability}
              onChangeSelected={newVal => setCurrentVulnerability(prev => (prev !== newVal ? newVal : null))}
              filterKey="level"
            />
          )}
        </Cell>
      </Grid>
      <RiskList
        riskListResponse={riskListResponse}
        page={currentPage}
        businessUnit={currentBusinessUnit}
        onChangePage={setCurrentPage}
        onChangeBusinessUnit={setBusinessUnit}
        classification={currentClassification}
        impactDriver={currentImpactDriver}
        residualVulnerability={currentVulnerability}
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
    dispatch({
      type: 'SHOW_DIALOG',
      payload: {
        path: type,
        props: {
          title: dialogTitle,
          onValid: () => {},
          dialogClassName: `i_dialog_container--${dialogSize}`,
          requestNotifCountVars,
        },
      },
    });
  }
}

export default ManageRisk;
