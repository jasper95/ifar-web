import React from 'react';
import Tooltip from 'rc-tooltip';
import 'rc-tooltip/assets/bootstrap_white.css';
import TooltipDetails from './TooltipDetails';

function MapItems(props) {
  return (
    <Tooltip
      placement="right"
      overlay={<TooltipDetails risk={props.risk} />}
      arrowContent={<div className="rc-tooltip-arrow-inner" />}
    >
      <div className={`riskCircle riskCircle-${props.impactDriver.replace('_', '-')}`}>
        {props.children}
      </div>
    </Tooltip>
  );
}

export default MapItems;
