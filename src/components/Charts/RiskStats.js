import React from 'react';
import PropTypes from 'prop-types';
import {
  Label, PieChart, Pie, Cell,
} from 'recharts';
// import Card from 'react-md/lib/Cards/Card';
import MdGrid from 'react-md/lib/Grids/Grid';
import MdCell from 'react-md/lib/Grids/Cell';
import Legend from './Legend';

function RiskStats(props) {
  const {
    legend, data, title, filterFunc,
  } = props;
  const chartData = legend.map((e, idx) => ({
    ...e,
    value: data.filter(ee => filterFunc(ee, e)).length,
    key: idx,
  }));
  return (
    <div className="md-grid">
      <div className="md-cell md-cell--12">{title}</div>
      <div className="md-cell md-cell--6">
        <PieChart width={300} height={400}>
          <Pie
            data={chartData}
            cx={120}
            cy={200}
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            paddingAngle={0}
            dataKey="value"
          >
            {chartData.map(entry => (
              <Cell key={entry.key} fill={entry.color} />
            ))}
            <Label value={data.length} position="center" />
          </Pie>
        </PieChart>
      </div>
      <div className="md-cell md-cell--6">
        {chartData.map(e => (
          <Legend {...e} />
        ))}
      </div>
    </div>
  );
}

RiskStats.propTypes = {
  legend: PropTypes.arrayOf(PropTypes.shape({
    color: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  })).isRequired,
  data: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
  })).isRequired,
  title: PropTypes.string.isRequired,
  filterFunc: PropTypes.func.isRequired,
};

export default RiskStats;
