import React from 'react';
import Button from 'react-md/lib/Buttons/Button';
import Map from './Map';
import Categories from './Categories';

import 'sass/components/riskMap/index.scss';
// ================================
// for cssColorKey
// refer to 'sass/utils/_vars'
// line 98
// ================================
const mockRiskTypeMap = [
  {
    id: 1,
    icon: '',
    cssColorKey: 'management-action',
    label: 'Management Action',
  },
  {
    id: 2,
    icon: '',
    cssColorKey: 'finance',
    label: 'Finance',
  },
  {
    id: 3,
    icon: '',
    cssColorKey: 'reputation',
    label: 'Reputation',
  },
  {
    id: 4,
    icon: '',
    cssColorKey: 'operations',
    label: 'Operation',
  },
  {
    id: 5,
    icon: '',
    cssColorKey: 'health-safety-security',
    label: 'Health, Safety & Environment',
  },
  {
    id: 6,
    icon: '',
    cssColorKey: 'legal',
    label: 'Legal and Compliance',
  },
];

const Filters = () => (
  <div className="riskMap_map_filter">
    <Button
      className="iBttn"
      children="Inherent Risk Map"
    />
    <Button
      className="iBttn"
      children="Risidual Risk Map"
    />
    <Button
      className="iBttn"
      children="Target Risk Map"
    />
  </div>
);
const Legend = () => {
  const legend = [
    'Low',
    'Moderate',
    'High',
    'Critical',
  ];
  return (
    <>
      <h1 className="mapLegendHeader">
        Legend
      </h1>
      <ul className="mapLegend">
        {legend.map((name) => {
          const cname = 'mapLegend_item';
          const cnamekey = `${cname}-${name.toLowerCase()}`;
          return (
            <li className={`${cname} ${cnamekey}`}>
              <span className="circle" />
              <span className="label">{name}</span>
            </li>
          );
        })}
      </ul>
    </>
  );
};

function RiskMap(props) {
  return (
    <div className="riskMap">
      <div className="riskMap_row">
        <div className="riskMap_legend">
          <Legend />
        </div>
        <div className="riskMap_map">
          <Filters />
          <Map riskTypes={mockRiskTypeMap} />
        </div>
      </div>
      <div className="riskMap_categories">
        <Categories riskTypes={mockRiskTypeMap} />
      </div>
    </div>
  );
}

export default RiskMap;
