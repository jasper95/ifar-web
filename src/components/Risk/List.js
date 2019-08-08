import React, { useState } from 'react';
import Grid from 'react-md/lib/Grids/Grid';
import Button from 'react-md/lib/Buttons/Button';
import { useDispatch } from 'react-redux';
import { useCreateNode } from 'apollo/mutation';
import gql from 'graphql-tag';
import Pagination from 'rc-pagination';
import { getImpactDriver } from 'lib/tools';
import useQuery from 'apollo/query';
import QueryContext from './Context';
import RiskItem from './Item';
import 'sass/components/risk/index.scss';

export const businessUnitQuery = gql`
  subscription {
    business_unit(order_by: {order: asc}) {
      id
      name
      risks_aggregate {
        aggregate {
          count
        }
      }
    }
  }
`;

export const riskDetailsFragment = gql`
  fragment RiskDetails on risk {
    causes
    classification {
      name
    }
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

export const riskListQuery = gql`
  subscription getList($business_unit_id: uuid!, $classification_id: uuid, $residual_impact_driver: String, $residual_vulnerability: String, $offset:Int , $limit: Int =10){
    risk(where: {business_unit_id: {_eq: $business_unit_id }, classification_id: { _eq: $classification_id }, residual_impact_driver: { _eq: $residual_impact_driver }, residual_vulnerability: { _eq: $residual_vulnerability } }, order_by: {created_date: desc}, offset: $offset, limit: $limit) @connection(key: "risk", filter: ["type"]) {
      ...RiskDetails
      business_unit {
        name
        id
      }
    }
  }
  ${riskDetailsFragment}
`;

function RiskList(props) {
  const {
    onChangeBusinessUnit, businessUnit, classification, impactDriver, residualVulnerability,
  } = props;
  console.log('residualVulnerability: ', residualVulnerability);
  const [currentPage, setCurrentPage] = useState(1);
  const variables = {
    business_unit_id: businessUnit,
    classification_id: classification,
    residual_impact_driver: impactDriver,
    residual_vulnerability: residualVulnerability,
    offset: currentPage - 1,
  };
  const riskListResponse = useQuery(riskListQuery,
    { ws: true, variables });
  const { data: { risk: list = [] }, loading: listIsLoading } = riskListResponse;
  const dispatch = useDispatch();
  const businessUnitResponse = useQuery(businessUnitQuery, { ws: true });
  const [, onCreateRisk] = useCreateNode({ node: 'risk' });
  const [, onCreateRequest] = useCreateNode({ node: 'request', message: 'Request successfully sent' });
  const { data: { business_unit: businessUnits = [] } } = businessUnitResponse;
  const selected = businessUnits.find(e => e.id === businessUnit);
  return (
    <QueryContext.Provider value={{ createRequest: onCreateRequest }}>
      <Grid className="riskList">
        <div className="riskList_unitList">
          {businessUnits && businessUnits.map(e => (
            <Button
              flat
              className="riskList_unitList_item"
              onClick={() => onChangeBusinessUnit(e.id)}
              iconBefore={false}
              children={e.name}
              key={e.id}
              iconEl={(
                <span className="riskList_unitList_item_badge">
                  {e.risks_aggregate.aggregate.count}
                </span>
              )}
            />
          ))}
        </div>

        <div className="riskList_risk">
          <div className="riskList_risk_header">
            <div className="crumb">
              <h1 className="crumb_main">
                <div className="text">
                  Strategic Risk Management Plan
                </div>
              </h1>
              <h1 className="crumb_sub">
                <div className="text">
                  {selected && selected.name}
                </div>
              </h1>
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
              onChange={(_, newPage) => setCurrentPage(newPage)}
              current={currentPage}
              pageSize={10}
              total={selected ? selected.risks_aggregate.aggregate.count : 0}
              hideOnSinglePage
            />
            {listIsLoading ? (
              <span>Loading...</span>
            ) : list.map(risk => (
              <RiskItem
                previewProps={{ risk }}
                detailsProps={{ risk }}
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
    </QueryContext.Provider>
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
              },
            });
          },
          initialFields: {
            basis: 'Frequency',
            inherent_likelihood: 1,
            impact_details: {},
            business_unit_id: businessUnit,
          },
          dialogClassName: 'i_dialog_container--xl',
        },
      },
      type: 'SHOW_DIALOG',
    });
  }
}


export default RiskList;
