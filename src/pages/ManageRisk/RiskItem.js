import React, { useState } from 'react';
import Grid from 'react-md/lib/Grids/Grid';
import Cell from 'react-md/lib/Grids/Cell';
import Button from 'react-md/lib/Buttons/Button';
import DataTable from 'components/DataTable';
import { useDispatch } from 'react-redux';

export default function RiskItem() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  return (
    <Grid>
      <Cell size={1}>
        <Button onClick={() => setIsCollapsed(!isCollapsed)} icon>{isCollapsed ? 'arrow_down' : 'arrow_right'}</Button>
      </Cell>
      <Cell size={11}>
        <RiskPreview />
        {!isCollapsed && <RiskDetails />}
      </Cell>
    </Grid>
  );
}

function RiskPreview(props) {
  return (
    <Grid>
      <Cell size={6}>
        <Grid>
          <Cell size={6}>
            <h3>Classification</h3>
            <span>Strategic</span>
          </Cell>
          <Cell size={6}>
            <h3>Risk name</h3>
            <span>Negative Public Perception</span>
          </Cell>
        </Grid>
      </Cell>
      <Cell size={6}>
        <Grid>
          <Cell size={3}>
            <h3>Inherent</h3>
            <span>20</span>
          </Cell>
          <Cell size={3}>
            <h3>Residual</h3>
            <span>9</span>
          </Cell>
          <Cell size={3}>
            <h3>Target</h3>
            <span>4</span>
          </Cell>
          <Cell size={3}>
            <Button icon>edit</Button>
            <Button icon>delete</Button>
          </Cell>
        </Grid>
      </Cell>
      <Cell size={12}>
        <h3>Definition</h3>
        <span>RAFI is subjected to negative communications from various sources</span>
      </Cell>
    </Grid>
  );
}

function RiskDetails(props) {
  const dispatch = useDispatch();
  return (
    <Grid>
      <Cell size={4}>
        <h3>Causes</h3>
        <ul>
          <li>Uncorroborated stories</li>
          <li>Journalist attitude</li>
          <li>Negative relationship with media</li>
          <li>Negative attitudes of Field Staff of RAFInians</li>
        </ul>
      </Cell>
      <Cell size={4}>
        <h3>Impact</h3>
        <ul>
          <li>Damage to reputation</li>
          <li>Loss of partners</li>
          <li>Opportunity losses</li>
        </ul>
      </Cell>
      <Cell size={4}>
        <h3>Affected Stakeholders</h3>
        <ul>
          <li>All</li>
        </ul>
      </Cell>
      <Cell size={12}>
        <Grid>
          <Cell size={10}>
            <h3>Current Risk Treatment</h3>
          </Cell>
          <Cell size={2}>
            <Button onClick={() => showDialog('Residual')}>Add/Edit</Button>
          </Cell>
          <hr />
          <Cell size={12}>
            <DataTable
              rows={[{
                id: 1,
                strategy: 'Reduce',
                action: 'Media Monitoring',
                kpi: '0 misinformation cases RAFI Apporoval rating of >90%',
                team: 'BD',
              }]}
              columns={[
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
              ]}
            />
          </Cell>
        </Grid>
      </Cell>
      <Cell size={12}>
        <Grid>
          <Cell size={10}>
            <h3>Future Risk Treatment</h3>
          </Cell>
          <Cell size={2}>
            <Button>Add/Edit</Button>
          </Cell>
          <hr />
          <Cell size={12}>
            <DataTable
              rows={[{
                id: 1,
                strategy: 'Reduce',
                action: 'Media Monitoring',
                kpi: '0 misinformation cases RAFI Apporoval rating of >90%',
                team: 'BD',
              }]}
              columns={[
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
              ]}
            />
          </Cell>
        </Grid>
      </Cell>
    </Grid>
  );

  function showDialog(type) {
    dispatch({
      type: 'SHOW_DIALOG',
      payload: {
        path: `${type}Risk`,
        props: {
          title: 'Residual Risk',
        },
      },
    });
  }
}
