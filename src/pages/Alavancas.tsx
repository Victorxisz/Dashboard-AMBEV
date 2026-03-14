import { redistribuicaoInterna, capacidadeExtraNENO, volumePorAlavanca } from "../data/caseData";

function fmt(n: number) { return n.toLocaleString("pt-BR"); }

function StackedBar({ data }: { data: typeof volumePorAlavanca }) {
  const W = 560; const H = 200;
  const PL = 52; const PR = 16; const PT = 16; const PB = 32;
  const chartH = H - PT - PB;
  const chartW = W - PL - PR;

  const totals = data.map(d => d.alav1 + d.alav2 + d.alav3 + d.alav4);
  const maxV = Math.max(...totals) * 1.1 || 1;
  const n = data.length;
  const barW = Math.min((chartW / n) * 0.6, 36);
  const barPad = (chartW / n - barW) / 2;

  function xP(i: number) { return PL + i * (chartW / n) + barPad; }
  function hP(v: number) { return (v / maxV) * chartH; }

  const ALAVANCAS = [
    { key: "alav1" as const, color: "#22c55e", label: "Alav. 1 — Redistrib. Interna" },
    { key: "alav2" as const, color: "#3b82f6", label: "Alav. 2 — Prod. Extra NENO" },
    { key: "alav3" as const, color: "#f97316", label: "Alav. 3 — Estoque SP (rodo)" },
    { key: "alav4" as const, color: "#e03c3c", label: "Alav. 4 — Prod. SP + cabo" },
  ];

  const yTicks = [0, 0.25, 0.5, 0.75, 1];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto" }}>
      {yTicks.map((f, i) => {
        const v = maxV * f;
        const y = PT + chartH - (v / maxV) * chartH;
        return (
          <g key={i}>
            <line x1={PL} y1={y} x2={PL + chartW} y2={y} stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
            <text x={PL - 4} y={y + 4} textAnchor="end" fill="rgba(255,255,255,0.3)" fontSize={9}>
              {v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v.toFixed(0)}
            </text>
          </g>
        );
      })}

      {data.map((d, i) => {
        let bottom = 0;
        const x = xP(i);
        return (
          <g key={i}>
            {ALAVANCAS.map((a) => {
              const v = d[a.key];
              const h = hP(v);
              const y = PT + chartH - hP(bottom + v);
              const rect = (
                <rect key={a.key} x={x} y={y} width={barW} height={h}
                  fill={a.color} rx={i === 0 ? 2 : 0} opacity={0.85} />
              );
              bottom += v;
              return rect;
            })}
            <text x={x + barW / 2} y={PT + chartH + 14} textAnchor="middle"
              fill="rgba(255,255,255,0.4)" fontSize={9}>W{i}</text>
            {totals[i] > 0 && (
              <text x={x + barW / 2} y={PT + chartH - hP(totals[i]) - 4}
                textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize={8.5} fontWeight="bold">
                {fmt(totals[i])}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

function BeforeAfterChart({ data }: { data: typeof redistribuicaoInterna }) {
  const W = 420; const H = 170;
  const PL = 40; const PR = 8; const PT = 16; const PB = 28;
  const chartH = H - PT - PB; const chartW = W - PL - PR;
  const maxV = 18;
  const n = data.length;
  const barW = 18;
  const groupW = chartW / n;

  function xG(i: number) { return PL + i * groupW + (groupW - barW * 2 - 4) / 2; }
  function yP(v: number) { return PT + chartH - (v / maxV) * chartH; }
  function bH(v: number) { return (v / maxV) * chartH; }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto" }}>
      {[0, 0.25, 0.5, 0.75, 1].map((f, i) => {
        const v = maxV * f;
        const y = yP(v);
        return (
          <g key={i}>
            <line x1={PL} y1={y} x2={PL + chartW} y2={y} stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
            <text x={PL - 4} y={y + 4} textAnchor="end" fill="rgba(255,255,255,0.3)" fontSize={9}>{v.toFixed(0)}</text>
          </g>
        );
      })}
      {data.map((d, i) => (
        <g key={i}>
          <rect x={xG(i)} y={yP(d.antes)} width={barW} height={bH(d.antes)} fill="var(--c-red)" rx={2} opacity={0.8} />
          <rect x={xG(i) + barW + 4} y={yP(d.depois)} width={barW} height={bH(d.depois)} fill="var(--c-green)" rx={2} opacity={0.8} />
          <text x={xG(i) + barW + 2} y={PT + chartH + 14} textAnchor="middle"
            fill="rgba(255,255,255,0.4)" fontSize={9}>{d.semana}</text>
          <text x={xG(i) + barW / 2} y={yP(d.antes) - 4} textAnchor="middle" fill="var(--c-red)" fontSize={9}>{d.antes}</text>
          <text x={xG(i) + barW + 4 + barW / 2} y={yP(d.depois) - 4} textAnchor="middle" fill="var(--c-green)" fontSize={9}>{d.depois}</text>
        </g>
      ))}
    </svg>
  );
}

export default function Alavancas() {
  return (
    <div className="page">
      <div className="page-header">
        <div className="section-tag">◆ Modelo de Resolução</div>
        <h1>Alavancas Operacionais</h1>
        <p>Abordagem sequencial aplicada semana a semana e cerveja a cerveja, respeitando o encadeamento do sistema logístico.</p>
      </div>

      {/* Alavancas cards */}
      <div className="alavanca-grid" style={{ marginBottom: 20 }}>
        {[
          {
            num: "Alavanca 1",
            title: "Redistribuição Interna",
            desc: "Regiões com DOI acima de 12 dias atuam como doadoras. Custo zero — primeira prioridade. Equaliza DOI entre sub-regiões do NENO.",
            color: "var(--c-green)"
          },
          {
            num: "Alavanca 2",
            title: "Produção Extra no NENO",
            desc: "Capacidade ociosa das plantas CE (+360/+1.800 HL) e PE (+7.200 HL). SKU com pior DOI médio recebe prioridade de alocação.",
            color: "var(--c-blue)"
          },
          {
            num: "Alavanca 3",
            title: "Estoque de São Paulo",
            desc: "Uso do estoque disponível em SP via rodoviário (W0–W2) ou cabotagem (W3+). SP mantém DOI mínimo de 12 dias.",
            color: "var(--c-orange)"
          },
          {
            num: "Alavanca 4",
            title: "Produção Adicional SP",
            desc: "Última opção: produz e envia de SP até preencher gap semanal. Mesmas regras de envio e lead time da Alavanca 3.",
            color: "var(--c-red)"
          },
        ].map((a) => (
          <div key={a.num} className="alavanca-card" style={{ "--accent": a.color } as React.CSSProperties}>
            <div className="alavanca-num">{a.num}</div>
            <div className="alavanca-title">{a.title}</div>
            <div className="alavanca-desc">{a.desc}</div>
          </div>
        ))}
      </div>

      <div className="charts-2col">
        {/* Before/after redistribuição */}
        <div className="card">
          <div className="card-title">Regiões Abaixo da Meta DOI — Antes vs Depois (Alav. 1)</div>
          <div className="legend">
            <div className="legend-item"><div className="legend-dot" style={{ background: "var(--c-red)" }} /> Antes da redistribuição</div>
            <div className="legend-item"><div className="legend-dot" style={{ background: "var(--c-green)" }} /> Após redistribuição</div>
          </div>
          <BeforeAfterChart data={redistribuicaoInterna} />
          <div style={{ marginTop: 12, padding: "10px 14px", background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: "var(--r-sm)", fontSize: 12, color: "var(--c-green)" }}>
            ✓ Maior melhoria: W1 — de 16 → 5 regiões abaixo da meta (−11 regiões)
          </div>
        </div>

        {/* Capacidade extra NENO */}
        <div className="card">
          <div className="card-title">Capacidade Extra Disponível por Semana — CE e PE (HL)</div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Semana</th>
                <th>CE Plano</th>
                <th>CE Cap.</th>
                <th style={{ color: "var(--c-blue)" }}>+CE</th>
                <th>PE Plano</th>
                <th>PE Cap.</th>
                <th style={{ color: "var(--c-blue)" }}>+PE</th>
                <th style={{ color: "var(--c-gold)" }}>Total+</th>
              </tr>
            </thead>
            <tbody>
              {capacidadeExtraNENO.map((r) => (
                <tr key={r.semana}>
                  <td style={{ color: "var(--c-text)", fontWeight: 500 }}>{r.semana}</td>
                  <td>{fmt(r.cePlano)}</td>
                  <td>{fmt(r.ceCap)}</td>
                  <td style={{ color: r.ceExtra > 0 ? "var(--c-green)" : "var(--c-text-3)" }}>
                    {r.ceExtra > 0 ? `+${fmt(r.ceExtra)}` : "—"}
                  </td>
                  <td>{fmt(r.pePlano)}</td>
                  <td>{fmt(r.peCap)}</td>
                  <td style={{ color: r.peExtra > 0 ? "var(--c-green)" : "var(--c-text-3)" }}>
                    {r.peExtra > 0 ? `+${fmt(r.peExtra)}` : "—"}
                  </td>
                  <td style={{ color: "var(--c-gold)", fontWeight: 700 }}>
                    {r.totalExtra > 0 ? `+${fmt(r.totalExtra)}` : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: 12, padding: "10px 14px", background: "rgba(240,165,0,0.06)", border: "1px solid rgba(240,165,0,0.15)", borderRadius: "var(--r-sm)", fontSize: 12, color: "var(--c-text-2)" }}>
            ★ Toda a produção da planta CE (NS541) vai para <strong style={{ color: "var(--c-gold)" }}>Patagonia</strong> — SKU com maior restrição de oferta
          </div>
        </div>
      </div>

      {/* Volume por alavanca */}
      <div className="card">
        <div className="card-title">Volume Movimentado por Alavanca e Semana (HL)</div>
        <div className="legend">
          <div className="legend-item"><div className="legend-dot" style={{ background: "#22c55e" }} /> Alav. 1 — Redistrib. Interna</div>
          <div className="legend-item"><div className="legend-dot" style={{ background: "#3b82f6" }} /> Alav. 2 — Prod. Extra NENO</div>
          <div className="legend-item"><div className="legend-dot" style={{ background: "#f97316" }} /> Alav. 3 — Estoque SP (rodo)</div>
          <div className="legend-item"><div className="legend-dot" style={{ background: "#e03c3c" }} /> Alav. 4 — Prod. SP + cabo</div>
        </div>
        <StackedBar data={volumePorAlavanca} />
      </div>

      {/* Riscos */}
      <div style={{ marginTop: 16 }}>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--c-text-2)", marginBottom: 12 }}>
          Riscos do Modelo
        </div>
        <div className="risk-grid">
          {[
            { n: "Risco 01", t: "Atraso na Cabotagem", d: "Parte do plano depende da chegada programada de volume de SP. Atrasos comprometem o reabastecimento nas semanas finais e podem derrubar DOI abaixo da meta." },
            { n: "Risco 02", t: "Avaria no Rodoviário", d: "Se a perda no transporte rodoviário for maior que 5% considerado, o volume efetivamente recebido será menor, ampliando gap e custo total da operação." },
            { n: "Risco 03", t: "Demanda Acima do Previsto", d: "Se a demanda real vier acima do forecast, especialmente em Patagonia, o plano perde robustez, reduz cobertura de DOI e exige transferências extras não planejadas." },
          ].map(r => (
            <div key={r.n} className="risk-card">
              <div className="risk-num">{r.n}</div>
              <div className="risk-title">{r.t}</div>
              <div className="risk-desc">{r.d}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
