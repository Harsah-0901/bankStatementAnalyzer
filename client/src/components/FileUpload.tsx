import React, { useState, ChangeEvent } from "react";
import axios from "axios";
import SummaryTable from "./SummaryTable";

interface Transaction {
  date: string;
  description: string;
  amount: number;
  type: string;
  category: string;
}

interface Summary {
  [key: string]: number;
}

const FileUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file first.");

    // Retrieve user_id from localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user?.id) {
      return alert("You must be logged in to upload a file.");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("user_id", user.id);  // Attach user_id from localStorage

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/upload", formData);
      setTransactions(res.data.transactions);
      setSummary(res.data.summary);
    } catch (err: any) {
      alert("Error: " + err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: "2rem" }}>
      <h2>Upload Bank Statement</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} style={{ marginLeft: "1rem" }}>
        Upload
      </button>

      {loading && <p>Processing file...</p>}

      {summary && (
        <>
          <h3>Spending Summary</h3>
          <SummaryTable data={summary} />

          <h3>All Transactions</h3>
          <table border="1" cellPadding="10">
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Amount (₹)</th>
                <th>Type</th>
                <th>Category</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn, index) => (
                <tr key={index}>
                  <td>{txn.date}</td>
                  <td>{txn.description}</td>
                  <td>{txn.amount}</td>
                  <td>{txn.type}</td>
                  <td>{txn.category}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default FileUpload;
