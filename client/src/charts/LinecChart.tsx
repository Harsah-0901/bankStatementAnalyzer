import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

export default function LinecChart() {
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedData = localStorage.getItem('transformedStatementData');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        const dataArray = Array.isArray(parsedData) ? parsedData : [parsedData];

        // Format the data: you can change "pv", "amount", or "total" as per your key
        const formatted = dataArray.map(item => ({
          name: item.name || item.category || 'Unknown',
          value: item.value ?? item.amount ?? item.total ?? 0
        }));

        console.log('Formatted LineChart data:', formatted);
        setChartData(formatted);
      } else {
        console.warn('No data in localStorage, using fallback data');
        setChartData([
          { name: 'Sample A', value: 2400 },
          { name: 'Sample B', value: 1398 },
          { name: 'Sample C', value: 9800 }
        ]);
      }
    } catch (err) {
      console.error('Error parsing transformedStatementData:', err);
      setChartData([
        { name: 'Sample A', value: 2400 },
        { name: 'Sample B', value: 1398 },
        { name: 'Sample C', value: 9800 }
      ]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return <div className="flex items-center justify-center h-full">Loading chart...</div>;
  }

  return (
    <div style={{ width: '100%', height: '400px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
