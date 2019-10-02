import React from 'react';
import withDialog from 'lib/hocs/dialog';
import flowRight from 'lodash/flowRight';
import { impactDrivers } from 'components/RiskMap/Categories';
// import impactDriverLegend from 'lib/constants/riskManagement/impactDriverLegend';

function RatingDetails(props) {
  const { risk, stage } = props;
  let { reason = {}, impact_details: impact = {} } = risk;
  ({ [stage]: reason = {} } = reason);
  ({ [stage]: impact = {} } = impact);
  return (
    <div className='RatingDetails'>
      {impactDrivers.map(({ label, impact: key }) => (
        <div className='RatingDetails_item'>
          <h3 className='RatingDetails_item_header'>{label}</h3>
          <div className="row">
            <div className='col col-md-2 RatingDetails_item_rating'>
              <span className='label'>Rating</span>
              <span className='value'>{ impact[key] ? impact[key] : '0'  }</span>
            </div>
            <div className='col col-md-10 RatingDetails_item_reason'>
              <span className='label'>Reason:</span>
              <span className='value'>{reason[key] ? reason[key] : 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Qui dolores, praesentium voluptate aliquid quos maxime autem laboriosam sed vitae voluptatum eaque repellendus similique omnis dolorum?' }</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

const Dialog = flowRight(
  withDialog(),
)(RatingDetails);

Dialog.defaultProps = {
  dialogActionsRenderer: () => null,
};

export default Dialog;
