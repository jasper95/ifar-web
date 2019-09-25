import React from 'react';
import Tooltip from 'rc-tooltip';
import 'rc-tooltip/assets/bootstrap_white.css';
import TooltipDetails from './TooltipDetails';

function MapItems(props) {
  const {
    children, impactDriver, risk, currentStage,
  } = props;
  return (
    <Tooltip
      placement="right"
      overlay={<TooltipDetails risk={risk} currentStage={currentStage} />}
      arrowContent={<div className="rc-tooltip-arrow-inner" />}
    >
      <div className={`riskCircle riskCircle-${impactDriver.replace('_', '-')}`}>
        {children}
      </div>
    </Tooltip>
  );
}

export default MapItems;
