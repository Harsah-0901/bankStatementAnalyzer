import React, { useEffect, useState } from 'react';

export default function DescriptionTable() {
  const [descriptionData, setDescriptionData] = useState<any[]>([]);

  useEffect(() => {
    // Retrieve description summary from localStorage
    const storedData = localStorage.getItem('descriptionSummary');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      // Check if the data contains a valid 'data' field
      if (parsedData?.status === "success" && parsedData?.data) {
        setDescriptionData(parsedData.data); // Store it in state
      }
    }
  }, []);

  return (
    <div className="my-8">
      <h2 className="text-2xl font-semibold mb-4">Description Summary</h2>
      <table className="min-w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Description</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Total Amount</th>
          </tr>
        </thead>
        <tbody>
          {descriptionData.length > 0 ? (
            descriptionData.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                <td className="px-6 py-3 text-sm text-gray-800">{item.description}</td>
                <td className="px-6 py-3 text-sm text-gray-800">{item.total_amount}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={2} className="px-6 py-3 text-center text-sm text-gray-500 italic">No data available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
