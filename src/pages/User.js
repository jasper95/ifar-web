import React, { useMemo, useState, useCallback } from 'react';
import DataTable from 'components/DataTable';
import Toolbar from 'react-md/lib/Toolbars/Toolbar';
import useTableSelect from 'lib/hooks/useTableSelect';
import useTableSort from 'lib/hooks/useTableSort';
import Button from 'react-md/lib/Buttons/Button';
import { useDispatch } from 'react-redux';
import TextField from 'react-md/lib/TextFields/TextField';
import FontIcon from 'react-md/lib/FontIcons/FontIcon';
import useMutation, { useCreateNode, useUpdateNode } from 'apollo/mutation';
import gql from 'graphql-tag';
import useQuery from 'apollo/query';
import businessUnits from 'lib/constants/riskManagement/businessUnits';
import { exportCsv, getSortQuery } from 'lib/tools';
import debounce from 'lodash/debounce';

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
function User() {
  const [search, setSearch] = useState('');
  const [sort, onSort] = useTableSort({ initialSorted: 'email', sortable: ['email', 'full_name'] });
  const usersQuery = gql`
    subscription ($keyword: String) {
      user_dashboard (order_by: ${getSortQuery(sort)}, where: {_or: {full_name: {_ilike: $keyword}, email: {_ilike: $keyword}}}){
        id
        first_name
        last_name
        full_name
        role
        srmp_role
        srmp_business_units
        email
      }
    }
  `;
  const usersResponse = useQuery(usersQuery, { ws: true, variables: { keyword: search ? `%${search}%` : null } });
  const { data: { user_dashboard: users = [] }, loading: isLoading } = usersResponse;
  const rows = useMemo(() => users.map((e) => {
    const srmpRole = MANAGEMENT_ROLES.find(i => i.value === e.srmp_role);
    return {
      ...e,
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
  const debounceSearch = useCallback(debounce(onSearch, 1000), []);
  return (
    <div className="dbContainer">

      <div className="row-ToolbarHeader row-ToolbarHeader-floating">
        {renderToolbarHeader({ title: 'User Form', baseClass: 'ToolbarHeader' })}
      </div>

      <div className="row-Table row-Table-floating">
        <DataTable
          selected={selected}
          onRowToggle={onRowToggle}
          rows={rows}
          columns={getColumns()}
          isSelectable
          sort={sort}
          onSort={onSort}
          processing={isLoading}
        />
      </div>
    </div>
  );

  function renderToolbarHeader({ title, baseClass }) {
    return (
      <div className={`${baseClass} row`}>
        <div className={`${baseClass}_title`}>
          <h1 className="title">{title}</h1>
        </div>
        <div>
          <TextField
            leftIcon={(
              <FontIcon>search</FontIcon>
            )}
            onChange={debounceSearch}
          />
        </div>
        <div className={`${baseClass}_toolbar`}>
          <Toolbar>
            {getToolbarActions()}
          </Toolbar>
        </div>
      </div>
    );
  }

  function getToolbarActions() {
    return [
      <Button
        flat
        children="New"
        iconChildren="add"
        className="iBttn iBttn-green"
        onClick={() => showDialog('Create')}
      />,
      rows.length && (
        <Button
          flat
          iconChildren="archive"
          children="Export"
          className="iBttn iBttn-primary"
          onClick={() => exportCsv(rows, ['email', 'full_name', 'role', 'srmp_role_name', 'srmp_units'], 'users.csv')}
        />
      ),
      selected.length && (
        <Button
          flat
          children="Delete"
          iconChildren="delete"
          className="iBttn iBttn-error"
          onClick={() => confirmDelete(selected)}
        />
      ),
    ].filter(Boolean);
  }

  function onSearch(value) {
    setSearch(value);
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
        title: 'Email',
        accessor: 'email',
      },
      {
        title: 'Full Name',
        accessor: 'full_name',
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
