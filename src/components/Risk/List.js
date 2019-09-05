import React, { useState, useEffect } from 'react';
import Grid from 'react-md/lib/Grids/Grid';
import { components } from 'react-select';
import MenuButton from 'react-md/lib/Menus/MenuButton';
import FontIcon from 'react-md/lib/FontIcons/FontIcon';
import Button from 'react-md/lib/Buttons/Button';
import { useDispatch, useSelector } from 'react-redux';
import useMutation, { useCreateNode } from 'apollo/mutation';
import gql from 'graphql-tag';
import Pagination from 'rc-pagination';
import { getImpactDriver, getRecentChanges } from 'lib/tools';
import useQuery from 'apollo/query';
import SelectAutocomplete from 'components/SelectAutocomplete';
import { RiskItemSkeleton } from 'components/Skeletons';
import useBusinessUnit from './useBusinessUnit';
import RiskItem from './Item';
import { riskListQuery, projectQuery } from './query';
import 'sass/components/risk/index.scss';

function RiskList(props) {
  const {
    businessUnit, classification,
    impactDriver, residualVulnerability, riskType, operations, operation, onChange,
  } = props;
  const businessUnitQuery = gql`
    subscription getBusinessUnits($user_business_units: [uuid!]){
      business_unit_${riskType}(order_by: {order: asc}, where: { id: { _in: $user_business_units }}) {
        id
        name
        risk_count
      }
    }
  `;
  const [currentPage, setCurrentPage] = useState(1);
  const [project, setProject] = useState(null);
  const [, onMutateProject] = useMutation({ url: '/project' });
  const user = useSelector(state => state.auth);
  const userBusinessUnits = useBusinessUnit();
  const variables = {
    operation_id: operation,
    project_id: project,
    risk_type: riskType,
    business_unit_id: businessUnit,
    classification_id: classification,
    residual_impact_driver: impactDriver,
    residual_vulnerability: residualVulnerability,
    offset: (currentPage - 1) * 10,
  };
  const riskListResponse = useQuery(riskListQuery,
    { ws: true, variables });
  const { data: { risk_dashboard: list = [] }, loading: listIsLoading } = riskListResponse;
  const dispatch = useDispatch();
  const businessUnitResponse = useQuery(
    businessUnitQuery,
    {
      ws: true,
      variables: { user_business_units: userBusinessUnits.map(e => e.id) },
    },
  );
  const [, onCreateRisk] = useCreateNode({ node: 'risk' });
  const { data: { [`business_unit_${riskType}`]: businessUnits = [] } } = businessUnitResponse;
  const selected = businessUnits.find(e => e.id === businessUnit);
  const typeTitle = {
    srmp: 'Strategic Risk Management Plan',
    ormp: 'Operation Risk Management Plan',
    prmp: 'Project Risk Management Plan',
  }[riskType];
  const projectResponse = useQuery(
    projectQuery,
    {
      variables: { operation_id: operation },
      skip: riskType !== 'prmp' || !operation,
    },
  );
  const { data: { project: projects = [] } } = projectResponse;
  useEffect(() => {
    if (projects.length) {
      setProject(projects[0].id);
    }
  }, [projects]);
  const crumbs = [
    (<span key="1">{typeTitle}</span>),
    selected && (
      <span key="2">{selected.name}</span>
    ),
    riskType !== 'srmp' && (
      <div key="3">
        <SelectAutocomplete
          id="operation"
          options={operations.map(e => ({ value: e.id, label: e.name }))}
          onChange={onChange}
          value={operation}
        />
      </div>
    ),
    riskType === 'prmp' && (
      <div key="4">
        <SelectAutocomplete
          id="project"
          options={projects.map(e => ({ value: e.id, label: e.name }))}
          onChange={onChange}
          components={{ Option: CustomProjectOption }}
          value={project}
        />
        <Button onClick={() => showProjectDialog()}>Add Project</Button>
      </div>
    ),
  ].filter(Boolean);

  return (
    <Grid className="riskList">
      <div className="riskList_unitList">
        {businessUnits.map(e => (
          <Button
            flat
            className="riskList_unitList_item"
            onClick={() => onChange('businessUnit', e.id)}
            iconBefore={false}
            children={e.name}
            key={e.id}
            iconEl={(
              <span className="riskList_unitList_item_badge">
                {e.risk_count}
              </span>
              )}
          />
        ))}
      </div>

      <div className="riskList_risk">
        <div className="riskList_risk_header">
          <div className="crumb">
            {crumbs}
          </div>
          <div className="actions">
            <Button
              flat
              className="actions_addRisk iBttn iBttn-teal"
              iconChildren="add_circle"
              onClick={showRiskDialog}
            >
                Add Risk
            </Button>
          </div>
        </div>
        <div className="riskList_risk_content">
          <Pagination
            onChange={newPage => setCurrentPage(newPage)}
            current={currentPage}
            pageSize={10}
            total={selected ? selected.risk_count : 0}
            hideOnSinglePage
          />
          {listIsLoading ? (
            <>
              <RiskItemSkeleton />
              <RiskItemSkeleton
                fillPrimary="#E6EDF0"
                fillSecondary="#E0E4E6"
              />
            </>
          ) : list.map(risk => (
            <RiskItem
              previewProps={{ risk, readOnly: user.srmp_role === 'VIEW_COMMENT' }}
              detailsProps={{ risk, readOnly: user.srmp_role === 'VIEW_COMMENT', residualReadOnly: risk.has_treatment_request }}
              key={risk.id}
              className="riskList_risk_content_item"
            />
          ))}
          {!listIsLoading && list.length === 0 && (
          <span className="riskList_risk_content_empty">No Records Found</span>
          )}
        </div>
      </div>
    </Grid>
  );

  function showRiskDialog() {
    dispatch({
      payload: {
        path: 'InherentRisk',
        props: {
          dialogId: 'InherentRisk',
          title: 'Inherent Risk',
          onValid: (data) => {
            const impactDriver = getImpactDriver(data.impact_details.inherent);
            onCreateRisk({
              data: {
                ...data,
                inherent_impact_driver: impactDriver,
                inherent_rating: data.impact_details.inherent[impactDriver],
                recent_changes: {
                  ...getRecentChanges({}, data, ['stakeholders', 'impacts', 'causes']),
                  current_treatments: [],
                  future_treatments: [],
                },
              },
            });
          },
          initialFields: {
            basis: 'Frequency',
            inherent_likelihood: 1,
            impact_details: {},
            business_unit_id: businessUnit,
            operation_id: operation,
            project_id: project,
            type: riskType,
          },
          dialogClassName: 'i_dialog_container--xl',
        },
      },
      type: 'SHOW_DIALOG',
    });
  }

  function showProjectDialog(initialFields) {
    dispatch({
      type: 'SHOW_DIALOG',
      payload: {
        path: 'Project',
        props: {
          initialFields,
          title: 'Create Project',
          onValid: data => onMutateProject({
            data: { ...data, operation_id: operation },
            method: initialFields ? 'POST' : 'PUT',
            message: `Project successfully ${initialFields ? 'updated' : 'created'}`,
          }),
        },
      },
    });
  }
}

function CustomProjectOption(props) {
  return (
    <>
      <components.Option {...props} />
      <MenuButton
        icon
        menuItems={[
          {
            primaryText: 'Edit',
            leftIcon: <FontIcon>Edit</FontIcon>,
          },
          {
            primaryText: 'Delete',
            leftIcon: <FontIcon>delete</FontIcon>,
          },
        ]}
        anchor={MenuButton.Positions.BOTTOM}
      >
        more_vert
      </MenuButton>
    </>
  );
}


export default RiskList;
