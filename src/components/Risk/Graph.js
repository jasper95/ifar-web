import React from 'react';
import Grid from 'react-md/lib/Grids/Grid';
import Cell from 'react-md/lib/Grids/Cell';
import classificationLegend from 'lib/constants/riskManagement/classificationLegend';
import impactDriverLegend from 'lib/constants/riskManagement/impactDriverLegend';
import vulnerabilityLegend from 'lib/constants/riskManagement/vulnerabilityLegend';
import colorMapping from 'lib/constants/riskManagement/colorMapping';
import RiskStats from 'components/Charts/RiskStats';
import { ChartSkeleton } from 'components/Skeletons';
import useQuery from 'apollo/query';
import upperFirst from 'lodash/upperFirst';
import { chartQuery } from 'components/Risk/query';
import { useSelector } from 'react-redux';

function RiskGraph(props) {
  const {
    filters,
    handlers,
    riskType,
  } = props;
  const {
    currentBusinessUnit, currentClassification, currentVulnerability,
    currentImpactDriver, currentProject, currentSubOperation, currentOp,
  } = filters;
  const user = useSelector(state => state.auth);
  const isCustomOperation = ['TEAM_LEADER', 'RISK_CHAMPION'].includes(user.ormp_role) || ['TEAM_LEADER', 'RISK_CHAMPION'].includes(user.prmp_role);
  const riskListResponse = useQuery(chartQuery, {
    ws: true,
    variables: {
      risk_type: riskType,
      business_unit_id: currentBusinessUnit,
      sub_operation_id: currentSubOperation,
      project_id: currentProject,
      ...isCustomOperation && { operation_id: currentOp },
    },
  });
  const { data: { risk_dashboard: dashboardData = [] }, loading } = riskListResponse;
  return (
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
            onChangeSelected={newVal => handleChangeFilter('classification', newVal)}
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
            onChangeSelected={newVal => handleChangeFilter('impactDriver', newVal)}
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
            onChangeSelected={newVal => handleChangeFilter('vulnerability', newVal)}
            filterKey="level"
          />
        )}
      </Cell>
    </Grid>
  );

  function classificationFilter(val, legend) {
    return val.classification_id === legend.classification;
  }

  function impactDriverFilter(val, legend) {
    return val.residual_impact_driver === legend.impact;
  }

  function vulnerabilityFilter(val, legend) {
    const score = (val.residual_rating || 0) * val.residual_likelihood;
    return score >= legend.min && score <= legend.max;
  }

  function handleChangeFilter(key, val) {
    const func = handlers[`setCurrent${upperFirst(key)}`];
    if (func) {
      func(prev => (prev !== val ? val : null));
    }
  }
}

export default RiskGraph;
