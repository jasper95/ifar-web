import gql from 'graphql-tag';

export const businessUnitQuery = gql`
  subscription getBusinessUnits($user_business_units: [uuid!], $riskType: String!, $projects: [uuid!], $sub_operations: [uuid!]) {
    business_unit(where: {id: {_in: $user_business_units}}, order_by: { order: asc }) {
      risks_aggregate(where: {type: {_eq: $riskType}, project_id: {_in: $projects }, sub_operation_id: {_in: $sub_operations}}) {
        aggregate {
          count(columns: id)
        }
      }
      name
      id
    }
  }
`;

export const chartQuery = gql`
  subscription getChart($risk_type: String, $sub_operation_id: uuid, $project_id: uuid, $business_unit_id: uuid!, $operation_id: uuid){
    risk_dashboard(where: {business_unit_id: {_eq: $business_unit_id }, type: { _eq: $risk_type }, sub_operation_id: { _eq: $sub_operation_id }, project_id: { _eq: $project_id }, operation_id: { _eq: $operation_id} }){
      classification_id
      residual_impact_driver
      residual_rating
      residual_likelihood
    }
  }
`;

export const notifCountQuery = gql`
  subscription getRequestNotifCount($user_id: jsonb, $user_business_units: [uuid!]) {
    notification_aggregate(where: {receivers: {_contains: $user_id }, business_unit_id: { _in: $user_business_units }}) {
      aggregate {
        count
      }
    }
  }
`;

export const requestCountQuery = gql`
  subscription getRequestNotifCount($user_id: jsonb, $user_business_units: [uuid!]) {
    request_aggregate(where: {business_unit_id: { _in: $user_business_units }}) {
      aggregate {
        count
      }
    }
  }
`;

export const riskDetailsFragment = gql`
  fragment RiskDetails on risk_dashboard {
    causes
    classification_name
    business_unit_id
    impact_details
    previous_details
    classification_id
    current_treatments
    definition
    future_treatments
    id
    impacts
    name
    stakeholders
    basis
    target_rating
    residual_rating
    inherent_rating
    target_likelihood
    residual_likelihood
    inherent_likelihood
    residual_impact_driver
    type
  }
`;

export const operationQuery = gql`
  query($business_unit_id: uuid, $ids: [uuid!]) {
    operation_sub_operation(where: { business_unit_id: {_eq: $business_unit_id}, id: { _in: $ids } }, order_by: { name: asc }) {
      id
      name
      sub_operation_count
      business_unit_id
    }
  }
`;

export const subOperationQuery = gql`
  query($operation_id: uuid, $ids: [uuid!], $business_unit_id: uuid) {
    sub_operation_project(where: { operation_id: {_eq: $operation_id }, business_unit_id: {_eq: $business_unit_id }, id: { _in: $ids } }, order_by: { name: asc }) {
      id
      name
      project_count
      risk_count
      operation_name
      operation_id
    }
  }
`;

export const projectQuery = gql`
  query($sub_operation_id: uuid, $ids: [uuid!], $business_unit_id: uuid) {
    project_risk(where: { sub_operation_id: {_eq: $sub_operation_id}, business_unit_id: {_eq: $business_unit_id}, id: { _in: $ids } }, order_by: { name: asc }) {
      id
      name
      risk_count
      sub_operation_name
      sub_operation_id
    }
  }
`;

export const riskListQuery = gql`
  subscription getList($risk_type: String, $sub_operation_id: uuid, $operation_id: uuid, $project_id: uuid, $business_unit_id: uuid!, $classification_id: uuid, $residual_impact_driver: String, $residual_vulnerability: String, $offset:Int , $limit: Int =10){
    risk_dashboard(
      where: {
        operation_id: { _eq: $operation_id },
        sub_operation_id: { _eq: $sub_operation_id },
        project_id: { _eq: $project_id },
        type: { _eq: $risk_type }, 
        business_unit_id: {_eq: $business_unit_id },
        classification_id: { _eq: $classification_id },
        residual_impact_driver: { _eq: $residual_impact_driver },
        residual_vulnerability: { _eq: $residual_vulnerability }
      },
        order_by: {created_date: desc}, offset: $offset, limit: $limit
    ) {
      ...RiskDetails
      recent_changes
      reason
      has_treatment_request
      has_delete_request
      has_inherent_request
    }
  }
  ${riskDetailsFragment}
`;

export const riskListCountQuery = gql`
  subscription getList($risk_type: String, $sub_operation_id: uuid, $operation_id: uuid, $project_id: uuid, $business_unit_id: uuid!, $classification_id: uuid, $residual_impact_driver: String, $residual_vulnerability: String){
    risk_dashboard_aggregate(
      where: {
        operation_id: { _eq: $operation_id },
        sub_operation_id: { _eq: $sub_operation_id },
        project_id: { _eq: $project_id },
        type: { _eq: $risk_type }, 
        business_unit_id: {_eq: $business_unit_id },
        classification_id: { _eq: $classification_id },
        residual_impact_driver: { _eq: $residual_impact_driver },
        residual_vulnerability: { _eq: $residual_vulnerability }
      }
    ) {
      aggregate {
        count
      }
    }
  }
`;
export const riskMapQuery = gql`
  subscription getList($risk_type: String, $sub_operation_id: uuid, $project_id: uuid, $operation_id: uuid, $business_unit_id: uuid!) {
    risk_dashboard(where: {
      sub_operation_id: { _eq: $sub_operation_id },
      operation_id: { _eq: $operation_id },
      project_id: { _eq: $project_id },
      type: { _eq: $risk_type }, 
      business_unit_id: {_eq: $business_unit_id },
    }) {
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
