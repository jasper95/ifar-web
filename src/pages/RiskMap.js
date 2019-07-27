import React, { useState, useMemo } from 'react';
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
      name
      residual_likelihood
      residual_rating
      residual_impact_driver
      target_likelihood
      target_rating
      target_impact_driver
      inherent_likelihood
      inherent_rating
      inherent_impact_driver
      causes
      impacts
    }
  }
`;

export default function RiskMap() {
  const [currentBusinessUnit, setBusinessUnit] = useState('871637c4-5510-4500-8e78-984fce5001ff');
  const [currentImpact, setImpact] = useState('');
  const [currentStage, setStage] = useState('residual');
  const { data: { business_unit: businessUnits = [] } } = useQuery(businessUnitsQuery);
  let { data: { risk: riskItems = [] } } = useQuery(
    riskQuery, { variables: { id: currentBusinessUnit } },
  );
  const selected = businessUnits.find(e => e.id === currentBusinessUnit);
  riskItems = useMemo(() => orderBy(
    riskItems
      .map(e => ({
        ...e,
        impact_driver: e[`${currentStage}_impact_driver`],
        likelihood: e[`${currentStage}_likelihood`],
        rating: e[`${currentStage}_rating`],
        vulnerability: (e[`${currentStage}_rating`] || 0) * e[`${currentStage}_likelihood`],
      }))
      .filter(e => (currentImpact ? e.impact_driver === currentImpact : true)),
    ['vulnerability'], ['desc'],
  ).map((e, idx) => ({ ...e, order: idx + 1 })),
  [currentStage, riskItems, currentImpact]);
  return (
    <div className="dbContainer">
      <Grid>
        <Cell size={9}>
          <RiskMapComponent
            risks={riskItems}
            currentStage={currentStage}
            onChangeStage={setStage}
            onChangeImpact={setImpact}
            currentImpact={currentImpact}
          />
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
                title: '',
                accessor: 'order',
              },
              {
                title: 'Level',
                accessor: 'vulnerability',
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
