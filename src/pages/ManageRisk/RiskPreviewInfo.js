import React from 'react';
import Cell from 'react-md/lib/Grids/Cell';
import PropTypes from 'prop-types';

function RiskPreviewInfo(props) {
  const { colspan, title, info } = props;
  return (
    <Cell size={colspan}>
      <h3>{title}</h3>
      <span>{info}</span>
    </Cell>
  );
}

RiskPreviewInfo.propTypes = {
  title: PropTypes.string.isRequired,
  info: PropTypes.string.isRequired,
  colspan: PropTypes.number.isRequired,
};


export default RiskPreviewInfo;
