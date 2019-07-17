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
  const { risk } = props;
  const [isCollapsed, setIsCollapsed] = useState(false);
  return (
    <Grid>
      <ExpansionPanel>
        <RiskPreview risk={risk} />
        <RiskDetails risk={risk} />
      </ExpansionPanel>
      {/* <Cell size={1}>
        <Button onClick={() => setIsCollapsed(!isCollapsed)} icon>{isCollapsed ? 'arrow_down' : 'arrow_right'}</Button>
      </Cell> */}
    </Grid>
  );
}

RiskItem.propTypes = {
  risk: PropType.object.isRequired,
};

export default RiskItem;
