import React, { useContext } from 'react';
import pick from 'lodash/pick';
import useQuery, { useManualQuery } from 'apollo/query';
import AuthContext from 'apollo/AuthContext';
import { useDispatch } from 'react-redux';
import { useCreateNode, useUpdateNode, useDeleteNode } from 'apollo/mutation';


const withBasePage = params => (WrappedComponent) => {
  const {
    node,
    dataFormatter = e => e,
    pageName,
    dialogPath,
    listQuery,
    detailsQuery,
    dialogProps = {},
  } = params;
  function BasePage(props) {
    const dispatch = useDispatch();
    const { data: auth } = useContext(AuthContext);
    const { data: listData, refetch } = useQuery(listQuery,
      { variables: { user_id: auth && auth.id } });
    const [, detailsHandler] = useManualQuery(detailsQuery);
    const [, createNode] = useCreateNode({ node, callback: refetch });
    const [, updateNode] = useUpdateNode({ node, callback: refetch });
    const [, deleteNode] = useDeleteNode({ node, callback: refetch });
    return (
      <WrappedComponent
        onDelete={handleDelete}
        onGetList={refetch}
        onNew={handleNew}
        onEdit={handleEdit}
        rows={listData[node] || []}
        {...pick(params, ['pageName', 'node', 'dataPropKey'])}
        {...props}
      />
    );

    function handleNew() {
      dispatch({
        type: 'SHOW_DIALOG',
        payload: {
          path: dialogPath,
          props: {
            ...dialogProps,
            dialogId: dialogPath,
            title: `New ${pageName}`,
            onValid: (data) => {
              createNode({
                data: dataFormatter(data, 'SAVE_CREATE', { user: auth }),
              });
            },
          },
        },
      });
    }

    async function handleEdit(row) {
      const response = await detailsHandler.onQuery({ variables: { id: row.id } });
      const data = response[`${node}_by_pk`];
      if (data) {
        dispatch({
          type: 'SHOW_DIALOG',
          payload: {
            path: dialogPath,
            props: {
              ...dialogProps,
              title: `Edit ${pageName}`,
              initialFields: dataFormatter(data, 'EDIT', props),
              onValid: (updatedData) => {
                updateNode({
                  data: dataFormatter(updatedData, 'SAVE_EDIT', { user: auth }),
                });
              },
            },
          },
        });
      }
    }

    function handleDelete(data) {
      dispatch({
        type: 'SHOW_DIALOG',
        payload: {
          path: 'Confirm',
          props: {
            title: 'Confirm Delete',
            message: 'Do you want to delete this item?',
            onValid: () => {
              deleteNode({
                data,
              });
            },
          },
        },
      });
    }
  }

  BasePage.displayName = `withBasePage(${WrappedComponent.displayName
    || WrappedComponent.name
    || 'Component'})`;

  return BasePage;
};

export default withBasePage;
