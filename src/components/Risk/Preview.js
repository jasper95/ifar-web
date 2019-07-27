import React, { useContext } from 'react';
import Grid from 'react-md/lib/Grids/Grid';
import PropTypes from 'prop-types';
import Cell from 'react-md/lib/Grids/Cell';
import Button from 'react-md/lib/Buttons/Button';
import { useDispatch } from 'react-redux';
import { getImpactDriver } from 'lib/tools';
import QueryContext from './Context';
import RiskPreviewInfo from './PreviewInfo';

function RiskPreview(props) {
  const { risk, className } = props;
  const context = useContext(QueryContext);
  const dispatch = useDispatch();
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
          <Button onClick={() => showDialog('edit')} icon>edit</Button>
          <Button onClick={() => showDialog('delete')} icon>delete</Button>
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

  function showDialog(action) {
    if (action === 'edit') {
      dispatch({
        type: 'SHOW_DIALOG',
        payload: {
          path: 'InherentRisk',
          props: {
            dialogId: 'InherentRisk',
            title: 'Inherent Risk',
            onValid: (data) => {
              const impactDriver = getImpactDriver(data.impact_details.inherent);
              const { previous_details: previousDetails = {} } = data;
              context.updateRisk({
                data: {
                  ...data,
                  inherent_impact_driver: impactDriver,
                  inherent_rating: data.impact_details.inherent[impactDriver],
                  previous_details: {
                    ...previousDetails,
                    inherent: {
                      likelihood: risk.inherent_likelihood,
                      rating: risk.inherent_rating,
                    },
                  },
                },
              });
            },
            initialFields: risk,
            dialogClassName: 'i_dialog_container--sm',
          },
        },
      });
    } else if (action === 'delete') {
      dispatch({
        type: 'SHOW_DIALOG',
        payload: {
          path: 'Confirm',
          props: {
            title: 'Confirm Delete',
            message: 'Do you want to delete this risk?',
            onValid: () => context.deleteRisk({ data: risk }),
          },
        },
      });
    }
  }
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
