import React from 'react';
import { Line } from 'react-chartjs-2';

export default ({ data }) => {
  const graphData = {
    labels: data.horizontalLabels,
    datasets: data.sets.map(({ label, values: data, color }) => ({
      label,
      data,
      borderColor: color,

      pointBackgroundColor: color,
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 5,

      pointHoverBackgroundColor: color,
      pointHoverBorderColor: '#fff',
      pointHoverBorderWidth: 3,
      pointHoverRadius: 7,

      pointHitRadius: 10,

      fill: false,
      lineTension: 0.3,
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
    })),
  };

  const options = {
    scales: {
      xAxes: [
        {
          gridLines: {
            display: false,
            drawBorder: false,
          },
        },
      ],
      yAxes: [
        {
          ticks: {
            stepSize: 25,
            beginAtZero: true,
          },
          gridLines: {
            color: '#F2F2F2',
            drawBorder: false,
          },
        },
      ],
    },
  };

  return (
    <Line data={graphData} options={options} legend={{ display: false }} />
  );
};
