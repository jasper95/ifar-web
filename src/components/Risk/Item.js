import React, { useState } from 'react';
import PropType from 'prop-types';
import Button from 'react-md/lib/Buttons/Button';
import { ExpansionPanel } from 'react-md';

import RiskPreview from './Preview';
import RiskDetails from './Details';

function RiskItem(props) {
  const { risk, className } = props;
  const [isCollapsed, setIsCollapsed] = useState(false);
  return (
    <div className={className}>
      <Button
        icon
        flat
        className={`${className}_toggler`}
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        { isCollapsed
          ? 'arrow_drop_up'
          : 'arrow_drop_down'
        }
      </Button>
      <RiskPreview
        className={`${className}_preview`}
        risk={risk}
      />
      <ExpansionPanel
        className={`${className}_expansion`}
        expanded={isCollapsed}
        footer={null}
        onExpandToggle={() => setIsCollapsed(!isCollapsed)}
      >
        <RiskDetails
          className={`${className}_details`}
          risk={risk}
        />
      </ExpansionPanel>
    </div>
  );
}

RiskItem.propTypes = {
  risk: PropType.object.isRequired,
};

export default RiskItem;
