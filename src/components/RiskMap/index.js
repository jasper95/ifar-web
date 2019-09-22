import React from 'react';
import Button from 'react-md/lib/Buttons/Button';
import cn from 'classnames';
import Map from './Map';
import Categories from './Categories';

import 'sass/components/riskMap/index.scss';
// ================================
// for cssColorKey
// refer to 'sass/utils/_vars'
// line 98
// ================================

const Filters = ({ onChangeStage, currentStage }) => (
  <div className="riskMap_map_filter">
    <Button
      className={cn('iBttn', { active: currentStage === 'inherent' })}
      children="Inherent Risk Map"
      onClick={() => onChangeStage('inherent')}
    />
    <Button
      className={cn('iBttn', { active: currentStage === 'residual' })}
      children="Residual Risk Map"
      onClick={() => onChangeStage('residual')}
    />
    <Button
      className={cn('iBttn', { active: currentStage === 'target' })}
      children="Target Risk Map"
      onClick={() => onChangeStage('target')}
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
  const {
    currentStage, onChangeStage, risks, onChangeImpact, currentImpact,
  } = props;
  return (
    <div className="riskMap">
      <div className="riskMap_row">
        <div className="riskMap_legend">
          <Legend />
        </div>
        <div className="riskMap_map">
          <Filters onChangeStage={onChangeStage} currentStage={currentStage} />
          <Map risks={risks} currentStage={currentStage} />
        </div>
      </div>
      <div className="riskMap_categories">
        <Categories risks={risks} onChange={onChangeImpact} currentImpact={currentImpact} />
      </div>
    </div>
  );
}

export default RiskMap;
