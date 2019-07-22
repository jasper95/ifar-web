import React, { useState } from 'react';
import Grid from 'react-md/lib/Grids/Grid';
import Cell from 'react-md/lib/Grids/Cell';
import DataTable from 'components/DataTable';
import Button from 'react-md/lib/Buttons/Button';
import MenuButton from 'react-md/lib/Menus/MenuButton';
import FakeButton from 'react-md/lib/Helpers/AccessibleFakeButton';
import IconSeparator from 'react-md/lib/Helpers/IconSeparator';
import FontIcon from 'react-md/lib/FontIcons/FontIcon';
import RiskMapComponent from 'components/RiskMap';
import gql from 'graphql-tag';
import useQuery from 'apollo/query';
import orderBy from 'lodash/orderBy';

const businessUnitsQuery = gql`
  query {
    business_unit(order_by: {order: asc}) {
      id
      name
    }
  }
`;

const riskQuery = gql`
  query getList($id: uuid!) {
    risk(where: {business_unit: {id: {_eq: $id }}}) {
      id
      impact
      likelihood
      name
    }
  }
`;

export default function RiskMap() {
  const [currentBusinessUnit, setBusinessUnit] = useState('871637c4-5510-4500-8e78-984fce5001ff');
  const [currentImpact, setImpact] = useState('management_action');
  const { data: { business_unit: businessUnits = [] } } = useQuery(businessUnitsQuery);
  let { data: { risk: riskItems = [] } } = useQuery(
    riskQuery, { variables: { id: currentBusinessUnit } },
  );
  const selected = businessUnits.find(e => e.id === currentBusinessUnit);
  riskItems = orderBy(
    riskItems.map(e => ({
      ...e,
      level: e.impact[currentImpact] * e.likelihood.rating,
    })), ['level'], ['desc'],
  );
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
            menuItems={businessUnits
              .map(e => ({ primaryText: e.name, onClick: () => setBusinessUnit(e.id) }))
            }
            simplifiedMenu={false}
            anchor={MenuButton.Positions.BELOW}
            repositionOnScroll={false}
          >
            <FakeButton
              component={IconSeparator}
              label={(
                <IconSeparator label={selected ? selected.name : ''}>
                  <FontIcon>arrow_drop_down</FontIcon>
                </IconSeparator>
            )}
            />
          </MenuButton>
          <DataTable
            rows={riskItems}
            columns={[
              {
                title: 'Level',
                type: 'function',
                fn: formatLevel,
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

  function formatLevel(row, index) {
    return (
      <>
        <span>{index + 1}</span>
        {' | '}
        <span>{row.level}</span>
      </>
    );
  }
}
