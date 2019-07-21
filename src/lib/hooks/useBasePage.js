import { useContext } from 'react';
import pick from 'lodash/pick';
import useQuery, { useManualQuery } from 'apollo/query';
import { useDispatch } from 'react-redux';
import AuthContext from 'apollo/AuthContext';
import { useCreateNode, useUpdateNode, useDeleteNode } from 'apollo/mutation';


export default function useBasePage(params) {
  const {
    node,
    dataFormatter = e => e,
    pageName,
    dialogPath,
    listQuery,
    detailsQuery,
    dialogProps = {},
  } = params;
  const dispatch = useDispatch();
  const { data: auth } = useContext(AuthContext);
  const { data: listData, refetch } = useQuery(listQuery,
    { variables: { user_id: auth && auth.id } });
  const [, detailsHandler] = useManualQuery(detailsQuery);
  const [, createNode] = useCreateNode({ node, onSuccess: refetch });
  const [, updateNode] = useUpdateNode({ node, onSuccess: refetch });
  const [, deleteNode] = useDeleteNode({ node, onSuccess: refetch });

  const state = {
    rows: listData[node],
    ...pick(params, ['pageName', 'node', 'dataPropKey']),
  };
  const handlers = {
    onDelete: handleDelete,
    onGetList: refetch,
    onNew: handleNew,
    onEdit: handleEdit,
  };

  return [state, handlers];

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
              variables: { input: dataFormatter(data, 'SAVE_CREATE', { user: auth }) },
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
            initialFields: dataFormatter(data, 'EDIT', { user: auth }),
            onValid: (updatedData) => {
              updateNode({
                variables: { input: dataFormatter(updatedData, 'SAVE_EDIT', { user: auth }) },
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
