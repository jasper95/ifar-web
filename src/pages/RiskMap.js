import React, { useState, useMemo } from 'react';
import Grid from 'react-md/lib/Grids/Grid';
import Cell from 'react-md/lib/Grids/Cell';
import DataTable from 'components/DataTable';
import MenuButton from 'react-md/lib/Menus/MenuButton';
import FakeButton from 'react-md/lib/Helpers/AccessibleFakeButton';
import IconSeparator from 'react-md/lib/Helpers/IconSeparator';
import FontIcon from 'react-md/lib/FontIcons/FontIcon';
import Map from 'components/RiskMap';
import { useDispatch } from 'react-redux';
import { riskDetailsFragment } from 'components/Risk/List';
import Button from 'react-md/lib/Buttons/Button';
import gql from 'graphql-tag';
import { getVulnerabilityLevel } from 'lib/tools';
import useQuery from 'apollo/query';
import orderBy from 'lodash/orderBy';
import generateRiskMapExcel from 'lib/generateRiskMapExcel';

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
      recent_changes
      causes
      impacts
      ...RiskDetails
    }
  }
  ${riskDetailsFragment}
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
        prevDetails: e.previous_details ? e.previous_details[currentStage] : null,
        impact_driver: e[`${currentStage}_impact_driver`],
        likelihood: e[`${currentStage}_likelihood`],
        rating: e[`${currentStage}_rating`],
        vulnerability: (e[`${currentStage}_rating`] || 0) * e[`${currentStage}_likelihood`],
      }))
      .filter(e => (currentImpact ? e.impact_driver === currentImpact : e.impact_driver)),
    ['vulnerability'], ['desc'],
  ).map((e, idx) => ({ ...e, order: idx + 1 })),
  [currentStage, riskItems, currentImpact]);
  return (
    <div className="dbContainer">
      <Grid>
        <Cell size={9}>
          <Map
            risks={riskItems}
            currentStage={currentStage}
            onChangeStage={setStage}
            onChangeImpact={newVal => setImpact(prev => (prev !== newVal ? newVal : ''))}
            currentImpact={currentImpact}
          />
        </Cell>
        <Cell size={3}>
          <div className="tableRiskMapToolbar">
            <MenuButton
              adjusted={false}
              raised
              primary
              menuItems={businessUnits
                .map(e => ({ primaryText: e.name, onClick: () => setBusinessUnit(e.id) }))
              }
              simplifiedMenu={false}
              anchor={MenuButton.Positions.BOTTOM}
              repositionOnScroll={false}
              id="tableRiskMapToolbar"
              className="tableRiskMapToolbar_menu iBttn iBttn-primary"
              listClassName="tableRiskMapToolbar_menu_list"
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
            <Button
              flat
              className="tableRiskMapToolbar_export"
              onClick={() => {
                generateRiskMapExcel(riskItems);
              }}
            >
              Export as Excel
            </Button>
          </div>
          <DataTable
            rows={riskItems}
            className="tableRiskMap"
            columns={getTableColumns()}
          />
        </Cell>
      </Grid>
    </div>
  );

  function getTableColumns() {
    return [
      {
        title: '',
        type: 'component',
        component: RowIndex,
        bodyProps: {
          className: 'tableRiskMap_risk-index',
        },
      },
      {
        title: 'Level',
        type: 'component',
        component: RiskLevel,
        bodyProps: {
          className: 'tableRiskMap_risk-level',
        },
      },
      {
        title: 'Risk Name',
        type: 'component',
        component: RiskName,
        bodyProps: {
          className: 'tableRiskMap_risk-name',
        },
      },
      {
        title: 'VC',
        type: 'component',
        component: VulnerabilityChange,
        bodyProps: {
          className: 'tableRiskMap_risk-vc',
        },
      },
    ];
  }
}

function RowIndex({ row }) {
  return (
    <span className={`number impact-${row.impact_driver.replace('_', '-')}`}>{row.order}</span>
  );
}

function RiskName({ row }) {
  const dispatch = useDispatch();
  return (
    <span 
      className="riskname"
      onClick={onClick}
    >
      {row.name}
    </span>
  );

  function onClick() {
    dispatch({
      type: 'SHOW_DIALOG',
      payload: {
        path: 'RiskMapItemDetails',
        props: {
          risk: row,
          dialogClassName: 'i_dialog_container--lg',
        },
      },
    });
  }
}


function RiskLevel({ row }) {
  const { vulnerability } = row;
  return (
    <span
      className={`level level-${getVulnerabilityLevel(vulnerability)}`}
    >
      {vulnerability}
    </span>
  );
}

export function VulnerabilityChange({ row }) {
  const { prevDetails, vulnerability } = row;
  const dispatch = useDispatch();

  let status = 'new';

  if (prevDetails && prevDetails.rating && prevDetails.likelihood) {
    const oldVulnerability = (prevDetails.rating * prevDetails.likelihood);
    if (oldVulnerability === vulnerability) {
      status = 'stagnant';
    } else if (vulnerability > oldVulnerability) {
      status = 'up';
    } else {
      status = 'down';
    }
  }
  if (status === 'up') {
    return (
      <div 
        className="vcStatus vcStatus-up" 
        onClick={handleClick} role="presentation"
      >
        <span className="rafi-icon-arrow-up" />
      </div>
    );
  }
  if (status === 'stagnant') {
    return (
      <div className="vcStatus vcStatus-stagnant" 
        onClick={handleClick} role="presentation">
        <span className="rafi-icon-arrow-sides" />
      </div>
    );
  }
  if (status === 'new') {
    return (
      <div
        className="vcStatus vcStatus-new" 
        onClick={handleClick} role="presentation"
      >
        <span className="text">
          new
        </span>
      </div>
    );
  }
  return (
    <div
      className="vcStatus vcStatus-down"
      onClick={handleClick}
      role="presentation"
    >
      <span className="rafi-icon-arrow-down" />
    </div>
  );

  function handleClick() {
    dispatch({
      type: 'SHOW_DIALOG',
      payload: {
        path: 'RiskChanges',
        props: {
          dialogId: 'RiskChanges',
          risk: row,
          dialogClassName: 'i_dialog_container--lg',
        },
      },
    });
  }
}
