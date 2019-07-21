import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from 'react-md/lib/Buttons/Button';
import { ExpansionPanel } from 'react-md';
import RiskPreview from './Preview';
import RiskDetails from './Details';

function RiskItem(props) {
  const {
    className, previewRenderer: Preview,
    previewProps, detailsProps,
  } = props;
  const [isCollapsed, setIsCollapsed] = useState(false);
  return (
    <div className={className}>
      <Button
        icon
        flat
        className={`${className}_toggler`}
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        { isCollapsed
          ? 'arrow_drop_up'
          : 'arrow_drop_down'
        }
      </Button>
      <Preview
        className={`${className}_preview`}
        {...previewProps}
      />
      <ExpansionPanel
        className={`${className}_expansion`}
        expanded={isCollapsed}
        footer={null}
        onExpandToggle={() => setIsCollapsed(!isCollapsed)}
      >
        <RiskDetails
          className={`${className}_details`}
          {...detailsProps}
        />
      </ExpansionPanel>
    </div>
  );
}

RiskItem.propTypes = {
  risk: PropTypes.object.isRequired,
  previewRenderer: PropTypes.func,
};


RiskItem.defaultProps = {
  previewRenderer: RiskPreview,
};

export default RiskItem;
