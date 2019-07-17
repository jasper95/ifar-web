import React, { useState } from 'react';
import PropType from 'prop-types';
import Grid from 'react-md/lib/Grids/Grid';
import Cell from 'react-md/lib/Grids/Cell';
import Button from 'react-md/lib/Buttons/Button';
import Collapse from 'react-md/lib/Helpers/Collapse';
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
        className={ className+"_toggler" }
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        { isCollapsed 
          ? 'arrow_drop_up'
          : 'arrow_drop_down'
        }
      </Button>
      <RiskPreview
        className={ className+"_preview" }
        risk={risk}
      />
      <ExpansionPanel
        className={ className+"_expansion" }
        expanded={isCollapsed}
        footer={null}
        onExpandToggle={() => setIsCollapsed(!isCollapsed)}
      >
        <RiskDetails
          className={className+"_details" }
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
