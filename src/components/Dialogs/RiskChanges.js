import React from 'react';
import Cell from 'react-md/lib/Grids/Cell';
import Grid from 'react-md/lib/Grids/Grid';
import DataTable from 'components/DataTable';
import withDialog from 'lib/hocs/dialog';
import flowRight from 'lodash/flowRight';
import RiskInfo from 'components/Risk/Info';
import { VulnerabilityChange } from 'pages/RiskMap';

function RiskChanges(props) {
  const { risk } = props;
  const { recent_changes: recentChanges = {} } = risk;
  const {
    causes = [],
    impacts = [],
    stakeholders = [],
    current_treatments: currrentTreatments = [],
    future_treatments: futureTreatments = [],
  } = recentChanges;
  const prevEvaluation = ['inherent', 'residual', 'target']
    .map(stage => ({
      stage,
      ...risk.previous_details && (risk.previous_details[stage] || {}),
    }))
    .map(mapVulnerability);
  const newEvaluation = ['inherent', 'residual', 'target']
    .map(stage => ({
      stage,
      likelihood: risk[`${stage}_likelihood`],
      rating: risk[`${stage}_rating`],
      prevDetails: risk.previous_details ? risk.previous_details[stage] : null,
    })).map(mapVulnerability);
  return (
    <Grid>
      <Cell size={2}>
        Risk Name
      </Cell>
      <Cell size={10}>
        {risk.name}
      </Cell>
      <Cell size={2}>
        Key Changes
      </Cell>
      <Cell size={10}>
        <Grid>
          <RiskInfo colspan={6} title="Causes" list={causes} />
          <RiskInfo colspan={6} title="Impact" list={impacts} />
          <RiskInfo colspan={6} title="Stakeholders" list={stakeholders} />
          <RiskInfo colspan={6} title="Current Treatment" list={currrentTreatments.map(e => ({ id: e.id, name: e.treatment }))} />
          <RiskInfo colspan={6} title="Current Treatment" list={futureTreatments.map(e => ({ id: e.id, name: e.treatment }))} />
        </Grid>
      </Cell>
      <Cell size={2}>Previous Evaluation</Cell>
      <Cell size={10}>
        <DataTable rows={prevEvaluation} columns={getTableColumns('prev')} />
      </Cell>
      <Cell size={2}>New Evaluation</Cell>
      <Cell size={10}>
        <DataTable rows={newEvaluation} className="tableRiskMap" columns={getTableColumns('new')} />
      </Cell>
    </Grid>
  );

  function getTableColumns(type) {
    return [
      {
        title: '',
        type: 'component',
        component: RiskStage,
        bodyProps: {
          className: 'tableRiskMap_risk-level',
        },
      },
      {
        title: 'Likelihood',
        type: 'function',
        fn: displayOrBlank('likelihood'),
      },
      {
        title: 'Impact',
        type: 'function',
        fn: displayOrBlank('rating'),
      },
      {
        title: 'Vulnerability',
        type: 'function',
        fn: displayOrBlank('vulnerability'),
      },
      type === 'new' && {
        type: 'component',
        component: VulnerabilityChange,
        title: 'Changes',
        bodyProps: {
          className: 'tableRiskMap_risk-vc',
        },
      },
    ].filter(Boolean);
  }

  function mapVulnerability(e) {
    const { likelihood, rating } = e;
    if (Number.isNaN(likelihood) || Number.isNaN(rating)) {
      return {
        ...e,
        vulnerability: null,
      };
    }
    return {
      ...e,
      vulnerability: rating * likelihood,
    };
  }

  function displayOrBlank(key) {
    return row => (
      <span>{row[key] || '-'}</span>
    );
  }
}

function RiskStage({ row }) {
  const { stage } = row;
  const className = {
    inherent: 'critical',
    residual: 'low',
    target: 'moderate',
  }[stage];
  return (
    <span
      className={`level level-${className}`}
    >
      {stage}
    </span>
  );
}

const Dialog = flowRight(
  withDialog(),
)(RiskChanges);

Dialog.defaultProps = {
  dialogActionsRenderer: () => null,
};
export default Dialog;
