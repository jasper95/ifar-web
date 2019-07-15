import React from 'react'
import Grid from 'react-md/lib/Grids/Grid';
import Cell from 'react-md/lib/Grids/Cell';
import Button from 'react-md/lib/Buttons/Button';
import RiskPreviewInfo from './RiskPreviewInfo'

function RiskPreview(props) {
  const { risk } = props
  return (
    <Grid>
      <Cell size={6}>
        <Grid>
          <RiskPreviewInfo colspan={6} title='Classification' info={risk.classification}/>
          <RiskPreviewInfo colspan={6} title='Risk name' info={risk.name}/>
        </Grid>
      </Cell>
      <Cell size={6}>
        <Grid>
          <RiskPreviewInfo colspan={3} title='Inherent' info={risk.inherent_rating}/>
          <RiskPreviewInfo colspan={3} title='Residual' info={risk.residual_rating}/>
          <RiskPreviewInfo colspan={3} title='Target' info={risk.target_rating}/>
          <Cell size={3}>
            <Button icon>edit</Button>
            <Button icon>delete</Button>
          </Cell>
        </Grid>
      </Cell>
      <RiskPreviewInfo colspan={12} title='Definition' info={risk.definition}/>
    </Grid>
  );
}

export default RiskPreview