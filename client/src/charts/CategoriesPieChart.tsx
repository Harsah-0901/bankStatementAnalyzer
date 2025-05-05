import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28EFF', '#FF6C8B'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const CategoriesPieChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('statementData');
      const parsed = stored ? JSON.parse(stored) : null;

      if (parsed && Array.isArray(parsed.data)) {
        const transformed = parsed.data.map(item => ({
          name: item.category_name,
          value: parseFloat(item.total_amount),
        }));
        console.log('Transformed chart data is :', transformed);
        localStorage.setItem('transformedStatementData', JSON.stringify(transformed));
        
        setData(transformed);
        
      }
    } catch (error) {
      console.error('Failed to load or parse statementData:', error);
    }
  }, []);

  return (
    <div style={{ width: '100%', height: 500 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CategoriesPieChart;
