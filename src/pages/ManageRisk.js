import React, { useState } from 'react';
import Grid from 'react-md/lib/Grids/Grid';
import Cell from 'react-md/lib/Grids/Cell';
import Button from 'react-md/lib/Buttons/Button';
import RiskStats from 'components/Charts/RiskStats';
import RiskList from 'components/Risk/List';
import useBusinessUnit from 'components/Risk/useBusinessUnit';
import classificationLegend from 'lib/constants/riskManagement/classificationLegend';
import impactDriverLegend from 'lib/constants/riskManagement/impactDriverLegend';
import vulnerabilityLegend from 'lib/constants/riskManagement/vulnerabilityLegend';
import colorMapping from 'lib/constants/riskManagement/colorMapping';
import { useDispatch, useSelector } from 'react-redux';
import { chartQuery, notifCountQuery, requestCountQuery } from 'components/Risk/query';
import loadable from '@loadable/component';
import useQuery from 'apollo/query';
import 'rc-pagination/assets/index.css';
import 'sass/pages/manage-risk.scss';

import { ChartSkeleton } from 'components/Skeletons';

const RiskMap = loadable(() => import('pages/RiskMap'));

function ManageRisk(props) {
  const { path } = props.match;
  const riskType = path.replace(/\//g, '');
  const dispatch = useDispatch();
  const [riskMapVisible, setRiskMapVisible] = useState(false);
  const user = useSelector(state => state.auth);
  let userBusinessUnits = useBusinessUnit();
  const [defaultBusinessUnit = null] = userBusinessUnits;
  const [currentBusinessUnit, setBusinessUnit] = useState(
    defaultBusinessUnit ? defaultBusinessUnit.id : null,
  );
  const businessUnitWithOp = userBusinessUnits.find(e => e.id === currentBusinessUnit);
  const operations = businessUnitWithOp ? businessUnitWithOp.operations || [] : [];
  userBusinessUnits = userBusinessUnits.map(e => e.id);
  const [defaultOp = null] = operations;
  const [currentOp, setOp] = useState(defaultOp && riskType !== 'srmp' ? defaultOp.id : null);
  const [currentClassification, setCurrentClassification] = useState(null);
  const [currentImpactDriver, setCurrentImpactDriver] = useState(null);
  const [currentVulnerability, setCurrentVulnerability] = useState();
  const riskListResponse = useQuery(chartQuery,
    {
      ws: true,
      variables: { risk_type: riskType, id: currentBusinessUnit },
    });
  const requestNotifCountVars = { user_business_units: userBusinessUnits, user_id: user.id };
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
  if (riskMapVisible) {
    return (
      <RiskMap onBack={() => setRiskMapVisible(false)} />
    );
  }
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
            onClick={() => setRiskMapVisible(true)}
          />
        </Cell>
      </Grid>
      <Grid className="row-riskCharts">
        <Cell size={4}>
          {loading ? (
            <ChartSkeleton />
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
            <ChartSkeleton />
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
            <ChartSkeleton />
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
        businessUnit={currentBusinessUnit}
        classification={currentClassification}
        impactDriver={currentImpactDriver}
        residualVulnerability={currentVulnerability}
        riskType={riskType}
        operations={operations}
        operation={currentOp}
        onChange={handleChange}
      />
    </div>
  );

  function handleChange(val, key) {
    let func;
    switch (key) {
      case 'operation':
        func = setOp;
        break;
      case 'businessUnit':
        func = setBusinessUnit;
        break;
      case 'project':
        break;
      default:
    }
    if (func) {
      func(val);
    }
  }

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
