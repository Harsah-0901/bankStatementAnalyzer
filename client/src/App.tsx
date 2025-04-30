import React from "react";
import FileUpload from "./components/FileUpload";

const App: React.FC = () => {
  return (
    <div>
      <h1 style={{ textAlign: "center", marginTop: "20px" }}>
        Bank Statement Analyzer
      </h1>
      <FileUpload />
    </div>
  );
};

export default App;
