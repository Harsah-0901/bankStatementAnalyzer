import React, { useState } from "react";
import api from "../api/axios";

export default function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [statementName, setStatementName] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert("Please select a file first.");

    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("statement_name", statementName);

    try {
      const res = await api.post("/upload", formData);
      alert("Uploaded & processed successfully");
      window.location.reload(); // ⬅️ Reload page on success
    } catch (err: any) {
      alert(err.response?.data?.error || "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);

    if (selectedFile) {
      const fileNameWithoutExt = selectedFile.name.replace(/\.[^/.]+$/, "");
      setStatementName(fileNameWithoutExt);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <div className="relative">
      
      {/* Loading Overlay */}
      {isUploading && (
        <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
          <div className="flex flex-col items-center gap-2">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-500 border-t-transparent"></div>
            <p className="text-gray-800 font-medium">Uploading...</p>
          </div>
        </div>
      )}
      

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Upload Bank Statement</h2>

        {/* File input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Select File</label>
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-500"
              onClick={() => document.getElementById("fileInput")?.click()}
              disabled={isUploading}
            >
              Choose File
            </button>
            <span className="text-gray-700 text-sm truncate">
              {file ? file.name : "No file selected"}
            </span>
          </div>
          <input
            id="fileInput"
            type="file"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {/* Statement name (auto-filled) */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Statement Name</label>
          <input
            type="text"
            value={statementName}
            readOnly
            className="w-full border rounded-md px-3 py-2 bg-gray-100 text-gray-700"
          />
        </div>

        {/* Action buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleUpload}
            disabled={isUploading}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-500 disabled:opacity-50"
          >
            Upload
          </button>
          
          <button
            onClick={handleLogout}
            className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-400 z-50"
          >
            Logout
          </button>

        </div>
      </div>
    </div>
  );
}
