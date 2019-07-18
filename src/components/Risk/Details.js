import React from 'react';
import Grid from 'react-md/lib/Grids/Grid';
import { formatDate } from 'components/DataTable/CellFormatter';
import PropTypes from 'prop-types';
import RiskInfo from './Info';
import RiskTable from './Table';

function RiskDetails(props) {
  const { risk, className } = props;
  return (
    <Grid className={`RiskDetails ${className}`}>
      <Grid className="RiskDetails_row RiskDetails_row-infos">
        <RiskInfo colspan={4} title="Causes" list={risk.causes} />
        <RiskInfo colspan={4} title="Impact" list={risk.impacts} />
        <RiskInfo colspan={4} title="Affected Stakeholders" list={risk.stakeholders} />
      </Grid>

      <RiskTable
        riskType="Residual"
        title="Current Risk Treatment"
        rows={risk.current_treatments}
        columns={getColumns('residual')}
        risk={risk}
        // onSave={onUpdateRisk}
      />

      <RiskTable
        title="Future Risk Treatment"
        rows={risk.future_treatments}
        riskType="Target"
        columns={getColumns('target')}
        risk={risk}
        // onSave={onUpdateRisk}
      />

    </Grid>
  );

  // function onUpdateRisk(data) {
  //   onUpdate({
  //     data: {
  //       ...data,
  //       id: risk.id,
  //     },
  //   });
  // }
  function getColumns(type) {
    return {
      residual: [
        {
          accessor: 'strategy',
          title: 'Strategy',
        },
        {
          accessor: 'action',
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
      target: [
        {
          accessor: 'strategy',
          title: 'Strategy',
        },
        {
          accessor: 'action',
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
