import { doiHeatmapAntes, doiHeatmapDepois, custoPorSemana, REGIOES, kpis } from "../data/caseData";

const SEMANAS_LABELS = ["W0\n02/02","W1\n09/02","W2\n16/02","W3\n23/02","W4\n02/03","W5\n09/03","W6\n16/03","W7\n23/03"];
const SEMANAS_SHORT  = ["W0","W1","W2","W3","W4","W5","W6","W7"];

function fmt(n: number) { return n.toLocaleString("pt-BR"); }

function doiColor(v: number): string {
  if (isNaN(v)) return "rgba(255,255,255,0.04)";
  if (v >= 15) return "#166534"; // deep green
  if (v >= 12) return "#15803d"; // green
  if (v >= 8)  return "#ca8a04"; // yellow
  return "#b91c1c";              // red
}

function Heatmap({ data, title }: { data: Record<string, number[]>; title: string }) {
  return (
    <div>
      <div style={{ fontSize: 12, fontWeight: 600, color: "var(--c-text-2)", marginBottom: 10 }}>{title}</div>
      <table className="heatmap-table">
        <thead>
          <tr>
            <th style={{ textAlign: "left", paddingRight: 12 }}>Região</th>
            {SEMANAS_SHORT.map(s => <th key={s}>{s}</th>)}
          </tr>
        </thead>
        <tbody>
          {REGIOES.map(reg => (
            <tr key={reg}>
              <td className="row-label">{reg}</td>
              {(data[reg] || []).map((v, i) => (
                <td key={i} style={{
                  background: doiColor(v),
                  color: v >= 12 ? "rgba(255,255,255,0.95)" : v >= 8 ? "#fff" : "#fff",
                  fontWeight: 600,
                  fontSize: 11,
                  borderRadius: 4,
                  padding: "5px 6px"
                }}>
                  {isNaN(v) ? "—" : v.toFixed(1)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ display: "flex", gap: 14, marginTop: 10 }}>
        {[
          { c: "#b91c1c", l: "< 8 dias" },
          { c: "#ca8a04", l: "8–12 dias" },
          { c: "#15803d", l: "≥ 12 dias" },
          { c: "#166534", l: "≥ 15 dias" },
        ].map(item => (
          <div key={item.l} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10, color: "var(--c-text-3)" }}>
            <div style={{ width: 10, height: 10, background: item.c, borderRadius: 2 }} />
            {item.l}
          </div>
        ))}
        <div style={{ fontSize: 10, color: "var(--c-red)", marginLeft: "auto" }}>
          DOI meta: 12 dias
        </div>
      </div>
    </div>
  );
}

function CostChart() {
  const W = 560; const H = 200;
  const PL = 52; const PR = 16; const PT = 16; const PB = 32;
  const chartH = H - PT - PB;
  const chartW = W - PL - PR;

  const maxV = Math.max(...custoPorSemana.map(d => d.total)) * 1.1;
  const n = custoPorSemana.length;
  const barW = Math.min((chartW / n) * 0.55, 32);
  const barPad = (chartW / n - barW) / 2;

  function xB(i: number) { return PL + i * (chartW / n) + barPad; }
  function yP(v: number) { return PT + chartH - (v / maxV) * chartH; }
  function bH(v: number) { return (v / maxV) * chartH; }

  // Line for cumulative
  const cumulative: number[] = [];
  custoPorSemana.reduce((acc, d, i) => { cumulative[i] = acc + d.total; return cumulative[i]; }, 0);
  const maxCum = cumulative[cumulative.length - 1] * 1.05;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto" }}>
      {[0, 0.25, 0.5, 0.75, 1].map((f, i) => {
        const v = maxV * f;
        const y = yP(v);
        return (
          <g key={i}>
            <line x1={PL} y1={y} x2={PL + chartW} y2={y} stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
            <text x={PL - 4} y={y + 4} textAnchor="end" fill="rgba(255,255,255,0.3)" fontSize={9}>
              {v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v.toFixed(0)}
            </text>
          </g>
        );
      })}

      {custoPorSemana.map((d, i) => {
        const x = xB(i);
        const yRodo = yP(d.rodo);
        const yCabo = yP(d.rodo + d.cabo);

        return (
          <g key={i}>
            <rect x={x} y={yRodo} width={barW} height={bH(d.rodo)} fill="var(--c-orange)" rx={2} opacity={0.85} />
            {d.cabo > 0 && (
              <rect x={x} y={yCabo} width={barW} height={bH(d.cabo)} fill="var(--c-blue)" rx={2} opacity={0.85} />
            )}
            <text x={x + barW / 2} y={PT + chartH + 14} textAnchor="middle"
              fill="rgba(255,255,255,0.4)" fontSize={9}>W{i}</text>
          </g>
        );
      })}

      {/* Cumulative line on right axis */}
      {custoPorSemana.map((_, i) => {
        if (i === 0) return null;
        const x1 = xB(i - 1) + barW / 2;
        const x2 = xB(i) + barW / 2;
        const y1 = PT + chartH - (cumulative[i - 1] / maxCum) * chartH;
        const y2 = PT + chartH - (cumulative[i] / maxCum) * chartH;
        return (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="var(--c-gold)" strokeWidth={2} opacity={0.8} />
        );
      })}
      {custoPorSemana.map((_, i) => {
        const cx = xB(i) + barW / 2;
        const cy = PT + chartH - (cumulative[i] / maxCum) * chartH;
        return <circle key={i} cx={cx} cy={cy} r={3} fill="var(--c-gold)" />;
      })}
      <text x={PL + chartW - 2} y={PT + chartH - (cumulative[7] / maxCum) * chartH - 6}
        textAnchor="end" fill="var(--c-gold)" fontSize={9}>
        Acumulado
      </text>
    </svg>
  );
}

export default function Resultados() {
  const totalCusto = custoPorSemana.reduce((a, d) => a + d.total, 0);
  const custoRodo = custoPorSemana.reduce((a, d) => a + d.rodo, 0);
  const custoCabo = custoPorSemana.reduce((a, d) => a + d.cabo, 0);

  return (
    <div className="page">
      <div className="page-header">
        <div className="section-tag">◉ Resultados</div>
        <h1>Resultados após Aplicação do Modelo</h1>
        <p>DOI médio, heatmaps de cobertura e decomposição de custos das transferências SP → NENO.</p>
      </div>

      {/* KPIs */}
      <div className="kpi-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
        {[
          { label: "Custo Total Operação", value: `R$ ${fmt(totalCusto)}`, sub: "Rodo + cabotagem", accent: "var(--c-gold)" },
          { label: "Custo Rodoviário",     value: `R$ ${fmt(custoRodo)}`,  sub: `${((custoRodo/totalCusto)*100).toFixed(0)}% do total`, accent: "var(--c-orange)" },
          { label: "Custo Cabotagem",      value: `R$ ${fmt(custoCabo)}`,  sub: `${((custoCabo/totalCusto)*100).toFixed(0)}% do total`, accent: "var(--c-blue)" },
          { label: "DOI Médio Final",      value: `${kpis.doiMedioFinal}d`, sub: `${kpis.pctRegioesMeta}% regiões na meta`, accent: "var(--c-green)" },
        ].map(k => (
          <div key={k.label} className="kpi-card" style={{ "--accent": k.accent } as React.CSSProperties}>
            <div className="kpi-label">{k.label}</div>
            <div className="kpi-value" style={{ fontSize: 22 }}>{k.value}</div>
            <div className="kpi-sub">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Heatmaps */}
      <div className="charts-2col" style={{ marginBottom: 16 }}>
        <div className="card">
          <div className="card-title">DOI por Região e Semana — Antes das Alavancas</div>
          <Heatmap data={doiHeatmapAntes} title="Cenário nova demanda SEM redistribuição" />
        </div>
        <div className="card">
          <div className="card-title">DOI por Região e Semana — Após Alavancas</div>
          <Heatmap data={doiHeatmapDepois} title="Cenário resolvido COM todas as alavancas" />
        </div>
      </div>

      {/* Cost chart */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-title">Custo de Transferência por Semana (R$)</div>
        <div className="legend">
          <div className="legend-item"><div className="legend-dot" style={{ background: "var(--c-orange)" }} /> Rodoviário</div>
          <div className="legend-item"><div className="legend-dot" style={{ background: "var(--c-blue)" }} /> Cabotagem</div>
          <div className="legend-item"><div className="legend-line" style={{ background: "var(--c-gold)" }} /> Custo acumulado</div>
        </div>
        <CostChart />
      </div>

      {/* Custo por semana table */}
      <div className="card">
        <div className="card-title">Detalhamento de Custos por Semana</div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Semana</th>
              <th style={{ textAlign: "right" }}>Rodoviário</th>
              <th style={{ textAlign: "right" }}>Cabotagem</th>
              <th style={{ textAlign: "right", color: "var(--c-gold)" }}>Total</th>
              <th style={{ textAlign: "right" }}>% do Total Geral</th>
            </tr>
          </thead>
          <tbody>
            {custoPorSemana.map((d, i) => (
              <tr key={i}>
                <td style={{ color: "var(--c-text)", fontWeight: 500 }}>
                  {SEMANAS_LABELS[i].replace("\n", " ")}
                </td>
                <td style={{ textAlign: "right", color: d.rodo > 0 ? "var(--c-orange)" : "var(--c-text-3)" }}>
                  {d.rodo > 0 ? `R$ ${fmt(d.rodo)}` : "—"}
                </td>
                <td style={{ textAlign: "right", color: d.cabo > 0 ? "var(--c-blue)" : "var(--c-text-3)" }}>
                  {d.cabo > 0 ? `R$ ${fmt(d.cabo)}` : "—"}
                </td>
                <td style={{ textAlign: "right", fontWeight: 700, color: "var(--c-gold)" }}>
                  R$ {fmt(d.total)}
                </td>
                <td style={{ textAlign: "right", color: "var(--c-text-2)" }}>
                  {((d.total / totalCusto) * 100).toFixed(1)}%
                </td>
              </tr>
            ))}
            <tr style={{ borderTop: "1px solid var(--c-border-2)" }}>
              <td style={{ color: "var(--c-text)", fontWeight: 700 }}>TOTAL</td>
              <td style={{ textAlign: "right", fontWeight: 600, color: "var(--c-orange)" }}>R$ {fmt(custoRodo)}</td>
              <td style={{ textAlign: "right", fontWeight: 600, color: "var(--c-blue)" }}>R$ {fmt(custoCabo)}</td>
              <td style={{ textAlign: "right", fontWeight: 800, color: "var(--c-gold)", fontSize: 14 }}>R$ {fmt(totalCusto)}</td>
              <td style={{ textAlign: "right", color: "var(--c-text-2)" }}>100%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
