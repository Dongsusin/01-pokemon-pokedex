import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Pokedex from "./components/Pokedex";
import PokemonDetailsPage from "./components/PokemonDetailsPage";
import sound from "./components/sound/사운드.mp4";

function App() {
  return (
    <Router>
      {/* 배경음악은 App 컴포넌트에 배치하여 전체 페이지에서 유지 */}
      <audio autoPlay loop>
        <source src={sound} type="audio/mp4" />
      </audio>
      <Routes>
        <Route path="/" element={<Pokedex />} />
        <Route path="/pokemon/:id" element={<PokemonDetailsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
