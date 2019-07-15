import React from 'react';
import Grid from 'react-md/lib/Grids/Grid';
import PropTypes from 'prop-types';
import Cell from 'react-md/lib/Grids/Cell';
import Button from 'react-md/lib/Buttons/Button';
import RiskPreviewInfo from './PreviewInfo';

function RiskPreview(props) {
  const { risk } = props;
  // console.log('RiskPreview', risk)
  return (
    <Grid>
      <Cell size={6}>
        <Grid>
          <RiskPreviewInfo colspan={6} title="Classification" info={risk.classification} />
          <RiskPreviewInfo colspan={6} title="Risk name" info={risk.name} />
        </Grid>
      </Cell>
      <Cell size={6}>
        <Grid>
          <RiskPreviewInfo colspan={3} title="Inherent" info={risk.inherent_rating} />
          <RiskPreviewInfo colspan={3} title="Residual" info={risk.residual_rating} />
          <RiskPreviewInfo colspan={3} title="Target" info={risk.target_rating} />
          <Cell size={3}>
            <Button icon>edit</Button>
            <Button icon>delete</Button>
          </Cell>
        </Grid>
      </Cell>
      <RiskPreviewInfo colspan={12} title="Definition" info={risk.definition} />
    </Grid>
  );
}

RiskPreview.propTypes = {
  risk: PropTypes.shape({
    classification: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    inherent_rating: PropTypes.number.isRequired,
    residual_rating: PropTypes.number.isRequired,
    target_rating: PropTypes.number.isRequired,
    definition: PropTypes.string.isRequired,
  }).isRequired,
};

export default RiskPreview;
