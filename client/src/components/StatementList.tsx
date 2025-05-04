import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router";

export default function StatementList() {
  const [statements, setStatements] = useState<any[]>([]);

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
            {s.statement_name} - {s.bank_name} ({s.processing_status}) <button type="submit" onClick={()=>{
              navigate("/dashboard")
            }}>-- Generate Statement</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
