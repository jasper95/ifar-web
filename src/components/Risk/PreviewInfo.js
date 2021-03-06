import React from 'react';
import Cell from 'react-md/lib/Grids/Cell';
import PropTypes from 'prop-types';

function RiskPreviewInfo(props) {
  const {
    colspan, title, info, className, onClick,
  } = props;
  const labelKey = title.toLowerCase().replace(/ /g, '-');
  const uniqueItemClassName = `RiskInfo_cell-${labelKey}`;

  return (
    <Cell size={colspan} className={`RiskInfo_info RiskInfo_cell ${uniqueItemClassName} ${className || ''}`}>
      <h3 className="RiskInfo_info_label">{title}</h3>
      <span tabIndex={0} onKeyPress={() => {}} role="button" onClick={onClick} className="RiskInfo_info_info">{info}</span>
    </Cell>
  );
}

RiskPreviewInfo.propTypes = {
  title: PropTypes.string.isRequired,
  info: PropTypes.string.isRequired,
  colspan: PropTypes.number.isRequired,
};


export default RiskPreviewInfo;
