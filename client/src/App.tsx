import React from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import Upload from "./components/Upload";
import StatementList from "./components/StatementList";
import { Routes,Route } from "react-router";
import Dashboard from "./components/Dashboard";
import SignupPage from "./pages/SignupPage";
import UploadStatement from "./pages/UploadStatement";

const App = () => {
  const isLoggedIn = !!localStorage.getItem("token");

  return (
    
      <div>
      
      {!isLoggedIn ? (
        <>
          <SignupPage/>
        </>
      ) : (
        <>
          <UploadStatement/>
        </>
      )}
    </div>
    
    
  );
};

export default App;
