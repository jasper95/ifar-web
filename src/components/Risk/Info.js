import React from 'react';
import Cell from 'react-md/lib/Grids/Cell';
import PropTypes from 'prop-types';

function RiskInfo(props) {
  const {
    colspan, title, list,
  } = props;

  const labelKey = title.toLowerCase().replace(/ /g, '-');
  const uniqueItemClassName = `RiskInfo_cell-${labelKey}`;

  return (
    <Cell size={colspan} className={`RiskInfo_info RiskInfo_cell ${uniqueItemClassName}`}>
      <h3 className="RiskInfo_info_label">{title}</h3>
      <ul className="RiskInfo_info_list">
        {list.map(({ action = '', id, name }) => (
          <li
            key={id}
            className={`RiskInfo_info_list_item ${action}`}
          >
            <span className="text">
              {name}
            </span>
            { true && (
              <span className="status">
                new
              </span>
            )}
          </li>
        ))}
      </ul>
    </Cell>
  );
}

RiskInfo.propTypes = {
  title: PropTypes.string.isRequired,
  list: PropTypes.array.isRequired,
  colspan: PropTypes.number.isRequired,
};


export default RiskInfo;
