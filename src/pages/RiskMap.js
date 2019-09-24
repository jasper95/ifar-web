import React, { useState, useMemo } from 'react';
import Grid from 'react-md/lib/Grids/Grid';
import Cell from 'react-md/lib/Grids/Cell';
import DataTable from 'components/DataTable';
import SelectMenuButton from 'components/SelectMenuButton';
import Map from 'components/RiskMap';
import { useDispatch } from 'react-redux';
import { riskMapQuery } from 'components/Risk/query';
import Button from 'react-md/lib/Buttons/Button';
import { getVulnerabilityLevel, addClassTimeout } from 'lib/tools';
import useQuery from 'apollo/query';
import orderBy from 'lodash/orderBy';
import generateRiskMapExcel from 'lib/generateRiskMapExcel';
import VulnerabilityChange from 'components/RiskMap/VulnerabilityChange';

import 'sass/pages/riskmap.scss';

export default function RiskMap(props) {
  const {
    onBack, typeTitle, riskType, onChange,
    businessUnitResponse, currentBusinessUnit,
    operations, operation, project,
    projectResponse, subOperation, subOperations,
  } = props;
  const { data: { project_risk: projects = [] } } = projectResponse;
  const [currentImpact, setImpact] = useState('');
  const [currentStage, setStage] = useState('residual');
  const { data: { [`business_unit_${riskType}`]: businessUnits = [] } } = businessUnitResponse;
  const variables = {
    business_unit_id: currentBusinessUnit,
    risk_type: riskType,
    sub_operation_id: subOperation,
    project_id: project,
  };
  let { data: { risk_dashboard: riskItems = [] } } = useQuery(
    riskMapQuery, { variables, ws: true },
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
      .filter(e => (currentImpact ? e.impact_driver === currentImpact : e.impact_driver))
      .filter(e => e.rating),
    ['vulnerability', 'rating'], ['desc', 'desc'],
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
      <Grid className="row-ToolbarHeader">
        <Cell offset={6} size={6} className="col-actions">
          <Button
            onClick={onBack}
            iconChildren="keyboard_arrow_left"
            className="iBttn iBttn-primary"
            children={`${typeTitle} Risk Management`}
          />
        </Cell>
      </Grid>
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
              <SelectMenuButton
                adjusted={false}
                raised
                primary
                simplifiedMenu={false}
                repositionOnScroll={false}
                id="businessUnit"
                className="tableRiskMapToolbar_menu iBttn iBttn-primary"
                listClassName="tableRiskMapToolbar_menu_list"
                onChange={onChange}
                options={businessUnits.map(e => ({ value: e.id, label: e.name }))}
                value={currentBusinessUnit}
              />
              {riskType !== 'srmp' && (
                <>
                  <SelectMenuButton
                    adjusted={false}
                    raised
                    primary
                    simplifiedMenu={false}
                    repositionOnScroll={false}
                    id="operation"
                    className="tableRiskMapToolbar_menu iBttn iBttn-lightgray "
                    listClassName="tableRiskMapToolbar_menu_list"
                    onChange={onChange}
                    options={operations.map(e => ({ value: e.id, label: e.name }))}
                    value={operation}
                  />
                  <SelectMenuButton
                    adjusted={false}
                    raised
                    primary
                    simplifiedMenu={false}
                    repositionOnScroll={false}
                    id="subOperation"
                    className="tableRiskMapToolbar_menu iBttn iBttn-lightgray "
                    listClassName="tableRiskMapToolbar_menu_list"
                    onChange={onChange}
                    options={subOperations.map(e => ({ value: e.id, label: e.name }))}
                    value={subOperation}
                  />
                </>
              )}
              {riskType === 'prmp' && (
                <SelectMenuButton
                  adjusted={false}
                  raised
                  primary
                  simplifiedMenu={false}
                  repositionOnScroll={false}
                  id="project"
                  className="tableRiskMapToolbar_menu iBttn iBttn-lightgray "
                  listClassName="tableRiskMapToolbar_menu_list"
                  onChange={onChange}
                  options={projects.map(e => ({ value: e.id, label: e.name }))}
                  value={project}
                />
              )}
              <Button
                flat
                className="tableRiskMapToolbar_export md-cell--6"
                onClick={() => {
                  generateRiskMapExcel(riskItems);
                }}
              >
                Export
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
          title: 'Risk Details',
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
