import React, { useState } from 'react';
import PropType from 'prop-types';
import Grid from 'react-md/lib/Grids/Grid';
import Cell from 'react-md/lib/Grids/Cell';
import Button from 'react-md/lib/Buttons/Button';
import RiskPreview from './RiskPreview';
import RiskDetails from './RiskDetails';

function RiskItem(props) {
  const { risk } = props;
  const [isCollapsed, setIsCollapsed] = useState(false);
  return (
    <Grid>
      <Cell size={1}>
        <Button onClick={() => setIsCollapsed(!isCollapsed)} icon>{isCollapsed ? 'arrow_down' : 'arrow_right'}</Button>
      </Cell>
      <Cell size={11}>
        <RiskPreview risk={risk} />
        {!isCollapsed && <RiskDetails risk={risk} />}
      </Cell>
    </Grid>
  );
}

RiskItem.propTypes = {
  risk: PropType.object.isRequired,
};

export default RiskItem;
