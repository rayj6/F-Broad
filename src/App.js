import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

import Paper from "./components/Paper/index";
import Login from "./components/Login/index";
// import Register from "./components/Register/index.js";

function App() {
  return (
    <div className="App">
        <Router>
            <Routes>
                <Route index element={<Login />} />
                <Route path="paper" element={<Paper/>} />
            </Routes>
        </Router>
    </div>
  );
}

export default App;
