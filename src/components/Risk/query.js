import gql from 'graphql-tag';

export const chartQuery = gql`
  subscription getChart($risk_type: String, $sub_operation_id: uuid, $project_id: uuid, $business_unit_id: uuid!){
    risk(where: {business_unit_id: {_eq: $business_unit_id }, type: { _eq: $risk_type }, sub_operation_id: { _eq: $sub_operation_id }, project_id: { _eq: $project_id } }){
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
  }
`;

export const operationQuery = gql`
  query($business_unit_id: uuid) {
    operation_sub_operation(where: { business_unit_id: {_eq: $business_unit_id} }, order_by: { name: asc }) {
      id
      name
      sub_operation_count
    }
  }
`;

export const subOperationQuery = gql`
  query($operation_id: uuid) {
    sub_operation_project(where: { operation_id: {_eq: $operation_id} }, order_by: { name: asc }) {
      id
      name
      project_count
      risk_count
    }
  }
`;

export const projectQuery = gql`
  query($sub_operation_id: uuid) {
    project_risk(where: { sub_operation_id: {_eq: $sub_operation_id} }, order_by: { name: asc }) {
      id
      name
      risk_count
    }
  }
`;

export const riskListQuery = gql`
  subscription getList($risk_type: String, $sub_operation_id: uuid, $project_id: uuid, $business_unit_id: uuid!, $classification_id: uuid, $residual_impact_driver: String, $residual_vulnerability: String, $offset:Int , $limit: Int =10){
    risk_dashboard(
      where: {
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

export const riskMapQuery = gql`
  subscription getList($risk_type: String, $sub_operation_id: uuid, $project_id: uuid, $business_unit_id: uuid!) {
    risk_dashboard(where: {
      sub_operation_id: { _eq: $sub_operation_id },
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
