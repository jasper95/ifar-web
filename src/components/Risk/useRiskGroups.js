import { useState, useEffect } from 'react';
import gql from 'graphql-tag';
import useQuery from 'apollo/query';
import useBusinessUnit from './useBusinessUnit';
import { projectQuery } from './query';

function useRiskGroups(props) {
  const { riskType } = props;
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
  const [project, setProject] = useState(null);
  const projectResponse = useQuery(
    projectQuery,
    {
      variables: { operation_id: currentOp },
      skip: riskType !== 'prmp' || !currentOp,
    },
  );
  const { data: { project_risk: projects = [] } } = projectResponse;
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
  useEffect(() => {
    if (projects.length) {
      setProject(projects[0].id);
    } else {
      setProject(null);
    }
  }, [projects]);
  const state = {
    currentOp,
    project,
    currentBusinessUnit,
    userBusinessUnits,
    operations,
    projectResponse,
    businessUnitResponse,
  };
  return [state, handleChange];

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
