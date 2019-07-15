import React, { useState } from 'react';
import Grid from 'react-md/lib/Grids/Grid';
import Cell from 'react-md/lib/Grids/Cell';
import Button from 'react-md/lib/Buttons/Button';
import RiskPreview from './RiskPreview'
import RiskDetails from './RiskDetails'
// import RiskTable from './RiskTable'
// import RiskInfo from './RiskInfo'
// import RiskPreviewInfo from './RiskPreviewInfo'

export default function RiskItem(props) {
  const { risk } = props
  const [isCollapsed, setIsCollapsed] = useState(false);
  return (
    <Grid>
      <Cell size={1}>
        <Button onClick={() => setIsCollapsed(!isCollapsed)} icon>{isCollapsed ? 'arrow_down' : 'arrow_right'}</Button>
      </Cell>
      <Cell size={11}>
        <RiskPreview risk={risk}/>
        {!isCollapsed && <RiskDetails risk={risk} />}
      </Cell>
    </Grid>
  );
}


