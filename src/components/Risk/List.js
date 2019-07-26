import React, {
  useState, useRef, useCallback, useEffect,
} from 'react';
import Grid from 'react-md/lib/Grids/Grid';
import Button from 'react-md/lib/Buttons/Button';
import { useDispatch } from 'react-redux';
import { useCreateNode, useUpdateNode, useDeleteNode } from 'apollo/mutation';
import useQuery from 'apollo/query';
import gql from 'graphql-tag';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import List from 'react-virtualized/dist/commonjs/List';
import InfiniteLoader from 'react-virtualized/dist/commonjs/InfiniteLoader';
import WindowScroller from 'react-virtualized/dist/commonjs/WindowScroller';
import { CellMeasurer, CellMeasurerCache } from 'react-virtualized/dist/commonjs/CellMeasurer';
import QueryContext from './Context';
import RiskItem from './Item';
import 'sass/components/risk/index.scss';

export const riskListQuery = gql`
  query getList($id: uuid!, $offset:Int , $limit: Int =5){
    risk(where: {business_unit: {id: {_eq: $id }}}, order_by: {name: asc}, offset: $offset, limit: $limit) @connection(key: "risk", filter: ["type"]) {
      causes
      classification {
        name
      }
      classification_id
      current_treatments
      definition
      future_treatments
      id
      impact
      impacts
      inherent_rating
      likelihood
      name
      residual_rating
      stakeholders
      target_rating
      business_unit {
        name
        id
      }
    }
  }
`;

const businessUnitListQuery = `
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


function RiskList() {
  const [collapsedItems, setCollapsedItems] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const dispatch = useDispatch();
  const vlistCache = useRef(new CellMeasurerCache({
    fixedWidth: true,
    defaultHeight: 300,
  }));
  const [currentBusinessUnit, setBusinessUnit] = useState('871637c4-5510-4500-8e78-984fce5001ff');
  const riskListResponse = useQuery(riskListQuery, { variables: { id: currentBusinessUnit, offset: 0 }, fetchPolicy: 'cache-and-network' });
  const businessUnitListResponse = useQuery(businessUnitListQuery);
  const [, onCreate] = useCreateNode({ node: 'risk', onSuccess: onSuccessMutation });
  const [, onUpdate] = useUpdateNode({ node: 'risk', onSuccess: onSuccessMutation });
  const [, onDelete] = useDeleteNode({ node: 'risk', onSuccess: onSuccessMutation });
  const { data: { risk: list = [] } } = riskListResponse;
  const { data: { business_unit: businessUnits = [] } } = businessUnitListResponse;
  const rowRenderer = useCallback(rowItem, [list, collapsedItems]);
  useEffect(() => {
    vlistCache.current.clearAll();
  }, [list]);
  const selected = businessUnits.find(e => e.id === currentBusinessUnit);
  return (
    <QueryContext.Provider value={{ updateRisk: onUpdate, deleteRisk: onDelete }}>
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
            <InfiniteLoader
              isRowLoaded={isRowLoaded}
              loadMoreRows={loadMoreRows}
              threshold={1}
              rowCount={1000000}
            >
              {({ onRowsRendered, registerChild }) => (
                <WindowScroller>
                  {({ height, scrollTop }) => (
                    <AutoSizer disableHeight>
                      {({ width }) => (
                        <List
                          ref={registerChild}
                          autoHeight
                          rowCount={list.length}
                          width={width}
                          height={height}
                          deferredMeasurementCache={vlistCache.current}
                          rowHeight={vlistCache.current.rowHeight}
                          onRowsRendered={onRowsRendered}
                          rowRenderer={rowRenderer}
                          overscanRowCount={1}
                          scrollTop={scrollTop}
                        />
                      )}
                    </AutoSizer>
                  )}
                </WindowScroller>
              )}
            </InfiniteLoader>
          </div>
        </div>
      </Grid>
    </QueryContext.Provider>
  );

  function rowItem({
    index, parent, key, style,
  }) {
    const e = list[index];
    const isCollapsed = collapsedItems.includes(e.id);
    return (
      <CellMeasurer
        key={key}
        cache={vlistCache.current}
        parent={parent}
        columnIndex={0}
        rowIndex={index}
      >
        <RiskItem
          style={style}
          previewProps={{ risk: e }}
          detailsProps={{ risk: e }}
          key={e.id}
          onCollapse={() => {
            if (isCollapsed) {
              setCollapsedItems(prev => prev.filter(ee => ee !== e.id));
            } else {
              setCollapsedItems(prev => [...prev, e.id]);
            }
            vlistCache.current.clear(index);
          }}
          isCollapsed={isCollapsed}
          className="riskList_risk_content_item"
        />
      </CellMeasurer>
    );
  }

  function isRowLoaded({ index }) {
    return list.length > index;
  }

  function loadMoreRows() {
    if (!riskListResponse.loading && hasMore) {
      riskListResponse.fetchMore({
        variables: { offset: list.length },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult.risk.length) {
            setHasMore(false);
            return prev;
          }
          return {
            ...prev,
            risk: [...prev.risk, ...fetchMoreResult.risk],
          };
        },
      });
    }
  }

  function onSuccessMutation() {
    riskListResponse.refetch();
    businessUnitListResponse.refetch();
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
          onValid: data => onCreate({
            data: {
              ...data,
              business_unit_id: currentBusinessUnit,
              inherent_rating: 1,
            },
          }),
          initialFields: {
            likelihood: {
              basis: 'Frequency',
              rating: 1,
            },
            impact: {
              reputation: 1,
              financial: 1,
              legal_compliance: 1,
              operational: 1,
              health_safety_security: 1,
              management_action: 1,
            },
          },
          dialogClassName: 'i_dialog_container--sm',
        },
      },
      type: 'SHOW_DIALOG',
    });
  }
}


export default RiskList;
