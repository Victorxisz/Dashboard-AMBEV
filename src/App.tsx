import { useState } from "react";
import Overview from "./pages/Overview";
import Demanda from "./pages/Demanda";
import Alavancas from "./pages/Alavancas";
import Resultados from "./pages/Resultados";
import Robustez from "./pages/Robustez";

const PAGES = [
  { id: "overview",   label: "Visão Geral",   icon: "⬡" },
  { id: "demanda",    label: "Demanda & Cap.", icon: "◈" },
  { id: "alavancas",  label: "Alavancas",     icon: "◆" },
  { id: "resultados", label: "Resultados",    icon: "◉" },
  { id: "robustez",   label: "Robustez",      icon: "◈" },
];

export default function App() {
  const [activePage, setActivePage] = useState("overview");

  const renderPage = () => {
    switch (activePage) {
      case "overview":   return <Overview />;
      case "demanda":    return <Demanda />;
      case "alavancas":  return <Alavancas />;
      case "resultados": return <Resultados />;
      case "robustez":   return <Robustez />;
      default:           return <Overview />;
    }
  };

  return (
    <div className="app-shell">
      {/* Sidebar */}
      <nav className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-icon">A</div>
          <div className="brand-text">
            <span className="brand-name">AMBEV</span>
            <span className="brand-sub">Long Neck · NENO</span>
          </div>
        </div>

        <ul className="nav-list">
          {PAGES.map((p) => (
            <li key={p.id}>
              <button
                className={`nav-item ${activePage === p.id ? "active" : ""}`}
                onClick={() => setActivePage(p.id)}
              >
                <span className="nav-icon">{p.icon}</span>
                <span className="nav-label">{p.label}</span>
              </button>
            </li>
          ))}
        </ul>

        <div className="sidebar-footer">
          <span className="footer-tag">Case · InsperJr</span>
          <span className="footer-year">2026</span>
        </div>
      </nav>

      {/* Main content */}
      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  );
}
