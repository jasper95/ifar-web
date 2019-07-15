import React from 'react';
import Grid from 'react-md/lib/Grids/Grid';
import Cell from 'react-md/lib/Grids/Cell';
import PropTypes from 'prop-types';
import RiskInfo from './RiskInfo';
import RiskTable from './RiskTable';

function RiskDetails(props) {
  const { risk } = props;
  return (
    <Grid>
      <RiskInfo colspan={4} title="Causes" list={risk.causes} />
      <RiskInfo colspan={4} title="Impact" list={risk.impacts} />
      <RiskInfo colspan={4} title="Affected Stakeholders" list={risk.stakeholders} />
      <Cell size={12}>
        <RiskTable
          riskType="Residual"
          title="Current Risk Treatment"
          rows={[risk.current_treatments]}
          columns={getColumns('residual')}
        />
      </Cell>
      <Cell size={12}>
        <RiskTable
          title="Future Risk Treatment"
          rows={risk.future_treatments}
          riskType="Target"
          columns={getColumns('target')}
        />
      </Cell>
    </Grid>
  );

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
          accessor: 'start_date',
          title: 'Start',
        },
        {
          accessor: 'end_date',
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
