import React from "react";
import "./App.css";
import logo from "./assets/logo.png";

function App() {
  return (
    <div className="w-full min-h-screen bg-black flex items-center justify-center">
      <img src={logo} alt="Snippix Logo" className="w-32" />
    </div>
  );
}

export default App;
