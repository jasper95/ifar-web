import React from 'react';
import DataTable from 'components/DataTable';
import Toolbar from 'react-md/lib/Toolbars/Toolbar';
import Paper from 'react-md/lib/Papers/Paper';
import useTableSelect from 'lib/hooks/useTableSelect';
import Button from 'react-md/lib/Buttons/Button';
import { useDispatch } from 'react-redux';

function User() {
  const users = [
    {
      id: 1,
      full_name: 'Jasper Bernales',
      email: 'bernalesjasper@gmail.com',
      role: 'Administrator',
      srmp_units: 'RAFI, RMF',
    },
  ];
  const dispatch = useDispatch();
  const [selected, { onRowToggle }] = useTableSelect(users);
  return (
    <Paper>
      <Toolbar>
        {getToolbarActions()}
      </Toolbar>
      <DataTable
        selected={selected}
        onRowToggle={onRowToggle}
        rows={users}
        columns={getColumns()}
        isSelectable
      />
    </Paper>
  );

  function getToolbarActions() {
    return [
      <Button
        children="New"
        raised
        iconChildren="add"
        onClick={() => showDialog('Create User')}
      />,
      <Button
        children="Export"
        flat
      />,
      selected.length && (
        <Button
          children="Delete"
          raised
          iconChildren="delete"
        />
      ),
    ].filter(Boolean);
  }

  function showDialog(title, data = {}) {
    dispatch({
      type: 'SHOW_DIALOG',
      payload: {
        path: 'User',
        props: {
          title,
          initialFields: data,
        },
      },
    });
  }

  function getColumns() {
    return [
      {
        title: 'Full Name',
        accessor: 'full_name',
      },
      {
        title: 'Email',
        accessor: 'email',
      },
      {
        title: 'Role',
        accessor: 'role',
      },
      {
        title: 'SRMP Programs',
        accessor: 'srmp_units',
      },
      {
        type: 'actions',
        actions: [
          {
            icon: 'edit',
            label: 'Edit',
            onClick: row => showDialog('Edit User', row),
          },
          {
            icon: 'delete',
            label: 'Delete',
            onClick: row => showDialog('Edit User', row),
          },
        ],
      },
    ];
  }
}

export default User;
