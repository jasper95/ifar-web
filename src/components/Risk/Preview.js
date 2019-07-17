import React from 'react';
import Grid from 'react-md/lib/Grids/Grid';
import PropTypes from 'prop-types';
import Cell from 'react-md/lib/Grids/Cell';
import Button from 'react-md/lib/Buttons/Button';
import RiskPreviewInfo from './PreviewInfo';

function RiskPreview(props) {
  const { risk, className } = props;
  // console.log('RiskPreview', risk)
  return (
    <Grid className={`RiskPreview ${className}`}>
      <Grid>
        <RiskPreviewInfo
          colspan={3}
          title="Classification"
          info={risk.classification.name}
        />
        <RiskPreviewInfo
          colspan={3}
          title="Risk name"
          info={risk.name}
        />
        <Cell size={5} className="RiskInfo_cell RiskInfo_cell-ratings">
          <RiskPreviewInfo colspan={4} title="Inherent" info={risk.inherent_rating} />
          <RiskPreviewInfo colspan={4} title="Residual" info={risk.residual_rating} />
          <RiskPreviewInfo colspan={4} title="Target" info={risk.target_rating} />
        </Cell>
        <Cell size={1} className="RiskInfo_cell RiskInfo_cell-actions">
          <Button icon>edit</Button>
          <Button icon>delete</Button>
        </Cell>
      </Grid>
      <Grid>
        <RiskPreviewInfo
          colspan={12}
          title="Definition"
          info={risk.definition}
        />
      </Grid>
    </Grid>
  );
}

RiskPreview.propTypes = {
  risk: PropTypes.shape({
    classification: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    inherent_rating: PropTypes.number.isRequired,
    residual_rating: PropTypes.number.isRequired,
    target_rating: PropTypes.number.isRequired,
    definition: PropTypes.string.isRequired,
  }).isRequired,
};

export default RiskPreview;
