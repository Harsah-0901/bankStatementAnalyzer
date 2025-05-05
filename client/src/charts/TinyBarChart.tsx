import React, { PureComponent } from 'react';
import { BarChart, Bar, ResponsiveContainer } from 'recharts';

const data = [
  {
    name: 'Page A',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Page B',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  
];

export default class TinyBarChart extends PureComponent {
  static demoUrl = 'https://codesandbox.io/p/sandbox/tiny-bar-chart-xzyy8g';

  render() {
    return (
      <ResponsiveContainer width="70%" height="70%">
        <BarChart width={80} height={40} data={data}>
          <Bar dataKey="uv" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    );
  }
}