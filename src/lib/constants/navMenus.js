export default [
  {
    id: 1,
    path: '/',
    label: 'Home',
  },
  {
    id: 2,
    path: '/dashboard',
    label: 'Dashboard',
  },
  {
    id: 3,
    path: '/discussion',
    label: 'Discussion Board',
  },
  {
    id: 4,
    path: '/audit',
    label: 'Audit Observations',
  },
  {
    id: 5,
    path: '/actions',
    label: 'Manage Actions',
  },
  {
    id: 6,
    path: '/srmp',
    label: 'Risk Management',
    submenu: [
      {
        id: 7,
        path: '/srmp',
        label: 'Strategic Risk Management',
      },
      {
        id: 8,
        path: '/ormp',
        label: 'Operational Risk Management',
      },
      {
        id: 9,
        path: '/prmp',
        label: 'Project Risk Management',
      },
    ],
  },
];
