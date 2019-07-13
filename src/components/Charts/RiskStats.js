import React from 'react';
import PropTypes from 'prop-types';
import {
  Label, PieChart, Pie, Cell,
} from 'recharts';
import Card from 'react-md/lib/Cards/Card';
import Legend from './Legend';

function RiskStats(props) {
  const { legend, data, title } = props;
  const chartData = legend.map(e => ({
    ...e,
    value: data.filter(ee => ee.classification === e.classification),
  }));
  return (
    <Card>
      <div>{title}</div>
      <div>
        <PieChart width={800} height={400}>
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
              <Cell key={entry.classification} fill={entry.color} />
            ))}
            <Label value={data.length} position="center" />
          </Pie>
        </PieChart>
      </div>
      <div>
        {chartData.map(e => (
          <Legend key={e.classification} {...e} />
        ))}
      </div>
    </Card>
  );
}

RiskStats.propTypes = {
  legend: PropTypes.arrayOf(PropTypes.shape({
    color: PropTypes.string.isRequired,
    classification: PropTypes.string.isRequired,
  })).isRequired,
  data: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    classification: PropTypes.string.isRequired,
  })).isRequired,
  title: PropTypes.string.isRequired,
};

export default RiskStats;
