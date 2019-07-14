import React from 'react';
import Page from 'components/Layout/Page';
import Grid from 'react-md/lib/Grids/Grid';
import Cell from 'react-md/lib/Grids/Cell';
import Button from 'react-md/lib/Buttons/Button';
import RiskStats from 'components/Charts/RiskStats';
import RiskList from './List';

const dashboardData = [
  {
    id: 1,
    classification: 'Strategic',
    name: 'Risk 1',
    business_unit_id: 1,
  },
  {
    id: 1,
    classification: 'Operational',
    name: 'Risk 2',
    business_unit_id: 1,
  },
  {
    id: 1,
    classification: 'Financial',
    name: 'Risk 3',
    business_unit_id: 1,
  },
  {
    id: 1,
    classification: 'Legal and Compliance',
    name: 'Risk 4',
    business_unit_id: 1,
  },
  {
    id: 1,
    classification: 'Strategic',
    name: 'Risk 5',
    business_unit_id: 1,
  },
];

const classificationLegend = [
  {
    color: 'blue',
    classification: 'Strategic',
    label: 'Strategic',
  },
  {
    color: 'red',
    classification: 'Operational',
    label: 'Operational',
  },
  {
    color: 'green',
    classification: 'Financial',
    label: 'Financial',
  },
  {
    color: 'orange',
    classification: 'Legal and Compliance',
    label: 'Legal and Compliance',
  },
];

function ManageRisk(props) {
  return (
    <Page>
      <Grid>
        <Cell offset={9} size={3}>
          <Button>
            Notifications
            {' '}
            <span>0</span>
          </Button>
          <Button>
            View All Requests
            {' '}
            <span>0</span>
          </Button>
          <Button>
            View Strategic Map
          </Button>
        </Cell>
      </Grid>
      <Grid>
        <Cell size={4}>
          <RiskStats
            filterFunc={classificationFilter}
            legend={classificationLegend}
            data={dashboardData}
            title="Classification"
          />
        </Cell>
      </Grid>
      <RiskList />
    </Page>
  );

  function classificationFilter(data, legend) {
    return data.classification === legend.classification;
  }
}

export default ManageRisk;