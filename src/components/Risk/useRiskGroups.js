import { useState, useEffect } from 'react';
import gql from 'graphql-tag';
import useQuery from 'apollo/query';
import useBusinessUnit from './useBusinessUnit';
import { projectQuery, operationQuery, subOperationQuery } from './query';

function useRiskGroups(props) {
  const { riskType } = props;
  let userBusinessUnits = useBusinessUnit();
  const [defaultBusinessUnit = null] = userBusinessUnits;
  const [currentOp, setOp] = useState(null);
  const [project, setProject] = useState(null);
  const [currentSubOp, setSubOp] = useState(null);
  const [currentBusinessUnit, setBusinessUnit] = useState(
    defaultBusinessUnit ? defaultBusinessUnit.id : null,
  );
  userBusinessUnits = userBusinessUnits.map(e => e.id);
  const operationResponse = useQuery(operationQuery, {
    variables: { business_unit_id: currentBusinessUnit },
    skip: riskType === 'srmp',
  });
  const subOperationResponse = useQuery(subOperationQuery, {
    variables: { operation_id: currentOp },
    skip: !currentOp,
  });
  const projectResponse = useQuery(
    projectQuery,
    {
      variables: { sub_operation_id: currentSubOp },
      skip: !currentSubOp,
    },
  );
  const businessUnitQuery = gql`
    subscription getBusinessUnits($user_business_units: [uuid!]){
      business_unit_${riskType}(order_by: {order: asc}, where: { id: { _in: $user_business_units }}) {
        id
        name
        risk_count
      }
    }
  `;
  const businessUnitResponse = useQuery(
    businessUnitQuery,
    {
      ws: true,
      variables: { user_business_units: userBusinessUnits },
    },
  );
  const { data: { project_risk: projects = [] } } = projectResponse;
  const { data: { sub_operation_project: subOperations = [] } } = subOperationResponse;
  const { data: { operation_sub_operation: operations = [] } } = operationResponse;
  useEffect(() => {
    if (projects.length) {
      setProject(projects[0].id);
    } else {
      setProject(null);
    }
  }, [projects]);
  useEffect(() => {
    if (subOperations.length) {
      setSubOp(subOperations[0].id);
    } else {
      setSubOp(null);
    }
  }, [subOperations]);
  useEffect(() => {
    if (operations.length) {
      setOp(operations[0].id);
    } else {
      setOp(null);
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
  };
  return [state, handleChange];

  function handleChange(val, key) {
    let func;
    switch (key) {
      case 'operation':
        func = setOp;
        break;
      case 'subOperation':
        func = setSubOp;
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
