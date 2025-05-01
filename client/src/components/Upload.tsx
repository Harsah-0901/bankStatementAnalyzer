import React, { useState } from "react";
import api from "../api/axios";

export default function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [statementName, setStatementName] = useState("");

  const handleUpload = async () => {
    if (!file) return alert("Select a file");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("statement_name", statementName);

    try {
      const res = await api.post("/upload", formData);
      alert("Uploaded & processed successfully");
      console.log(res.data);
    } catch (err: any) {
      alert(err.response.data.error);
    }
  };
  const handleLogout = () => {
      localStorage.removeItem("token");
      window.location.reload(); // or navigate to login page
    };

  return (
    <div>
      <h2>Upload Statement</h2>
      <input type="text" placeholder="Statement Name" onChange={(e) => setStatementName(e.target.value)} />
      <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      <button onClick={handleUpload}>Upload</button>
      <button onClick={handleLogout}>Logout</button>
      
    </div>
  );
}
