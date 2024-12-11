import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Ritmo from "./pages/Ritmo.jsx";
import Lexico from "./pages/Lexico.jsx";
import Header from "./components/Header.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/ritmo" element={<Ritmo />} />
        <Route path="/lexico" element={<Lexico />} />
      </Routes>
    </Router>
  </StrictMode>
);
