import React from 'react';
import Grid from 'react-md/lib/Grids/Grid';
import Cell from 'react-md/lib/Grids/Cell';
import DataTable from 'components/DataTable';
import Button from 'react-md/lib/Buttons/Button';
import MenuButton from 'react-md/lib/Menus/MenuButton';
import FakeButton from 'react-md/lib/Helpers/AccessibleFakeButton';
import IconSeparator from 'react-md/lib/Helpers/IconSeparator';
import FontIcon from 'react-md/lib/FontIcons/FontIcon';
import businessUnits from 'lib/constants/riskManagement/businessUnits';

import RiskMapComponent from 'components/RiskMap';

export default function RiskMap() {
  return (
    <div className="dbContainer">
      <Grid>
        <Cell size={9}>
          <RiskMapComponent />
        </Cell>
        <Cell size={3}>
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
    </div>
  );
}
