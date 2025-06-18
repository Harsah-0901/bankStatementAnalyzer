import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28EFF', '#FF6C8B'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.7;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    percent > 0 ? (
      <text
        x={x}
        y={y}
        fill="white"
        fontSize={14}
        fontWeight="bold"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    ) : null
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
        localStorage.setItem('transformedStatementData', JSON.stringify(transformed));
        setData(transformed);
      }
    } catch (error) {
      console.error('Failed to load or parse statementData:', error);
    }
  }, []);

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip 
            formatter={(value, name) => [`₹${value.toFixed(2)}`, name]} 
            contentStyle={{ fontWeight: 'bold' }} 
          />
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={140}
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
