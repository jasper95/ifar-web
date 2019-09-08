import React, { useState, useMemo } from 'react';
import Grid from 'react-md/lib/Grids/Grid';
import Cell from 'react-md/lib/Grids/Cell';
import Button from 'react-md/lib/Buttons/Button';
import RiskList from 'components/Risk/List';
import RiskGraph from 'components/Risk/Graph';
import useBusinessUnit from 'components/Risk/useBusinessUnit';
import { useDispatch, useSelector } from 'react-redux';
import { notifCountQuery, requestCountQuery } from 'components/Risk/query';
import loadable from '@loadable/component';
import useQuery from 'apollo/query';
import 'rc-pagination/assets/index.css';
import 'sass/pages/manage-risk.scss';

const RiskMap = loadable(() => import('pages/RiskMap'));

function ManageRisk(props) {
  const { path } = props.match;
  const riskType = path.replace(/\//g, '');
  const typeTitle = useMemo(getTypeTitle, [riskType]);
  const dispatch = useDispatch();
  const [riskMapVisible, setRiskMapVisible] = useState(false);
  const user = useSelector(state => state.auth);
  let userBusinessUnits = useBusinessUnit();
  const [defaultBusinessUnit = null] = userBusinessUnits;
  const [currentBusinessUnit, setBusinessUnit] = useState(
    defaultBusinessUnit ? defaultBusinessUnit.id : null,
  );
  const businessUnitWithOp = userBusinessUnits.find(e => e.id === currentBusinessUnit);
  userBusinessUnits = userBusinessUnits.map(e => e.id);
  const operations = businessUnitWithOp ? businessUnitWithOp.operations || [] : [];
  const [defaultOp = null] = operations;
  const [currentOp, setOp] = useState(defaultOp && riskType !== 'srmp' ? defaultOp.id : null);
  const [currentClassification, setCurrentClassification] = useState(null);
  const [currentImpactDriver, setCurrentImpactDriver] = useState(null);
  const [currentVulnerability, setCurrentVulnerability] = useState();
  const requestNotifCountVars = { user_business_units: userBusinessUnits, user_id: user.id };
  const notifCount = useQuery(notifCountQuery, {
    ws: true,
    variables: requestNotifCountVars,
  });
  const requestCount = useQuery(requestCountQuery, {
    ws: true,
    variables: requestNotifCountVars,
  });
  if (riskMapVisible) {
    return (
      <RiskMap onBack={() => setRiskMapVisible(false)} typeTitle={typeTitle} riskType={riskType} />
    );
  }
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
                {!notifCount.loading && notifCount.data.notification_aggregate.aggregate.count}
              </span>
            )}
            onClick={() => showDialog({
              type: 'Notifications',
              dialogTitle: 'Notifications',
              dialogSize: 'sm',
            })}
          />
          <Button
            flat
            className="iBttn iBttn-primary iBttn-counterBadge"
            iconBefore={false}
            children="View All Requests"
            onClick={() => showDialog({
              type: 'Requests',
              dialogTitle: 'Requests',
              dialogSize: 'lg',
            })}
            iconEl={(
              <span className="iBttn_badge">
                {!requestCount.loading && requestCount.data.request_aggregate.aggregate.count}
              </span>
            )}
          />
          <Button
            flat
            className="iBttn iBttn-primary iBttn-counterBadge"
            children={`View ${typeTitle} Risk Map`}
            onClick={() => setRiskMapVisible(true)}
          />
        </Cell>
      </Grid>
      <RiskGraph
        filters={{
          currentBusinessUnit,
          currentClassification,
          currentImpactDriver,
          currentVulnerability,
        }}
        handlers={{
          setCurrentImpactDriver,
          setCurrentVulnerability,
          setCurrentClassification,
        }}
        riskType={riskType}
      />
      <RiskList
        businessUnit={currentBusinessUnit}
        classification={currentClassification}
        impactDriver={currentImpactDriver}
        residualVulnerability={currentVulnerability}
        riskType={riskType}
        operations={operations}
        operation={currentOp}
        onChange={handleChange}
        typeTitle={typeTitle}
      />
    </div>
  );

  function handleChange(val, key) {
    let func;
    switch (key) {
      case 'operation':
        func = setOp;
        break;
      case 'businessUnit':
        func = setBusinessUnit;
        break;
      case 'project':
        break;
      default:
    }
    if (func) {
      func(val);
    }
  }

  function showDialog({ type, dialogTitle, dialogSize = 'md' }) {
    dispatch({
      type: 'SHOW_DIALOG',
      payload: {
        path: type,
        props: {
          title: dialogTitle,
          onValid: () => {},
          dialogClassName: `i_dialog_container--${dialogSize}`,
          requestNotifCountVars,
          requestCount: !requestCount.loading
            ? requestCount.data.request_aggregate.aggregate.count : 0,
          notifCount: !notifCount.loading
            ? notifCount.data.notification_aggregate.aggregate.count : 0,
        },
      },
    });
  }

  function getTypeTitle() {
    return {
      srmp: 'Strategic',
      ormp: 'Operational',
      prmp: 'Project',
    }[riskType];
  }
}

export default ManageRisk;
