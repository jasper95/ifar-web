import React from 'react';
import PropTypes from 'prop-types';
import {
  Label, PieChart, Pie, Cell,
} from 'recharts';
// import Card from 'react-md/lib/Cards/Card';
import MdGrid from 'react-md/lib/Grids/Grid';
import MdCell from 'react-md/lib/Grids/Cell';
import Legend from './Legend';

import 'sass/components/chartCard/index.scss';

function RiskStats(props) {
  const {
    legend, data, title, filterFunc,
  } = props;
  const chartData = legend.map((e, idx) => ({
    ...e,
    value: data.filter(ee => filterFunc(ee, e)).length,
    key: idx,
  }));

  const svgSize = 250;
  const pieSize = (svgSize / 2);
  const pieGutter = 20;
  const pieThickness = 20;

  return (
    <div className="chartCard">
      <h1 className="chartCard_header">{title}</h1>
      <div className="chartCard_content">
        <div className="chartCard_content_chart">
          <PieChart width={svgSize} height={svgSize}>
            <Pie
              data={chartData}
              cx={(svgSize / 2) - 5}
              cy={(svgSize / 2)}
              outerRadius={(pieSize - pieGutter)}
              innerRadius={((pieSize - pieGutter) - pieThickness)}
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
        <div className="chartCard_content_stats">
          {chartData.map(e => (
            <Legend
              itemClassName="chartCard_content_stats_item"
              {...e}
            />
          ))}
        </div>
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
