import { useState } from "react";
import Overview   from "./pages/Overview";
import Resolucao  from "./pages/Resolucao";
import Alavancas  from "./pages/Alavancas";
import Custos     from "./pages/Custos";
import Robustez   from "./pages/Robustez";

const PAGES = [
  { id:"overview",  label:"Visão Geral",    icon:"⬡" },
  { id:"resolucao", label:"Resolução",       icon:"◉" },
  { id:"alavancas", label:"Alavancas",       icon:"◆" },
  { id:"custos",    label:"Custos & SP",     icon:"◈" },
  { id:"robustez",  label:"Robustez",        icon:"◇" },
];

export default function App() {
  const [pg, setPg] = useState("overview");
  const render = () => {
    switch(pg){
      case "overview":  return <Overview />;
      case "resolucao": return <Resolucao />;
      case "alavancas": return <Alavancas />;
      case "custos":    return <Custos />;
      case "robustez":  return <Robustez />;
      default:          return <Overview />;
    }
  };
  return (
    <div className="shell">
      <nav className="sidebar">
        <div className="brand">
          <div className="brand-icon">A</div>
          <div><div className="brand-name">AMBEV</div><div className="brand-sub">Long Neck · NENO</div></div>
        </div>
        <ul className="nav-list">
          {PAGES.map(p=>(
            <li key={p.id}>
              <button className={`nav-btn${pg===p.id?" active":""}`} onClick={()=>setPg(p.id)}>
                <span className="nav-icon">{p.icon}</span>{p.label}
              </button>
            </li>
          ))}
        </ul>
        <div className="sidebar-foot"><span>Case · InsperJr</span><span>2026</span></div>
      </nav>
      <main className="main">{render()}</main>
    </div>
  );
}
