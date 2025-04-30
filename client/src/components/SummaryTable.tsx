import React from "react";

interface Summary {
  [key: string]: number;
}

interface SummaryTableProps {
  data: Summary;
}

const SummaryTable: React.FC<SummaryTableProps> = ({ data }) => {
  return (
    <table border="1" cellPadding="10">
      <thead>
        <tr>
          <th>Category</th>
          <th>Amount Spent (₹)</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(data).map(([category, amount]) => (
          <tr key={category}>
            <td>{category}</td>
            <td>{amount.toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SummaryTable;
