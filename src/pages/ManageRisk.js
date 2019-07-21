import React from 'react';
import Grid from 'react-md/lib/Grids/Grid';
import Cell from 'react-md/lib/Grids/Cell';
import Button from 'react-md/lib/Buttons/Button';
import RiskStats from 'components/Charts/RiskStats';
import RiskList from 'components/Risk/List';
import dashboardData from 'lib/mock/dashboardData';
import classificationLegend from 'lib/mock/classificationLegend';
import history from 'lib/history';
import { useDispatch } from 'react-redux';
import 'sass/pages/manage-risk.scss';

function ManageRisk(props) {
  const dispatch = useDispatch();
  return (
    <div className="dbContainer">
      <Grid className="row-ToolbarHeader">
        <Cell offset={6} size={6} className="col-actions">
          <Button
            flat
            className="iBttn iBttn-primary iBttn-counterBadge"
            iconBefore={false}
            children="Notifications"
            iconEl={(
              <span className="iBttn_badge">
                0
              </span>
            )}
          />
          <Button
            flat
            className="iBttn iBttn-primary iBttn-counterBadge"
            iconBefore={false}
            children="View All Requests"
            onClick={() => showDialog({ type: 'Requests', dialogTitle: 'Requests' })}
            iconEl={(
              <span className="iBttn_badge">
                0
              </span>
            )}
          />
          <Button
            flat
            className="iBttn iBttn-primary iBttn-counterBadge"
            children="View Strategic Map"
            onClick={() => history.push('/risk-map')}
          />
        </Cell>
      </Grid>
      <Grid className="row-riskCharts">
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
    </div>
  );

  function classificationFilter(data, legend) {
    return data.classification === legend.classification;
  }

  function showDialog({ type, dialogTitle }) {
    if (type === 'Request') {
      dispatch({
        type: 'SHOW_DIALOG',
        payload: {
          path: type,
          props: {
            title: dialogTitle,
            onValid: () => {},
          },
        },
      });
    }
  }
}

export default ManageRisk;
