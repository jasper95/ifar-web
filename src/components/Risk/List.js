import React, { useState, useEffect } from 'react';
import Grid from 'react-md/lib/Grids/Grid';
import Button from 'react-md/lib/Buttons/Button';
import { useDispatch } from 'react-redux';
import { useCreateNode } from 'apollo/mutation';
import useQuery from 'apollo/query';
import gql from 'graphql-tag';
import Pagination from 'rc-pagination'
import { getImpactDriver } from 'lib/tools';
import QueryContext from './Context';
import RiskItem from './Item';
import 'sass/components/risk/index.scss';

export const businessUnitQuery = gql`
  query {
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

function RiskList(props) {
  const { riskListResponse } = props;
  const { data: { risk: list = [] } } = riskListResponse;
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1)
  const [currentBusinessUnit, setBusinessUnit] = useState('871637c4-5510-4500-8e78-984fce5001ff');
  const businessUnitResponse = useQuery(businessUnitQuery);
  const [, onCreateRisk] = useCreateNode({ node: 'risk', onSuccess: () => onSuccessMutation(true) });
  const [, onCreateRequest] = useCreateNode({ node: 'request', message: 'Request successfully sent' });
  const { data: { business_unit: businessUnits = [] } } = businessUnitResponse;
  const selected = businessUnits.find(e => e.id === currentBusinessUnit);
  useEffect(refreshList, [currentPage, currentBusinessUnit])
  return (
    <QueryContext.Provider value={{ createRequest: onCreateRequest }}>
      <Grid className="riskList">
        <div className="riskList_unitList">
          {businessUnits && businessUnits.map(e => (
            <Button
              flat
              className="riskList_unitList_item"
              onClick={() => changeBusinessUnit(e.id)}
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
            {list.map(risk => (
              <RiskItem
                previewProps={{ risk }}
                detailsProps={{ risk }}
                key={risk.id}
                className="riskList_risk_content_item"
              />
            ))}
            <Pagination
              onChange={onChangePagination}
              current={currentPage}
              pageSize={10}
              total={selected ? selected.risks_aggregate.aggregate.count : 0}
              hideOnSinglePage
            />
          </div>
        </div>
      </Grid>
    </QueryContext.Provider>
  );

  function refreshList() {
    riskListResponse.refetch({ id: currentBusinessUnit, offset: currentPage - 1 })
  }

  function onChangePagination(current, newPageSize) {
    setCurrentPage(newPageSize)
  }

  function onSuccessMutation(isCreate) {
    riskListResponse.refetch();
    if (isCreate) {
      businessUnitResponse.refetch();
    }
  }

  function changeBusinessUnit(id) {
    setBusinessUnit(id);
    riskListResponse.refetch({ id });
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
                business_unit_id: currentBusinessUnit,
                inherent_impact_driver: impactDriver,
                inherent_rating: data.impact_details.inherent[impactDriver],
              },
            });
          },
          initialFields: {
            basis: 'Frequency',
            inherent_likelihood: 1,
            impact_details: {},
          },
          dialogClassName: 'i_dialog_container--xl',
        },
      },
      type: 'SHOW_DIALOG',
    });
  }
}


export default RiskList;
