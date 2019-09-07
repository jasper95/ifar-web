import React from 'react';
import Grid from 'react-md/lib/Grids/Grid';
import DataTable from 'components/DataTable';
import withDialog from 'lib/hocs/dialog';
import flowRight from 'lodash/flowRight';
import RiskInfo from 'components/Risk/Info';
import VulnerabilityChange from 'components/RiskMap/VulnerabilityChange';

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
    <div className="riskChangesForm">
      <div className="riskChangesForm_header">
        <h1 className="title">
          <span className="label">Risk Name</span>
          <span className="text">
            {risk.name}
          </span>
        </h1>
      </div>

      <div className="riskChangesForm_segment">
        <div className="riskChangesForm_segment_head">
          <h1 className="title"> Key Changes </h1>
        </div>
        <Grid className="riskChangesForm_segment_body">
          <RiskInfo colspan={4} title="Causes" list={causes} />
          <RiskInfo colspan={4} title="Impact" list={impacts} />
          <RiskInfo colspan={4} title="Stakeholders" list={stakeholders} />
          <RiskInfo colspan={4} title="Current Treatment" list={currrentTreatments.map(e => ({ id: e.id, name: e.treatment, action: e.action }))} />
          <RiskInfo colspan={4} title="Future Treatment" list={futureTreatments.map(e => ({ id: e.id, name: e.treatment, action: e.action }))} />
        </Grid>
      </div>

      <div className="riskChangesForm_segment">
        <div className="riskChangesForm_segment_head">
          <h1 className="title"> Previous Evaluation </h1>
        </div>
        <div className="riskChangesForm_segment_body">
          <DataTable rows={prevEvaluation} columns={getTableColumns('prev')} />
        </div>
      </div>

      <div className="riskChangesForm_segment">
        <div className="riskChangesForm_segment_head">
          <h1 className="title"> New Evaluation </h1>
        </div>
        <div className="riskChangesForm_segment_body">
          <DataTable rows={newEvaluation} className="tableRiskMap" columns={getTableColumns('new')} />
        </div>
      </div>
    </div>
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
        fn: displayOrBlank('likelihood', 'rating'),
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
        componentProps: { isDisableClick: true },
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

  function displayOrBlank(key, key2) {
    return row => (
      <span>
        {[key, key2]
          .filter(Boolean)
          .reduce((acc, el) => acc && Boolean(row[el]), true)
          ? row[key] : '-'
        }
      </span>
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
