import React from 'react';
import Page from 'components/Layout/Page';
import Grid from 'react-md/lib/Grids/Grid';
import Cell from 'react-md/lib/Grids/Cell';
import Button from 'react-md/lib/Buttons/Button';
import RiskStats from 'components/Charts/RiskStats';
import RiskList from './RiskList';

const dashboardData = [
  {
    id: 1,
    classification: 'Strategic',
    name: 'Risk 1',
    business_unit_id: 1,
    definition: 'RAFI is subjected to negative communications from various sources',
    residual_rating: 1,
    inherent_rating: 1,
    target_rating: 1,
    causes: [
      {
        id: 1,
        name: 'Uncorroborated stories',
      },
      {
        id: 2,
        name: 'Journalist attitude',
      },
      {
        id: 3,
        name: 'Negative relationship with media',
      },
      {
        id: 4,
        name: 'Negative attitudes of Field Staff of RAFInians',
      },
    ],
    impacts: [
      {
        id: 1,
        name: 'Damage to reputation',
      },
      {
        id: 2,
        name: 'Loss of partners',
      },
      {
        id: 3,
        name: 'Opportunity losses',
      },
    ],
    stakeholders: [
      {
        id: 1,
        name: 'all',
      },
    ],
    current_treatments: [{
      id: 1,
      strategy: 'Reduce',
      action: 'Media Monitoring',
      kpi: '0 misinformation cases RAFI Apporoval rating of >90%',
      team: 'BD',
    }],
    future_treatments: [{
      id: 1,
      strategy: 'Reduce',
      action: 'Media Monitoring',
      kpi: '0 misinformation cases RAFI Apporoval rating of >90%',
      team: 'BD',
    }],
  },
  // {
  //   id: 1,
  //   classification: 'Operational',
  //   name: 'Risk 2',
  //   business_unit_id: 1,
  // },
  // {
  //   id: 1,
  //   classification: 'Financial',
  //   name: 'Risk 3',
  //   business_unit_id: 1,
  // },
  // {
  //   id: 1,
  //   classification: 'Legal and Compliance',
  //   name: 'Risk 4',
  //   business_unit_id: 1,
  // },
  // {
  //   id: 1,
  //   classification: 'Strategic',
  //   name: 'Risk 5',
  //   business_unit_id: 1,
  // },
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
      <RiskList list={dashboardData} />
    </Page>
  );

  function classificationFilter(data, legend) {
    return data.classification === legend.classification;
  }
}

export default ManageRisk;
