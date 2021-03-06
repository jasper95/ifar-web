import React, { useMemo } from 'react';
import Grid from 'react-md/lib/Grids/Grid';
import { formatDate } from 'components/DataTable/CellFormatter';
import PropTypes from 'prop-types';
import { getImpactDriver, getVulnerabilityLevel, getRecentChanges } from 'lib/tools';
import pick from 'lodash/pick';
import omit from 'lodash/omit';

import { useDispatch } from 'react-redux';
import RiskInfo from './Info';
import RiskTable from './Table';

function RiskDetails(props) {
  const dispatch = useDispatch();
  const {
    risk, className, readOnly, onMutateRisk, residualReadOnly, isRequest,
  } = props;
  const inherentData = useMemo(getInherentData, [risk]);
  return (
    <Grid className={`RiskDetails ${className}`}>
      <Grid className="RiskDetails_row RiskDetails_row-infos">
        <RiskInfo colspan={4} title="Causes" list={inherentData.causes} />
        <RiskInfo colspan={4} title="Impact" list={inherentData.impacts} />
        <RiskInfo colspan={4} title="Affected Stakeholders" list={inherentData.stakeholders} />
      </Grid>

      {!isRequest && (
        <>
          <RiskTable
            type="Residual"
            title="Current Risk Treatment"
            rows={risk.current_treatments}
            columns={getColumns('Residual')}
            onClickAdd={() => showDialog({ type: 'Residual', dialogTitle: 'Current Risk Treatment' })}
            readOnly={readOnly || residualReadOnly}
          />
          <RiskTable
            title="Future Risk Treatment"
            rows={risk.future_treatments}
            columns={getColumns('Target')}
            onClickAdd={() => showDialog({ type: 'Target', dialogTitle: 'Future Risk Treatment' })}
            readOnly={readOnly}
          />
        </>
      )}
    </Grid>
  );

  function getInherentData() {
    let { causes, impacts, stakeholders } = risk;
    if (isRequest) {
      const { recent_changes: recentChanges = {} } = risk;
      ({
        causes: causes = [],
        impacts: impacts = [], stakeholders: stakeholders = [],
      } = recentChanges);
      causes = causes.filter(e => e.action !== 'no_change');
      impacts = impacts.filter(e => e.action !== 'no_change');
      stakeholders = stakeholders.filter(e => e.action !== 'no_change');
    }
    return {
      stakeholders,
      causes,
      impacts,
    };
  }

  function showDoneDialog(row) {
    dispatch({
      type: 'SHOW_DIALOG',
      payload: {
        path: 'Confirm',
        props: {
          title: 'Confirm Done Treatment',
          message: 'Do you want to mark this as done?',
          onValid: (data) => {
            const newRisk = {
              ...risk,
              current_treatments: [
                ...risk.current_treatments,
                { ...data, rerate: true },
              ],
              future_treatments: risk.future_treatments.filter(e => e.id !== data.id),
            };
            onMutateRisk({
              data: {
                ...newRisk,
                recent_changes: {
                  ...risk.recent_changes,
                  current_treatments: [
                    { ...data, action: 'transfer' },
                  ],
                  future_treatments: [
                    { ...data, action: 'done' },
                  ],
                },
                target_rating: newRisk.future_treatments.length > 0 ? newRisk.target_rating : 0,
              },
              treatment_details: data,
              action: 'DONE_TREATMENT',
            });
          },
          initialFields: row,
        },
      },
    });
  }

  function onRerate() {
    showDialog({ type: 'Residual', dialogTitle: 'Residual Risk Evaluation', isRerate: true });
  }

  function showDialog({ type, dialogTitle, isRerate = false }) {
    const key = type.toLowerCase();
    const { previous_details: previousDetails = {} } = risk;
    dispatch({
      type: 'SHOW_DIALOG',
      payload: {
        path: `${type}Risk`,
        props: {
          dialogClassName: 'i_dialog_container--lg',
          isRerate,
          title: dialogTitle,
          onValid: (data) => {
            const impactDriver = getImpactDriver(data.impact_details[key]);
            const rating = data.impact_details[key][impactDriver];
            const { tracked_diff: trackedDiff } = data;
            const recentChanges = getRecentChanges(trackedDiff, data, [key === 'residual' ? 'current_treatments' : 'future_treatments']);
            const newData = {
              ...data,
              recent_changes: recentChanges,
              [`${key}_vulnerability`]: getVulnerabilityLevel(data[`${key}_likelihood`] * rating),
              [`${key}_impact_driver`]: impactDriver,
              [`${key}_rating`]: rating,
            };
            onMutateRisk({
              data: newData,
              action: `EDIT_${type.toUpperCase()}`,
            });
          },
          initialFields: {
            ...risk,
            current_stage_impact_details: risk.impact_details && risk.impact_details[key],
            tracked_diff: pick(risk, key === 'residual' ? 'current_treatments' : 'future_treatments'),
            previous_details: {
              basis: risk.basis,
              ...previousDetails,
              [key]: {
                rating: risk[`${key}_rating`],
                likelihood: risk[`${key}_likelihood`],
              },
            },
            ...isRerate && { current_treatments: risk.current_treatments.map(e => omit(e, 'rerate')) },
          },
        },
      },
    });
  }

  function onDelete(row, type) {
    const key = type.toLowerCase() === 'residual' ? 'current_treatments' : 'future_treatments';
    dispatch({
      type: 'SHOW_DIALOG',
      payload: {
        path: 'Confirm',
        props: {
          title: 'Confirm Delete',
          message: 'Do you want to delete this item?',
          onValid: () => {
            const { [key]: arr } = risk;
            const newArray = arr.filter(e => e.id !== row.id);
            const recentChanges = getRecentChanges(risk, { ...risk, [key]: newArray }, [key]);
            onMutateRisk({
              data: {
                ...risk,
                [key]: newArray,
                recent_changes: recentChanges,
              },
              action: `EDIT_${type.toUpperCase()}`,
            });
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
          accessor: 'business_unit',
          title: 'Team',
        },
        !readOnly
        && {
          type: 'actions',
          actions: [
            {
              icon: 'delete',
              label: 'Delete',
              onClick: row => onDelete(row, type),
              conditionalRendering: row => row.for_approval,
              type: 'component',
              component: () => (<>For Approval</>),
            },
            {
              icon: 'delete',
              label: 'Delete',
              onClick: row => onDelete(row, type),
              conditionalRendering: row => !row.for_approval,
            },
            {
              icon: 'rate_review',
              label: 'Rerate',
              onClick: onRerate,
              conditionalRendering: row => row.rerate,
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
          accessor: 'business_unit',
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
              onClick: row => onDelete(row, type),
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
  isRequest: PropTypes.bool,
};

RiskDetails.defaultProps = {
  readOnly: false,
  isRequest: false,
};

export default RiskDetails;
