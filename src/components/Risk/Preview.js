import React from 'react';
import Grid from 'react-md/lib/Grids/Grid';
import PropTypes from 'prop-types';
import Cell from 'react-md/lib/Grids/Cell';
import Button from 'react-md/lib/Buttons/Button';
import omit from 'lodash/omit';
import { useDispatch } from 'react-redux';
import { getImpactDriver, getRecentChanges } from 'lib/tools';
import pick from 'lodash/pick';
import RiskPreviewInfo from './PreviewInfo';

function RiskPreview(props) {
  const {
    risk, className, readOnly, onMutateRisk,
  } = props;
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
        {!readOnly && (
          <Cell size={1} className="RiskInfo_cell RiskInfo_cell-actions">
            <Button onClick={() => showDialog('copy')} tooltipLabel="Copy" icon>insert_drive_file</Button>
            <Button onClick={() => showDialog('edit')} tooltipLabel="Edit" icon>edit</Button>
            <Button onClick={() => showDialog('delete')} tooltipLabel="Delete" icon>delete</Button>
          </Cell>
        )}
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
    const { previous_details: previousDetails = {} } = risk;
    if (action === 'edit') {
      dispatch({
        type: 'SHOW_DIALOG',
        payload: {
          path: 'InherentRisk',
          props: {
            dialogId: 'InherentRisk',
            title: 'Inherent Risk',
            onValid: onValidInherentRisk,
            initialFields: {
              ...risk,
              tracked_diff: pick(risk, 'causes', 'impacts', 'stakeholders'),
              current_stage_impact_details: risk.impact_details && { ...risk.impact_details.inherent },
              previous_details: {
                ...previousDetails,
                basis: risk.basis,
              },
            },
            dialogClassName: 'i_dialog_container--lg',
          },
        },
      });
    } else if (action === 'delete') {
      dispatch({
        type: 'SHOW_DIALOG',
        payload: {
          path: 'Confirm',
          props: {
            title: 'Delete Risk',
            message: 'Do you want to delete this record?',
            onValid: () => onMutateRisk({
              data: risk,
              action: 'DELETE',
            }),
          },
        },
      });
    } else if (action === 'copy') {
      dispatch({
        type: 'SHOW_DIALOG',
        payload: {
          path: 'CopyRisk',
          props: {
            dialogId: 'CopyRisk',
            title: 'Copy Risk',
            onValid: data => onMutateRisk({
              data: omit(data, 'id'),
              action: 'COPY',
            }),
            initialFields: {
              ...risk,
              business_unit_id: '',
            },
          },
        },
      });
    }
  }
  function onValidInherentRisk(data) {
    const impactDriver = getImpactDriver(data.impact_details.inherent);
    const { tracked_diff: trackedDiff } = data;
    const recentChanges = getRecentChanges(trackedDiff, data, ['impacts', 'causes', 'stakeholders']);
    const newData = {
      ...data,
      recent_changes: recentChanges,
      inherent_impact_driver: impactDriver,
      inherent_rating: data.impact_details.inherent[impactDriver],
      previous_details: {
        ...data.previous_details,
        inherent: {
          likelihood: risk.inherent_likelihood,
          rating: risk.inherent_rating,
        },
      },
    };
    onMutateRisk({
      data: newData,
      action: 'EDIT',
    });
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
