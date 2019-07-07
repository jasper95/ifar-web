import { useContext } from 'react';
import pick from 'lodash/pick';
import { useAppData, useManualQuery } from 'apollo/query';
import AuthContext from 'apollo/AuthContext';
import { useCreateNode, useUpdateNode, useDeleteNode } from 'apollo/mutation';
import { useQuery } from 'react-apollo-hooks';

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
  const [, setAppData] = useAppData();
  const { data: auth } = useContext(AuthContext);
  const { data: listData, refetch } = useQuery(listQuery,
    { variables: { user_id: auth && auth.id } });
  const [, detailsHandler] = useManualQuery(detailsQuery);
  const [, createNode] = useCreateNode({ node, callback: refetch });
  const [, updateNode] = useUpdateNode({ node, callback: refetch });
  const [, deleteNode] = useDeleteNode({ node, callback: refetch });

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
    setAppData({
      dialog: {
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
      setAppData({
        dialog: {
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
    setAppData({
      dialog: {
        path: 'Confirm',
        props: {
          title: 'Confirm Delete',
          message: 'Do you want to delete this item?',
          onValid: () => {
            deleteNode({
              variables: { id: data.id },
            });
          },
        },
      },
    });
  }
}
