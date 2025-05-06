import React, { useEffect, useState } from "react";
import api from "../api/axios";
import axios from "axios";
import { useNavigate } from "react-router";

export default function StatementList() {
  const [statements, setStatements] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const statementsPerPage = 3;
  const navigate = useNavigate();

  const handleGenerate = async (statementId: string) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/categories/by-statement/${statementId}`
      );
      const data = response.data;
      localStorage.setItem("statementData", JSON.stringify(data));
      navigate("/dashboard");
    } catch (error) {
      console.error("Error fetching statement data:", error);
      alert("Failed to generate statement insights");
    }
  };

  useEffect(() => {
    api
      .get("/statements")
      .then((res) => setStatements(res.data.statements))
      .catch((err) => {
        console.error("Error fetching statements:", err);
      });
  }, []);

  // Pagination logic
  const indexOfLastStatement = currentPage * statementsPerPage;
  const indexOfFirstStatement = indexOfLastStatement - statementsPerPage;
  const currentStatements = statements.slice(indexOfFirstStatement, indexOfLastStatement);

  const totalPages = Math.ceil(statements.length / statementsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Your Uploaded Statements</h2>
      {statements.length === 0 ? (
        <p className="text-gray-500">No statements found.</p>
      ) : (
        <>
          <ul className="space-y-4">
            {currentStatements.map((s) => (
              <li key={s.id} className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-medium">{s.statement_name}</p>
                  <p className="text-sm text-gray-500">
                    {s.bank_name} ({s.processing_status})
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleGenerate(s.id)}
                  className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-500"
                >
                  Generate
                </button>
              </li>
            ))}
          </ul>

          {/* Pagination Controls */}
          <div className="flex justify-center mt-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 mr-2 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="self-center text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 ml-2 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
