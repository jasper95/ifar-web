import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from 'react-md/lib/Buttons/Button';
import { ExpansionPanel } from 'react-md';
import useRiskMutation from './useRiskMutation';
import RiskPreview from './Preview';
import RiskDetails from './Details';

function RiskItem(props) {
  const {
    className, previewRenderer: Preview, detailsRenderer: Details,
    previewProps, detailsProps, style, riskType,
  } = props;
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [, onMutateRisk] = useRiskMutation(riskType);
  return (
    <div className={className} style={style}>
      <Button
        icon
        className={`${className}_toggler`}
        onClick={() => {
          setIsCollapsed(!isCollapsed);
        }}
      >
        {isCollapsed
          ? 'arrow_drop_up'
          : 'arrow_drop_down'
        }
      </Button>
      <Preview
        className={`${className}_preview`}
        onMutateRisk={onMutateRisk}
        riskType
        {...previewProps}
      />
      <ExpansionPanel
        className={`${className}_expansion`}
        expanded={isCollapsed}
        footer={null}
      >
        <Details
          className={`${className}_details`}
          onMutateRisk={onMutateRisk}
          {...detailsProps}
        />
      </ExpansionPanel>
    </div>
  );
}

RiskItem.propTypes = {
  risk: PropTypes.object.isRequired,
  previewRenderer: PropTypes.func,
  detailsRenderer: PropTypes.func,
  onCollapse: PropTypes.func,
};


RiskItem.defaultProps = {
  previewRenderer: RiskPreview,
  onCollapse: () => {},
  detailsRenderer: RiskDetails,
};

export default RiskItem;
