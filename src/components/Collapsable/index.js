import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Paper from 'react-md/lib/Papers/Paper';
import Button from 'react-md/lib/Buttons/Button';

function Collapsable(props) {
  const {
    previewRenderer: Preview, detailsRenderer: Details, isCollapsed: isCollapsedProp,
  } = props;
  const [isCollapsed, setIsCollapsed] = useState(isCollapsedProp);
  return (
    <Paper>
      <Button onClick={() => setIsCollapsed(!isCollapsed)} icon>{isCollapsed ? 'arrow_down' : 'arrow_right'}</Button>
      <Preview />
      {!isCollapsed && <Details />}
    </Paper>
  );
}

Collapsable.propTypes = {
  previewRenderer: PropTypes.func.isRequired,
  detailsRenderer: PropTypes.func.isRequired,
  isCollapsed: PropTypes.bool,
};

Collapsable.defaultProps = {
  isCollapsed: true,
};

export default Collapsable;
