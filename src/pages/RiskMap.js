import React, { useState, useMemo } from 'react';
import Grid from 'react-md/lib/Grids/Grid';
import Cell from 'react-md/lib/Grids/Cell';
import DataTable from 'components/DataTable';
import SelectMenuButton from 'components/SelectMenuButton';
import Map from 'components/RiskMap';
import { useDispatch } from 'react-redux';
import { riskDetailsFragment } from 'components/Risk/query';
import Button from 'react-md/lib/Buttons/Button';
import gql from 'graphql-tag';
import { getVulnerabilityLevel, addClassTimeout } from 'lib/tools';
import useQuery from 'apollo/query';
import orderBy from 'lodash/orderBy';
import generateRiskMapExcel from 'lib/generateRiskMapExcel';
import useBusinessUnit from 'components/Risk/useBusinessUnit';
import VulnerabilityChange from 'components/RiskMap/VulnerabilityChange';

const riskQuery = gql`
  subscription getList($id: uuid!) {
    risk_dashboard(where: {business_unit_id: {_eq: $id }}) {
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

export default function RiskMap(props) {
  const { onBack } = props;
  const [currentImpact, setImpact] = useState('');
  const [currentStage, setStage] = useState('residual');

  const businessUnits = useBusinessUnit();
  const [defaultBusinessUnit] = businessUnits;
  const [currentBusinessUnit, setBusinessUnit] = useState(
    defaultBusinessUnit ? defaultBusinessUnit.id : null,
  );
  let { data: { risk_dashboard: riskItems = [] } } = useQuery(
    riskQuery, { variables: { id: currentBusinessUnit }, ws: true },
  );
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

  const handleSetStageWithAnimation = (setStageArgs) => {
    const bodyel = document.getElementsByTagName('body')[0];
    if (setStageArgs !== currentStage) {
      addClassTimeout({
        target: bodyel,
        classIn: 'animate_riskTables_exit',
        classOut: 'animate_riskTables_enter',
        timeout: 300,
        callback: () => setStage(setStageArgs),
      });
    }
  };

  return (
    <div className="dbContainer">
      <Grid>
        <Cell size={9}>
          <Map
            risks={riskItems}
            currentStage={currentStage}
            onChangeStage={handleSetStageWithAnimation}
            onChangeImpact={newVal => setImpact(prev => (prev !== newVal ? newVal : ''))}
            currentImpact={currentImpact}
          />
        </Cell>
        <Cell size={3}>
          <div className="tableRiskActions">
            <div className="tableRiskMapToolbar">
              <Button onClick={onBack}>Strategic Risk Map</Button>
              <SelectMenuButton
                id="tableRiskMapToolbar"
                className="tableRiskMapToolbar_menu iBttn iBttn-primary"
                listClassName="tableRiskMapToolbar_menu_list"
                onChange={setBusinessUnit}
                options={businessUnits.map(e => ({ value: e.id, label: e.name }))}
                value={currentBusinessUnit}
              />
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
          </div>
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
