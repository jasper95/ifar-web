import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from 'react-md/lib/Buttons/Button';
import { ExpansionPanel } from 'react-md';
import RiskPreview from './Preview';
import RiskDetails from './Details';

function RiskItem(props) {
  const {
    className, previewRenderer: Preview,
    previewProps, detailsProps, style, onCollapse, isCollapsed,
  } = props;
  // const [isCollapsed, setIsCollapsed] = useState(false);
  useEffect(() => {
    console.log('did mount', isCollapsed);
  }, []);
  return (
    <div className={className} style={style}>
      <Button
        icon
        flat
        className={`${className}_toggler`}
        onClick={() => {
          // setIsCollapsed(!isCollapsed);
          onCollapse();
        }}
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
      {isCollapsed && (
        <RiskDetails
          className={`${className}_details`}
          {...detailsProps}
        />
      )}
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
