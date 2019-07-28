import React, { useContext } from 'react';
import Grid from 'react-md/lib/Grids/Grid';
import { formatDate } from 'components/DataTable/CellFormatter';
import PropTypes from 'prop-types';
import { getImpactDriver } from 'lib/tools';
import { useDispatch } from 'react-redux';
import QueryContext from './Context';
import RiskInfo from './Info';
import RiskTable from './Table';

function RiskDetails(props) {
  const dispatch = useDispatch();
  const context = useContext(QueryContext);
  const { risk, className } = props;
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
      />

      <RiskTable
        title="Future Risk Treatment"
        rows={risk.future_treatments}
        columns={getColumns('Target')}
        onClickAdd={() => showDialog({ type: 'Target', dialogTitle: 'Future Risk Treatment' })}
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
          onValid: data => context.createRequest({
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
    dispatch({
      type: 'SHOW_DIALOG',
      payload: {
        path: `${type}Risk`,
        props: {
          title: dialogTitle,
          onValid: (data) => {
            const key = type.toLowerCase();
            const impactDriver = getImpactDriver(data.impact_details[key]);
            const { previous_details: previousDetails = {} } = data;
            context.updateRisk({
              data: {
                ...data,
                [`${key}_impact_driver`]: impactDriver,
                [`${key}_rating`]: data.impact_details[key][impactDriver],
                previous_details: {
                  ...previousDetails,
                  [key]: {
                    rating: risk[`${key}_rating`],
                    likelihood: risk[`${key}_likelihood`],
                  },
                },
              },
            });
          },
          initialFields: risk,
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
        {
          type: 'actions',
          actions: [
            {
              icon: 'delete',
              label: 'Delete',
              onClick: () => {},
            },
          ],
        },
      ],
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
        {
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
      ],
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
};

export default RiskDetails;
