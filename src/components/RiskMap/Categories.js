import React from 'react';
import Button from 'react-md/lib/Buttons/Button';

const impactDrivers = [
  {
    id: 1,
    icon: '',
    cssColorKey: 'management-action',
    impact: 'management_action',
    label: 'Management Action',
  },
  {
    id: 2,
    icon: '',
    cssColorKey: 'finance',
    impact: 'financial',
    label: 'Finance',
  },
  {
    id: 3,
    icon: '',
    cssColorKey: 'reputation',
    impact: 'reputation',
    label: 'Reputation',
  },
  {
    id: 4,
    icon: '',
    cssColorKey: 'operations',
    impact: 'operations',
    label: 'Operation',
  },
  {
    id: 5,
    icon: '',
    impact: 'health_safety_security',
    cssColorKey: 'health-safety-security',
    label: 'Health, Safety & Environment',
  },
  {
    id: 6,
    icon: '',
    cssColorKey: 'legal',
    impact: 'legal_compliance',
    label: 'Legal and Compliance',
  },
];

function Categories({ onChange, currentImpact }) {
  return (
    <div className="mapCategories">
      { impactDrivers.map(e => (
        <Button
          key={e.id}
          className={`iBttn iBttn-rafi-${e.cssColorKey}`}
          onClick={() => onChange(e.impact)}
        >
          {e.label}
        </Button>
      ))}
    </div>
  );
}

export default Categories;
