import React, { useState } from 'react';
// import Grid from 'react-md/lib/Grids/Grid';
// import Cell from 'react-md/lib/Grids/Cell';
// import Button from 'react-md/lib/Buttons/Button';
import Card from 'react-md/lib/Cards/Card';
import RiskItem from 'components/Risk/Item';
// import Collapse from 'react-md/lib/Helpers/Collapse';
// import RiskPreview from 'components/Risk/RiskPreview';

function RequestItem(props) {
  const { request } = props;
  const { risk } = request;
  // const [isCollapsed, setIsCollapsed] = useState(false);
  return (
    <Card>
      <h2>Treatment Request</h2>
      <RiskItem risk={risk} />
    </Card>
  );
}

export default RequestItem;
