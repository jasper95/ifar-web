import React, { useState } from 'react';
import PropType from 'prop-types';
import Grid from 'react-md/lib/Grids/Grid';
import Cell from 'react-md/lib/Grids/Cell';
import Button from 'react-md/lib/Buttons/Button';
import Collapse from 'react-md/lib/Helpers/Collapse';
import RiskPreview from './Preview';
import RiskDetails from './Details';

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
        <Collapse collapsed={isCollapsed}>
          <RiskDetails risk={risk} />
        </Collapse>
      </Cell>
    </Grid>
  );
}

RiskItem.propTypes = {
  risk: PropType.object.isRequired,
};

export default RiskItem;
