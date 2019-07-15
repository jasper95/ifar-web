import React from 'react';
import Cell from 'react-md/lib/Grids/Cell';
import PropTypes from 'prop-types';

function RiskInfo(props) {
  const { title, list, colspan } = props;
  return (
    <Cell size={colspan}>
      <h3>{title}</h3>
      <ul>
        {list.map(e => (
          <li key={e.id}>{e.name}</li>
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
