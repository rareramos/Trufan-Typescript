import React from 'react';
import PropTypes from 'prop-types';

import { Doughnut } from 'react-chartjs-2';

const Donut = ({ data }) => {
  const chartData = {
    labels: data.map(o => o.label),
    datasets: [
      {
        data: data.map(o => o.value.toString()),
        backgroundColor: data.map(o => o.color),
      },
    ],
  };

  return (
    <div style={{ width: 100, height: 100, marginTop: -5 }}>
      <Doughnut
        options={{
          maintainAspectRatio: false,
        }}
        height={100}
        width={100}
        legend={{ display: false }}
        data={chartData}
      />
    </div>
  );
};

Donut.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.objectOf({
      label: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
      color: PropTypes.string.isRequired,
    }),
  ),
};

export default Donut;
