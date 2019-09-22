import React from 'react';
import Grid from 'react-md/lib/Grids/Grid';
import PropTypes from 'prop-types';
import Cell from 'react-md/lib/Grids/Cell';
import Button from 'react-md/lib/Buttons/Button';
import omit from 'lodash/omit';
import { useDispatch } from 'react-redux';
import { getImpactDriver, getRecentChanges } from 'lib/tools';
import pick from 'lodash/pick';
import classifications from 'lib/constants/riskManagement/classifications';
import RiskPreviewInfo from './PreviewInfo';
import cn from 'classnames';

function RiskPreview(props) {
  const {
    risk, className, readOnly, onMutateRisk,
  } = props;
  const dispatch = useDispatch();
  const inherentCalc = risk.inherent_rating * risk.inherent_likelihood;
  const residualCalc = risk.residual_rating * risk.residual_likelihood;
  const targetCalc = risk.target_rating * risk.target_likelihood;
  const status = [
    risk.has_treatment_request && 'Treatment',
    risk.has_inherent_request && 'Edit',
    risk.has_delete_request && 'Delete',
  ].filter(Boolean);

  // para mu error migo
  const isPending = true

  return (
    <Grid className={`RiskPreview ${className}`}>
      <Grid>
        <RiskPreviewInfo
          colspan={3}
          title="Classification"
          info={classifications.find(e => e.id === risk.classification_id).name}
        />
        <RiskPreviewInfo
          colspan={3}
          title="Risk name"
          info={risk.name}
        />
        <Cell size={5} className="RiskInfo_cell RiskInfo_cell-ratings">
          <RiskPreviewInfo colspan={4} title="Inherent" info={!Number.isNaN(inherentCalc) ? inherentCalc : ''} />
          <RiskPreviewInfo colspan={4} title="Residual" info={!Number.isNaN(residualCalc) ? residualCalc : ''} />
          <RiskPreviewInfo colspan={4} title="Target" info={!Number.isNaN(targetCalc) ? targetCalc : ''} />
        </Cell>
        <Cell size={1} className="RiskInfo_cell RiskInfo_cell-actions">
          <Button onClick={() => showDialog('comments')} tooltipLabel="Discussions" icon>message</Button>
          {!readOnly && (
            <>
              <Button onClick={() => showDialog('copy')} tooltipLabel="Copy" icon>insert_drive_file</Button>
              <Button
                onClick={() => showDialog('edit')}
                tooltipLabel={risk.has_inherent_request ? 'Edit Request Sent' : 'Edit'}
                disabled={risk.has_inherent_request}
                icon
                children="edit"
              />
              <Button
                onClick={() => showDialog('delete')}
                tooltipLabel={risk.has_delete_request ? 'Delete Request Sent' : 'Delete'}
                disabled={risk.has_delete_request}
                tooltipLabel="Delete"
                icon
                children="delete"
              />
            </>
          )}
        </Cell>
      </Grid>
      <Grid>
        <RiskPreviewInfo
          colspan={6}
          title="Definition"
          info={risk.definition}
        />
        {(status.length > 0) && (
          <RiskPreviewInfo
            colspan={6}
            title="Pending Requests"
            info={status.join(', ')}
            className={cn('text-c-error',{'isPending': isUrgent })}
          />
        )}
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
    } else if (action === 'comments') {
      dispatch({
        type: 'SHOW_DIALOG',
        payload: {
          path: 'Comments',
          props: {
            title: 'Comments',
            dialogId: 'Comments',
            risk,
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
      action: 'EDIT_INHERENT',
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
