import React from "react";
import FileUpload from "./components/FileUpload";
import { BrowserRouter,Routes,Route } from "react-router";

import Login from "./pages/Login";

const App: React.FC = () => {
  return (

    <Routes>
      <Route path="/" element={<Login/>}/>
      <Route path="/upload" element={<FileUpload/>}/>
    </Routes>
    // <div>
    //   <h1 style={{ textAlign: "center", marginTop: "20px" }}>
    //     Bank Statement Analyzer
    //   </h1>
    //   <FileUpload />
    // </div>
  );
};

export default App;
