import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router";
import axios from "axios";

export default function StatementList() {
  const [statements, setStatements] = useState<any[]>([]);
  const handleGenerate = async (statementId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/categories/by-statement/${statementId}`
      );
      const data = response.data;

      // Store the data in localStorage
      localStorage.setItem("statementData", JSON.stringify(data));

      // Navigate to dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Error fetching statement data:", error);
    }
  };

  useEffect(() => {
      api.get("/statements")
        .then((res) => setStatements(res.data.statements))
        .catch((err) => {
          console.error("Error fetching statements:", err);
        });
    }, []);

    const navigate = useNavigate();
    

  return (
    <div>
      <h2>Your Statements</h2>
      <ul>
      {statements.map((s) => (
        <li key={s.id}>
          {s.statement_name} - {s.bank_name} ({s.processing_status}){" "}
          <button type="button" onClick={() => handleGenerate(s.id)}>
            -- Generate Statement
          </button>
        </li>
      ))}
    </ul>
    </div>
  );
}
