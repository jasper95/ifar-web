import React from 'react';
import Grid from 'react-md/lib/Grids/Grid';
import { formatDate } from 'components/DataTable/CellFormatter';
import PropTypes from 'prop-types';
import { getImpactDriver, getVulnerabilityLevel } from 'lib/tools';
import { useDispatch } from 'react-redux';
import RiskInfo from './Info';
import RiskTable from './Table';

function RiskDetails(props) {
  const dispatch = useDispatch();
  const {
    risk, className, readOnly, onCreateRequest, onUpdateRisk,
  } = props;
  return (
    <Grid className={`RiskDetails ${className}`}>
      <Grid className="RiskDetails_row RiskDetails_row-infos">
        <RiskInfo colspan={4} title="Causes" list={risk.causes} />
        <RiskInfo colspan={4} title="Impact" list={risk.impacts} />
        <RiskInfo colspan={4} title="Affected Stakeholders" list={risk.stakeholders} />
      </Grid>

      <RiskTable
        type="Residual"
        title="Current Risk Treatment"
        rows={risk.current_treatments}
        columns={getColumns('Residual')}
        onClickAdd={() => showDialog({ type: 'Residual', dialogTitle: 'Current Risk Treatment' })}
        readOnly={readOnly}
      />

      <RiskTable
        title="Future Risk Treatment"
        rows={risk.future_treatments}
        columns={getColumns('Target')}
        onClickAdd={() => showDialog({ type: 'Target', dialogTitle: 'Future Risk Treatment' })}
        readOnly={readOnly}
      />

    </Grid>
  );

  function showDoneDialog(row) {
    dispatch({
      type: 'SHOW_DIALOG',
      payload: {
        path: 'Confirm',
        props: {
          title: 'Request Done Treatment',
          message: 'Send request to done this treatment?',
          onValid: data => onCreateRequest({
            data: {
              risk_id: risk.id,
              treatment_details: data,
              type: 'DONE_TREATMENT',
            },
          }),
          initialFields: row,
        },
      },
    });
  }

  function showDialog({ type, dialogTitle }) {
    const key = type.toLowerCase();
    const { previous_details: previousDetails = {} } = risk;
    dispatch({
      type: 'SHOW_DIALOG',
      payload: {
        path: `${type}Risk`,
        props: {
          title: dialogTitle,
          onValid: (data) => {
            const impactDriver = getImpactDriver(data.impact_details[key]);
            const rating = data.impact_details[key][impactDriver];
            onUpdateRisk({
              data: {
                ...data,
                [`${key}_vulnerability`]: getVulnerabilityLevel(data[`${key}_likelihood`] * rating),
                [`${key}_impact_driver`]: impactDriver,
                [`${key}_rating`]: rating,
              },
            });
          },
          initialFields: {
            ...risk,
            current_stage_impact_details: risk.impact_details && risk.impact_details[key],
            previous_details: {
              ...previousDetails,
              [key]: {
                rating: risk[`${key}_rating`],
                likelihood: risk[`${key}_likelihood`],
              },
            },
          },
        },
      },
    });
  }

  function getColumns(type) {
    return {
      Residual: [
        {
          accessor: 'strategy',
          title: 'Strategy',
        },
        {
          accessor: 'treatment',
          title: 'Existing action',
        },
        {
          accessor: 'kpi',
          title: 'KPI',
        },
        {
          accessor: 'team',
          title: 'Team',
        },
        !readOnly
        && {
          type: 'actions',
          actions: [
            {
              icon: 'delete',
              label: 'Delete',
              onClick: () => {},
            },
          ],
        },
      ].filter(Boolean),
      Target: [
        {
          accessor: 'strategy',
          title: 'Strategy',
        },
        {
          accessor: 'treatment',
          title: 'Existing action',
        },
        {
          accessor: 'kpi',
          title: 'KPI',
        },
        {
          accessor: 'team',
          title: 'Team',
        },
        {
          type: 'function',
          fn: formatDate('start_date', 'MMMM DD, YYYY'),
          title: 'Start',
        },
        {
          type: 'function',
          fn: formatDate('end_date', 'MMMM DD, YYYY'),
          title: 'End',
        },
        !readOnly
        && {
          type: 'actions',
          actions: [
            {
              icon: 'delete',
              label: 'Delete',
              onClick: () => {},
            },
            {
              icon: 'check',
              label: 'Done',
              onClick: showDoneDialog,
            },
          ],
        },
      ].filter(Boolean),
    }[type] || [];
  }
}

RiskDetails.propTypes = {
  risk: PropTypes.shape({
    future_treatments: PropTypes.array.isRequired,
    current_treatments: PropTypes.array.isRequired,
    stakeholders: PropTypes.array.isRequired,
    impacts: PropTypes.array.isRequired,
    causes: PropTypes.array.isRequired,
  }).isRequired,
  readOnly: PropTypes.bool,
};

RiskDetails.defaultProps = {
  readOnly: false,
};

export default RiskDetails;
