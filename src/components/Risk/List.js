import React, { useState, useCallback } from 'react';
import Grid from 'react-md/lib/Grids/Grid';
import { components } from 'react-select';
import Button from 'react-md/lib/Buttons/Button';
import { useDispatch, useSelector } from 'react-redux';
import useMutation, { useCreateNode } from 'apollo/mutation';
import Pagination from 'rc-pagination';
import { getImpactDriver, getRecentChanges } from 'lib/tools';
import useQuery from 'apollo/query';
import SelectAutocomplete from 'components/SelectAutocomplete';
import { RiskItemSkeleton } from 'components/Skeletons';
import cn from 'classnames';
import startCase from 'lodash/startCase';
import snakeCase from 'lodash/snakeCase';
import RiskItem from './Item';
import { riskListQuery } from './query';
import 'sass/components/risk/index.scss';

function RiskList(props) {
  const {
    businessUnit, classification,
    impactDriver, residualVulnerability,
    riskType, operations, operation, onChange, typeTitle,
    businessUnitResponse, project, subOperation, subOperations,
    projects,
  } = props;
  const [currentPage, setCurrentPage] = useState(1);
  const user = useSelector(state => state.auth);
  const variables = {
    sub_operation_id: subOperation,
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
  const [, onCreateRisk] = useCreateNode({ node: 'risk' });
  const { data: { [`business_unit_${riskType}`]: businessUnits = [] } } = businessUnitResponse;
  const selectedBusinessUnit = businessUnits.find(e => e.id === businessUnit);
  const selectedProject = projects.find(e => e.id === project);
  const selectedOperation = operations.find(e => e.id === operation);
  const [, onMutateProject] = useMutation({});
  const ProjectOptionComponent = useCallback(CustomProjectOption, [project]);
  const SubOperationOptionComponent = useCallback(CustomProjectOption, [subOperation]);
  const OperationOptionComponent = useCallback(CustomProjectOption, [operation]);
  const crumbs = [
    `${typeTitle} Risk Management Plan`,
    selectedBusinessUnit && selectedBusinessUnit.name,
    selectedOperation && selectedOperation.name,
    selectedProject && selectedProject.name,
  ].filter(Boolean);
  return (
    <Grid className="riskList">
      <div className="riskList_unitList">
        {businessUnits.map(e => (
          <Button
            flat
            className="riskList_unitList_item"
            onClick={() => onChange(e.id, 'businessUnit')}
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
            {crumbs.map((crumb, idx) => (
              <span
                key={idx}
                className={`crumb_${idx === 0 ? 'main' : 'sub'}`}
              >
                <div className="text">{crumb}</div>
              </span>
            ))}
          </div>
          {user[`${riskType}_role`] !== 'VIEW_COMMENT' && (
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
          )}
        </div>
        <div className="riskList_risk_content">
          <div className="row riskList_risk_content_header">
            <div className="col-md-3 contentHeader_pagination">
              <Pagination
                onChange={newPage => setCurrentPage(newPage)}
                current={currentPage}
                pageSize={10}
                total={selectedBusinessUnit ? selectedBusinessUnit.risk_count : 0}
                hideOnSinglePage
              />
            </div>
            <div className="col-md-9 contentHeader_actions">
              {renderActions() }
            </div>
          </div>
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

  function renderActions() {
    return (
      <>
        {riskType !== 'srmp' && (
          <>
            <SelectAutocomplete
              id="operation"
              label="Operation"
              options={operations.map(e => ({ value: e.id, label: e.name, type: 'operation' }))}
              onChange={onChange}
              components={{ Option: OperationOptionComponent }}
              value={operation}
              required={false}
              className="col-sm-4"
              key="1"
            />
            <Button
              icon
              className="actions_addRisk iBttn iBttn-primary"
              iconChildren="add_circle"
              onClick={() => showProjectDialog(undefined, 'operation')}
            />
            <SelectAutocomplete
              id="subOperation"
              label="Operational Sub Unit"
              options={subOperations.map(e => ({ value: e.id, label: e.name, type: 'subOperation' }))}
              onChange={onChange}
              value={subOperation}
              components={{ Option: SubOperationOptionComponent }}
              required={false}
              className="col-sm-4"
              key="2"
            />
            <Button
              icon
              className="actions_addRisk iBttn iBttn-primary"
              iconChildren="add_circle"
              onClick={() => showProjectDialog(undefined, 'subOperation')}
            />
          </>
        )}
        {riskType === 'prmp' && (
          <>
            <SelectAutocomplete
              id="project"
              label="Project"
              options={projects.map(e => ({
                value: e.id, label: `${e.name} (${e.risk_count})`, risks: e.risk_count, type: 'project',
              }))}
              onChange={onChange}
              components={{ Option: ProjectOptionComponent }}
              value={project}
              required={false}
              key="2"
              className="contentHeader_actions_projects col-sm-3"
            />
            <Button
              icon
              className="actions_addRisk iBttn iBttn-primary"
              iconChildren="add_circle"
              onClick={() => showProjectDialog(undefined, 'project')}
            />
          </>
        )}
      </>
    );
  }

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
            reason: {},
            sub_operation_id: subOperation,
            project_id: project,
            type: riskType,
          },
          dialogClassName: 'i_dialog_container--xl',
        },
      },
      type: 'SHOW_DIALOG',
    });
  }

  function showProjectDialog(initialFields, type) {
    const label = type === 'subOperation' ? 'operational sub unit' : type;
    const url = `/${snakeCase(type)}`;
    const { refetch } = props[`${type}Response`];
    dispatch({
      type: 'SHOW_DIALOG',
      payload: {
        path: 'Project',
        props: {
          initialFields,
          title: `${initialFields ? 'Update' : 'Create'} ${startCase(label)}`,
          onValid: data => onMutateProject({
            data: {
              ...data,
              sub_operation_id: subOperation,
              business_unit_id: businessUnit,
              operation_id: operation,
            },
            url,
            onSuccess: () => refetch(),
            method: initialFields ? 'PUT' : 'POST',
            message: `${startCase(label)} successfully ${initialFields ? 'updated' : 'created'}`,
          }),
        },
      },
    });
  }

  function handleDelete(data, type) {
    const label = type === 'subOperation' ? 'operational sub unit' : type;
    const url = `/${snakeCase(type)}`;
    const { refetch } = props[`${type}Response`];
    dispatch({
      type: 'SHOW_DIALOG',
      payload: {
        path: 'Confirm',
        props: {
          message: `Do you want to delete this ${label}?`,
          title: `Craete ${label}`,
          onValid: () => onMutateProject({
            data,
            url,
            onSuccess: () => refetch(),
            method: 'DELETE',
            message: `${label} successfully deleted`,
          }),
        },
      },
    });
  }

  function CustomProjectOption(optionProps) {
    // const arr =
    const { data } = optionProps;
    let arr = [];
    switch (data.type) {
      case 'subOperation':
        arr = subOperations;
        break;
      case 'project':
        arr = projects;
        break;
      case 'operation':
        arr = operations;
        break;
      default:
    }
    const value = arr.find(e => e.id === optionProps.value);
    return (
      <div
        className={cn('iField-rs__menu__item', {
          selected: optionProps.isSelected,
        })}
      >
        <components.Option {...optionProps} />
        <div className="actions">
          <Button
            icon
            onClick={() => showProjectDialog(value, data.type)}
            className="iBttn iBttn-tc-primary"
          >
            edit
          </Button>
          {!data.risks && (
            <Button
              icon
              onClick={() => handleDelete(value, data.type)}
              className="iBttn iBttn-tc-error"
            >
              delete
            </Button>
          )}
        </div>
      </div>
    );
  }
}


export default RiskList;
