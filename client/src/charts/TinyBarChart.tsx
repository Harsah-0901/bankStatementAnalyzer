import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Text
} from 'recharts';

const TinyBarChart = () => {
  const [chartData, setChartData] = useState([
    { name: 'Credit', count: 0 },
    { name: 'Debit', count: 0 },
  ]);

  useEffect(() => {
    const raw = localStorage.getItem('transactionCounts');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        const data = [
          { name: 'Credit', count: parsed.transaction_counts.credit || 0 },
          { name: 'Debit', count: parsed.transaction_counts.debit || 0 },
        ];
        setChartData(data);
      } catch (err) {
        console.error('Error parsing transactionCounts from localStorage:', err);
      }
    }
  }, []);

  return (
    <ResponsiveContainer width="70%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 14 }}
        />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Bar dataKey="count" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default TinyBarChart;
