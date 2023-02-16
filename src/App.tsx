import React from 'react';
import './App.css';
import { Routes, Route } from "react-router-dom";
import List from './Components/List';
import Details from './Components/Details';

function App() {

  return (
    <div className="App">

      <div className="header">
        <span>My PokeDex</span>
      </div>

      <Routes>
        <Route path="/" element={<List />} />
        <Route path="/Details/:name" element={<Details />} />
      </Routes>
    </div>
  );
}

export default App;
