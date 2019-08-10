import React from 'react';
import Grid from 'react-md/lib/Grids/Grid';
import PropTypes from 'prop-types';
import Cell from 'react-md/lib/Grids/Cell';
import Button from 'react-md/lib/Buttons/Button';
import RiskPreviewInfo from 'components/Risk/PreviewInfo';
import useMutation from 'apollo/mutation';
import RiskTable from 'components/Risk/Table';
import { useDispatch } from 'react-redux';

function RequestPreview(props) {
  const {
    request, className, risk,
  } = props;
  const dispatch = useDispatch();
  const [, onMutateRequest] = useMutation({});
  const { user } = request;
  return (
    <Grid className={`RiskPreview ${className}`}>
      <Grid>
        <RiskPreviewInfo
          colspan={3}
          title="Author"
          info={`${user.first_name} ${user.last_name}`}
        />
        <RiskPreviewInfo
          colspan={3}
          title="Unit"
          info={risk.business_unit.name}
        />
        <Cell
          size={1}
          offset={5}
          className="RiskInfo_cell RiskInfo_cell-actions"
        >
          <Button
            className="iBttn iBttn-primary"
            tooltipLabel="Add Comments"
            onClick={() => showDialog({ type: 'ADD_COMMENTS' })}
            icon
          >
            add
          </Button>
          <Button
            className="iBttn iBttn-success"
            onClick={() => showDialog({ type: 'ACCEPT_REQUEST' })}
            tooltipLabel="Accept Request"
            icon
          >
            check
          </Button>
          <Button
            className="iBttn iBttn-error"
            onClick={() => showDialog({ type: 'DECLINE_REQUEST' })}
            icon
            tooltipLabel="Decline Request"
          >
            remove
          </Button>
        </Cell>
      </Grid>
      <Grid>
        {request.type === 'DONE_TREATMENT_RISK' ? (
          <RiskTable
            title="Risk Treatment"
            rows={[request.treatment_details]}
            readOnly
            columns={[
              {
                accessor: 'strategy',
                title: 'Strategy',
              },
              {
                accessor: 'treatment',
                title: 'Existing action',
              },
              {
                accessor: 'kpi',
                title: 'KPI',
              },
              {
                accessor: 'team',
                title: 'Team',
              },
            ]}
          />
        ) : (
          <>

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
          </>
        )}
      </Grid>
    </Grid>
  );

  function showDialog({ type }) {
    if (type === 'ACCEPT_REQUEST') {
      dispatch({
        type: 'SHOW_DIALOG',
        payload: {
          path: 'Confirm',
          props: {
            title: 'Confirm Accept Request',
            message: 'Do you want to accept this request?',
            onValid: () => onMutateRequest({
              url: '/request/accept',
              data: request,
              message: 'Request successfully accepted',
            }),
          },
        },
      });
    } else if (type === 'DECLINE_REQUEST') {
      dispatch({
        type: 'SHOW_DIALOG',
        payload: {
          path: 'Confirm',
          props: {
            title: 'Confirm Decline Request',
            message: 'Do you want to decline this request?',
            onValid: () => onMutateRequest({
              url: '/request',
              method: 'DELETE',
              data: request,
              message: 'Request successfully declined',
            }),
          },
        },
      });
    } else if (type === 'ADD_COMMENTS') {
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
