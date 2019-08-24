import React, { useMemo } from 'react';
import DataTable from 'components/DataTable';
import Toolbar from 'react-md/lib/Toolbars/Toolbar';
import Paper from 'react-md/lib/Papers/Paper';
import useTableSelect from 'lib/hooks/useTableSelect';
import Button from 'react-md/lib/Buttons/Button';
import { useDispatch } from 'react-redux';
import useMutation, { useCreateNode, useUpdateNode } from 'apollo/mutation';
import gql from 'graphql-tag';
import useQuery from 'apollo/query';
import businessUnits from 'lib/constants/riskManagement/businessUnits';
import { exportCsv } from 'lib/tools';

export const USER_ROLES = [
  {
    value: 'ADMIN',
    label: 'Administrator',
  },
  {
    value: 'USER',
    label: 'User',
  },
];

export const MANAGEMENT_ROLES = [
  {
    value: 'RISK_CHAMPION',
    label: 'Risk Champion',
  },
  {
    value: 'TEAM_LEADER',
    label: 'Team Leader',
  },
  {
    value: 'TEAM_MANAGER',
    label: 'Team Manager',
  },
  {
    value: 'VIEW_COMMENT',
    label: 'View and Comment',
  },
];

const usersQuery = gql`
  subscription {
    user {
      id
      first_name
      last_name
      role
      srmp_role
      srmp_business_units
      email
    }
  }
`;

function User() {
  const usersResponse = useQuery(usersQuery, { ws: true });
  const { data: { user: users = [] }, loading: isLoading } = usersResponse;
  const rows = useMemo(() => users.map((e) => {
    const srmpRole = MANAGEMENT_ROLES.find(i => i.value === e.srmp_role);
    return {
      ...e,
      full_name: `${e.first_name} ${e.last_name}`,
      role_name: USER_ROLES.find(i => i.value === e.role).label,
      srmp_role_name: srmpRole ? srmpRole.label : '',
      srmp_units: e.srmp_business_units.map(i => businessUnits.find(j => i === j.id)).map(j => j.name).join(', '),
    };
  }), [users]);
  const [selected, { onRowToggle, setSelected }] = useTableSelect(rows);
  const [, onCreateUser] = useCreateNode({ node: 'user' });
  const [, onUpdateUser] = useUpdateNode({ node: 'user' });
  const [, onDelete] = useMutation({ url: '/user/bulk', method: 'DELETE', onSuccess: () => setSelected([]) });
  const dispatch = useDispatch();
  return (
    <div className="dbContainer">
      <div className="row-ToolbarHeader row-ToolbarHeader-floating">
        <h1>
          User Forms
        </h1>
        <Toolbar>
          {getToolbarActions()}
        </Toolbar>
      </div>
      <div className="row-Table">
        <DataTable
          selected={selected}
          onRowToggle={onRowToggle}
          rows={rows}
          columns={getColumns()}
          isSelectable
        />
      </div>
    </div>
  );

  function getToolbarActions() {
    return [
      <Button
        children="New"
        raised
        iconChildren="add"
        onClick={() => showDialog('Create')}
      />,
      rows.length && (
        <Button
          children="Export"
          flat
          onClick={() => exportCsv(rows, ['email', 'full_name', 'role', 'srmp_role_name', 'srmp_units'], 'users.csv')}
        />
      ),
      selected.length && (
        <Button
          children="Delete"
          raised
          iconChildren="delete"
          onClick={() => confirmDelete(selected)}
        />
      ),
    ].filter(Boolean);
  }

  function showDialog(type, initialFields = {}) {
    const onSave = type === 'Create' ? onCreateUser : onUpdateUser;
    dispatch({
      type: 'SHOW_DIALOG',
      payload: {
        path: 'User',
        props: {
          title: `${type} User`,
          initialFields,
          onValid: (data) => {
            onSave({
              data,
            });
          },
        },
      },
    });
  }

  function confirmDelete(ids) {
    dispatch({
      type: 'SHOW_DIALOG',
      payload: {
        path: 'Confirm',
        props: {
          title: 'Confirm Delete',
          message: 'Do you want to delete selected record(s)?',
          onValid: () => onDelete({ data: { ids }, message: 'Record(s) successfully deleted' }),
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
        accessor: 'role_name',
      },
      {
        title: 'SRMP Role',
        accessor: 'srmp_role_name',
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
            onClick: row => showDialog('Edit', row),
          },
          {
            icon: 'delete',
            label: 'Delete',
            onClick: row => confirmDelete([row.id]),
          },
        ],
      },
    ];
  }
}

export default User;
