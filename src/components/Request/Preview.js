import React, { useContext } from 'react';
import Grid from 'react-md/lib/Grids/Grid';
import PropTypes from 'prop-types';
import Cell from 'react-md/lib/Grids/Cell';
import Button from 'react-md/lib/Buttons/Button';
// import { useDispatch } from 'react-redux';
// import QueryContext from 'components/Risk/Context';
import RiskPreviewInfo from 'components/Risk/PreviewInfo';

function RequestPreview(props) {
  const { request, className } = props;
  const { risk } = request;
  // const context = useContext(QueryContext);
  // const dispatch = useDispatch();
  return (
    <Grid className={`RiskPreview ${className}`}>
      <Grid>
        <RiskPreviewInfo
          colspan={3}
          title="Author"
          info="Ian Earl Bantillan"
        />
        <RiskPreviewInfo
          colspan={3}
          title="Unit"
          info="RMF"
        />
      </Grid>
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
          <Button
            className='iBttn iBttn-primary' 
            onClick={() => {}} icon>add</Button>
          <Button
            className='iBttn iBttn-success' 
            onClick={() => {}} icon>check</Button>
          <Button
            className='iBttn iBttn-error' 
            onClick={() => {}} icon>remove</Button>
        </Cell>
      </Grid>
    </Grid>
  );
}

RequestPreview.propTypes = {
  risk: PropTypes.shape({
    classification: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    inherent_rating: PropTypes.number.isRequired,
    residual_rating: PropTypes.number.isRequired,
    target_rating: PropTypes.number.isRequired,
    definition: PropTypes.string.isRequired,
  }).isRequired,
};

export default RequestPreview;
