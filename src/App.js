import React from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";

import Board from "./components/Board/index";

const App = () => {
  return (
    <div className="App">
      <Routes>
        <Route path="/board" element={<Board />} />
      </Routes>
    </div>
  );
};

export default App;
