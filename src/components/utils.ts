// Paleta azul escuro para Chart.js (não aceita CSS vars)
export const C = {
  gold:   "#f0a500",
  red:    "#ef4444",
  green:  "#22c55e",
  blue:   "#60a5fa",
  orange: "#fb923c",
  purple: "#c084fc",
  text2:  "#8fa4cc",
  text3:  "#4a5f80",
  border: "rgba(100,140,255,0.12)",
  grid:   "rgba(100,140,255,0.08)",
  bg:     "#0b1630",
};

export const SKU_C: Record<string,string> = {
  Patagonia: C.orange,
  Goose:     C.blue,
  Malzbier:  C.green,
  Colorado:  C.purple,
};

export function fmt(n:number){ return n.toLocaleString("pt-BR"); }
export function fmtM(n:number){
  if(n>=1_000_000) return `R$ ${(n/1_000_000).toFixed(1)}M`;
  if(n>=1_000)     return `R$ ${(n/1_000).toFixed(0)}k`;
  return `R$ ${n.toFixed(0)}`;
}

// Opções base Chart.js para tema escuro azul
export function baseOpts(extra: Record<string,unknown> = {}) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index" as const, intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#0f1d3a",
        borderColor: "rgba(100,140,255,0.3)",
        borderWidth: 1,
        titleColor: "#e8edf8",
        bodyColor: "#8fa4cc",
        padding: 10,
        callbacks: {},
      },
    },
    scales: {
      x: {
        grid: { color: C.grid, drawBorder: false },
        ticks: { color: C.text2, font: { size: 10 } },
        border: { color: "transparent" },
      },
      y: {
        grid: { color: C.grid, drawBorder: false },
        ticks: { color: C.text2, font: { size: 10 } },
        border: { color: "transparent" },
      },
    },
    ...extra,
  };
}

export function doiColor(v:number){ 
  if(v>=15) return {bg:"#14532d",fg:"#bbf7d0"};
  if(v>=12) return {bg:"#166534",fg:"#dcfce7"};
  if(v>=9)  return {bg:"#713f12",fg:"#fef08a"};
  if(v>=6)  return {bg:"#7c2d12",fg:"#fed7aa"};
  return          {bg:"#7f1d1d",fg:"#fecaca"};
}
