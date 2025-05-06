import React, { useState, useEffect } from 'react';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function BarcChart() {
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Retrieve data from localStorage
    try {
      const storedData = localStorage.getItem('transformedStatementData');
      console.log('Raw data from localStorage:', storedData);
      
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        console.log('Parsed data:', parsedData);
        
        // Make sure we have an array to work with
        const dataArray = Array.isArray(parsedData) ? parsedData : [parsedData];
        
        // Ensure each item has a "pv" property
        const formattedData = dataArray.map(item => {
          // If the item already has a name and pv property, use it
          if (item.name && item.pv !== undefined) {
            return item;
          }
          
          // Otherwise, try to adapt the data structure
          // This assumes the first property is the name and the second is the value
          const keys = Object.keys(item);
          return {
            name: item.name || 'Unknown',
            pv: item[keys[1]] || 0
          };
        });
        
        console.log('Formatted data for chart:', formattedData);
        setChartData(formattedData);
      } else {
        // Use sample data if nothing in localStorage
        console.warn('No transformedData found in localStorage, using sample data');
        setChartData([
          { name: 'Sample A', pv: 2400 },
          { name: 'Sample B', pv: 1398 },
          { name: 'Sample C', pv: 9800 }
        ]);
      }
    } catch (error) {
      console.error('Error retrieving data from localStorage:', error);
      // Use sample data if there's an error
      setChartData([
        { name: 'Sample A', pv: 2400 },
        { name: 'Sample B', pv: 1398 },
        { name: 'Sample C', pv: 9800 }
      ]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return <div className="flex items-center justify-center h-full">Loading chart data...</div>;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        width={500}
        height={300}
        data={chartData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar 
          dataKey="pv" 
          fill="#8884d8" 
          activeBar={<Rectangle fill="pink" stroke="blue" />} 
        />
      </BarChart>
    </ResponsiveContainer>
  );
}