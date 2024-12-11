import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { useNavigate } from "react-router-dom";
import GameButton from "./components/GameButton";
import "./App.css";

function App() {
  const navigate = useNavigate();

  return (
    <>
      <div className="game-btn-row">
        <GameButton
          onClick={() => {
            navigate("/ritmo");
          }}
        >
          Ritmo / Rhythm
        </GameButton>
        <GameButton
          onClick={() => {
            navigate("/lexico");
          }}
        >
          Léxico / Words
        </GameButton>
        <GameButton>Tono / Tone</GameButton>
      </div>
    </>
  );
}

export default App;
