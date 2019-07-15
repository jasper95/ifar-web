import React from 'react';
import range from 'lodash/range';
import Grid from 'react-md/lib/Grids/Grid';
import Cell from 'react-md/lib/Grids/Cell';
import Page from 'components/Layout/Page';
import Paper from 'react-md/lib/Papers/Paper';
import DataTable from 'components/DataTable';
import Button from 'react-md/lib/Buttons/Button';
import MenuButton from 'react-md/lib/Menus/MenuButton';
import FakeButton from 'react-md/lib/Helpers/AccessibleFakeButton';
import IconSeparator from 'react-md/lib/Helpers/IconSeparator';
import FontIcon from 'react-md/lib/FontIcons/FontIcon';
import businessUnits from 'lib/constants/riskManagement/businessUnits';

export default function RiskMap(props) {
  return (
    <Page>
      <Grid>
        <Cell size={1}>
          <span>Legend</span>
        </Cell>
        <Cell size={9}>
          <Paper>
            <h2>Residual Risk Map</h2>
            <table>
              <tbody>
                {range(0, 7).map(rowMapper)}
              </tbody>
            </table>
          </Paper>
          <div>
            <Button>Management Action</Button>
            <Button>Finance</Button>
            <Button>Reputation</Button>
            <Button>Operations</Button>
            <Button>Health, Safety Environment</Button>
            <Button>Legal and Compliance</Button>
          </div>
        </Cell>
        <Cell size={2}>
          <Button>Strategic Risk Map</Button>
          <MenuButton
            adjusted={false}
            raised
            primary
            menuItems={businessUnits.map(e => ({ primaryText: e.name, onClick: () => {} }))}
            simplifiedMenu={false}
            anchor={MenuButton.Positions.BELOW}
            repositionOnScroll={false}
          >
            <FakeButton
              component={IconSeparator}
              label={(
                <IconSeparator label="RAFI">
                  <FontIcon>arrow_drop_down</FontIcon>
                </IconSeparator>
              )}
            />
          </MenuButton>
          <DataTable
            rows={[
              {
                level: 12,
                name: 'Travel Safety Risk',
                change_direction: 'New',
              },
            ]}
            columns={[
              {
                title: 'Level',
                accessor: 'level',
              },
              {
                title: 'Risk Name',
                accessor: 'name',
              },
            ]}
          />
        </Cell>
      </Grid>
    </Page>
  );

  function rowMapper(row) {
    return (
      <tr key={row}>
        {range(0, 6).map(e => columnMapper(e, row))}
      </tr>
    );
  }

  function columnMapper(column, row) {
    if (column === 0) {
      if (row === 5) {
        return (
          <td key={`${column}`}>Likelihood</td>
        );
      } if (row === 6) {
        return (<td key={column}>Impact</td>);
      }
      return (
        <td key={`${column}`}>{5 - row}</td>
      );
    } if (row === 6) {
      return null;
    } if (row === 5) {
      return (
        <td key={`${column}`} rowSpan="2">{column}</td>
      );
    }
    const value = (5 - row) * (column);
    return (
      <td key={`${column}`}>{value}</td>
    );
  }
}
