import React from 'react';
import Page from 'components/Layout/Page';
import Grid from 'react-md/lib/Grids/Grid';
import Cell from 'react-md/lib/Grids/Cell';
import Button from 'react-md/lib/Buttons/Button';
import RiskStats from 'components/Charts/RiskStats';
import RiskList from 'components/Risk/List';
import dashboardData from 'lib/mock/dashboardData';
import classificationLegend from 'lib/mock/classificationLegend';

import 'sass/pages/manage-risk.scss';

function ManageRisk(props) {
  return (
    <Page 
      pageTitle='Manage Risk'
      pageId='manage-risk'
      isDashboard
    >
      <Grid className='row-ToolbarHeader'>
        <Cell offset={6} size={6} className='col-actions'>
          <Button
            flat
            className='iBttn iBttn-primary iBttn-counterBadge'
            iconBefore={false}
            children='Notifications'
            iconEl={(
              <span className='iBttn_badge'>
                0
              </span>
            )}
          />
          <Button
            flat
            className='iBttn iBttn-primary iBttn-counterBadge'
            iconBefore={false}
            children='View All Requests'
            iconEl={(
              <span className='iBttn_badge'>
                0
              </span>
            )}
          />
          <Button
            flat
            className='iBttn iBttn-primary iBttn-counterBadge'
            iconBefore={false}
            children='View Strategic Map'
            iconEl={(
              <span className='iBttn_badge'>
                0
              </span>
            )}
          />
        </Cell>
      </Grid>
      <Grid className='row-riskCharts'>
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
