import { useState, useEffect } from 'react';
import useQuery from 'apollo/query';
import { useSelector } from 'react-redux';
import useBusinessUnit from './useBusinessUnit';
import {
  projectQuery, operationQuery, subOperationQuery, businessUnitQuery,
} from './query';


function useRiskGroups(props) {
  const { riskType } = props;
  let userBusinessUnits = useBusinessUnit();
  const user = useSelector(state => state.auth);
  const isCustomSubOps = ['TEAM_LEADER', 'RISK_CHAMPION'].includes(user.ormp_role);
  const isCustomProjects = ['TEAM_LEADER', 'RISK_CHAMPION'].includes(user.prmp_role);
  const [defaultBusinessUnit = null] = userBusinessUnits;
  const [currentOp, setCurrentOp] = useState(null);
  const [project, setProject] = useState(null);
  const [currentSubOp, setCurrentSubOp] = useState(null);
  const [currentBusinessUnit, setBusinessUnit] = useState(
    defaultBusinessUnit ? defaultBusinessUnit.id : null,
  );
  userBusinessUnits = userBusinessUnits.map(e => e.id);
  const operationResponse = useQuery(operationQuery, {
    variables: {
      business_unit_id: currentBusinessUnit,
      ...isCustomSubOps && { ids: [currentOp].filter(Boolean) },
    },
    skip: riskType === 'srmp',
  });
  const subOperationResponse = useQuery(subOperationQuery, {
    variables: isCustomSubOps ? {
      ids: user.sub_operations,
      business_unit_id: currentBusinessUnit,
    } : {
      operation_id: currentOp,
      business_unit_id: currentBusinessUnit,
    },
    skip: riskType === 'srmp',
  });
  const projectResponse = useQuery(
    projectQuery,
    {
      variables: isCustomProjects ? {
        ids: user.projects,
        business_unit_id: currentBusinessUnit,
      } : {
        sub_operation_id: currentSubOp,
        business_unit_id: currentBusinessUnit,
      },
      skip: riskType !== 'prmp',
    },
  );
  const businessUnitResponse = useQuery(
    businessUnitQuery,
    {
      ws: true,
      variables: {
        user_business_units: userBusinessUnits,
        riskType,
        ...isCustomSubOps && riskType === 'ormp' && { sub_operations: user.sub_operations },
        ...isCustomProjects && riskType === 'prmp' && { projects: user.projects },
      },
    },
  );
  const { data: { project_risk: projects = [] } } = projectResponse;
  const { data: { sub_operation_project: subOperations = [] } } = subOperationResponse;
  const { data: { operation_sub_operation: operations = [] } } = operationResponse;
  useEffect(() => {
    if (projects.length) {
      setProject(projects[0].id);
    }
  }, [projects]);
  useEffect(() => {
    if (subOperations.length) {
      const [first] = subOperations;
      setCurrentSubOp(first.id);
      setCurrentOp(first.operation_id);
    }
  }, [subOperations]);
  useEffect(() => {
    if (operations.length) {
      setCurrentOp(operations[0].id);
    }
  }, [operations]);
  const state = {
    currentSubOp,
    currentOp,
    project,
    currentBusinessUnit,
    userBusinessUnits,
    operations,
    projectResponse,
    businessUnitResponse,
    subOperationResponse,
    operationResponse,
    projects,
    subOperations,
    isCustomProjects,
    isCustomSubOps,
  };
  return [state, handleChange];

  function handleChange(val, key) {
    let func;
    switch (key) {
      case 'operation':
        func = setCurrentOp;
        break;
      case 'subOperation':
        func = setCurrentSubOp;
        break;
      case 'businessUnit':
        func = setBusinessUnit;
        break;
      case 'project':
        func = setProject;
        break;
      default:
    }
    if (func) {
      func(val);
    }
  }
}
export default useRiskGroups;
