import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from 'react-md/lib/Buttons/Button';
import { ExpansionPanel } from 'react-md';
import { useCreateNode, useUpdateNode } from 'apollo/mutation';
import RiskPreview from './Preview';
import RiskDetails from './Details';

function RiskItem(props) {
  const {
    className, previewRenderer: Preview,
    previewProps, detailsProps, style,
  } = props;
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [, onUpdateRisk] = useUpdateNode({ node: 'risk' });
  const [, onCreateRequest] = useCreateNode({ node: 'request', message: 'Request successfully sent' });
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
        onCreateRequest={onCreateRequest}
        onUpdateRisk={onUpdateRisk}
        {...previewProps}
      />
      <ExpansionPanel
        className={`${className}_expansion`}
        expanded={isCollapsed}
        footer={null}
      >
        <RiskDetails
          className={`${className}_details`}
          onCreateRequest={onCreateRequest}
          onUpdateRisk={onUpdateRisk}
          {...detailsProps}
        />
      </ExpansionPanel>
    </div>
  );
}

RiskItem.propTypes = {
  risk: PropTypes.object.isRequired,
  previewRenderer: PropTypes.func,
  onCollapse: PropTypes.func,
};


RiskItem.defaultProps = {
  previewRenderer: RiskPreview,
  onCollapse: () => {},
};

export default RiskItem;
