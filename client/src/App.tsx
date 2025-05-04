import React from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import Upload from "./components/Upload";
import StatementList from "./components/StatementList";
import { Routes,Route } from "react-router";
import Dashboard from "./components/Dashboard";

const App = () => {
  const isLoggedIn = !!localStorage.getItem("token");

  return (
    
      <div>
      <h1>Bank Statement Analyzer</h1>
      {!isLoggedIn ? (
        <>
          <Register />
          <Login />
        </>
      ) : (
        <>
          <Upload />
          <StatementList />
        </>
      )}
    </div>
    
    
  );
};

export default App;
