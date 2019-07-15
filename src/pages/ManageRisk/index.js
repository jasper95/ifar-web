import React from 'react';
import Page from 'components/Layout/Page';
import Grid from 'react-md/lib/Grids/Grid';
import Cell from 'react-md/lib/Grids/Cell';
import Button from 'react-md/lib/Buttons/Button';
import RiskStats from 'components/Charts/RiskStats';
import RiskList from 'components/Risk/List';
import dashboardData from 'lib/mock/dashboardData';
import classificationLegend from 'lib/mock/classificationLegend';

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
        <Cell size={4}>
          <RiskStats
            filterFunc={classificationFilter}
            legend={classificationLegend}
            data={dashboardData}
            title="Impact Drivers"
          />
        </Cell>
        <Cell size={4}>
          <RiskStats
            filterFunc={classificationFilter}
            legend={classificationLegend}
            data={dashboardData}
            title="Residual Vurnerability"
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
