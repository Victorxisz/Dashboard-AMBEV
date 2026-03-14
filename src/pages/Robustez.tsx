import { robustez, doiPorCenario, gapPorCenario } from "../data/caseData";

function fmt(n: number) { return n.toLocaleString("pt-BR"); }

function LineChart({
  data, keys, colors, labels, metaY, metaLabel, height = 200
}: {
  data: Record<string, number | string>[];
  keys: string[];
  colors: string[];
  labels: string[];
  metaY?: number;
  metaLabel?: string;
  height?: number;
}) {
  const W = 520; const H = height;
  const PL = 48; const PR = 16; const PT = 16; const PB = 32;
  const chartH = H - PT - PB;
  const chartW = W - PL - PR;
  const n = data.length;

  const allNums = data.flatMap(d => keys.map(k => Number(d[k]) || 0));
  if (metaY) allNums.push(metaY);
  const maxV = Math.max(...allNums) * 1.1;
  const minV = 0;
  const range = maxV - minV || 1;

  function xP(i: number) { return PL + (i / (n - 1)) * chartW; }
  function yP(v: number) { return PT + chartH - ((v - minV) / range) * chartH; }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto" }}>
      {[0, 0.25, 0.5, 0.75, 1].map((f, i) => {
        const v = minV + f * (maxV - minV);
        const y = yP(v);
        return (
          <g key={i}>
            <line x1={PL} y1={y} x2={PL + chartW} y2={y} stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
            <text x={PL - 4} y={y + 4} textAnchor="end" fill="rgba(255,255,255,0.3)" fontSize={9}>
              {v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v.toFixed(1)}
            </text>
          </g>
        );
      })}

      {metaY && (
        <>
          <line x1={PL} y1={yP(metaY)} x2={PL + chartW} y2={yP(metaY)}
            stroke="var(--c-red)" strokeWidth={1.5} strokeDasharray="5,3" />
          {metaLabel && (
            <text x={PL + 4} y={yP(metaY) - 4} fill="var(--c-red)" fontSize={9}>{metaLabel}</text>
          )}
        </>
      )}

      {/* Fill below meta */}
      {metaY && (
        <rect x={PL} y={yP(metaY)} width={chartW} height={PT + chartH - yP(metaY)}
          fill="rgba(224,60,60,0.05)" />
      )}

      {keys.map((k, ki) => {
        const pts = data.map((d, i) => `${xP(i)},${yP(Number(d[k]) || 0)}`).join(" ");
        return (
          <g key={k}>
            <polyline points={pts} fill="none" stroke={colors[ki]} strokeWidth={2.2} opacity={0.9} />
            {data.map((d, i) => (
              <circle key={i} cx={xP(i)} cy={yP(Number(d[k]) || 0)} r={4}
                fill={colors[ki]} stroke="var(--c-surface)" strokeWidth={1.5} />
            ))}
          </g>
        );
      })}

      {data.map((_, i) => (
        <text key={i} x={xP(i)} y={PT + chartH + 16} textAnchor="middle"
          fill="rgba(255,255,255,0.4)" fontSize={9}>{labels[i]}</text>
      ))}
    </svg>
  );
}

function GroupedBarChart({
  data, keys, colors, labels, height = 200
}: {
  data: Record<string, number | string>[];
  keys: string[];
  colors: string[];
  labels: string[];
  height?: number;
}) {
  const W = 520; const H = height;
  const PL = 52; const PR = 16; const PT = 16; const PB = 32;
  const chartH = H - PT - PB; const chartW = W - PL - PR;
  const maxV = Math.max(...data.flatMap(d => keys.map(k => Number(d[k]) || 0))) * 1.1 || 1;
  const n = data.length;
  const groupW = chartW / n;
  const barW = Math.min(groupW / keys.length * 0.7, 22);
  const groupPad = (groupW - barW * keys.length) / 2;

  function xG(i: number) { return PL + i * groupW + groupPad; }
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
            <text x={PL - 4} y={y + 4} textAnchor="end" fill="rgba(255,255,255,0.3)" fontSize={9}>
              {v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v.toFixed(0)}
            </text>
          </g>
        );
      })}

      {data.map((d, i) => (
        <g key={i}>
          {keys.map((k, ki) => {
            const v = Number(d[k]) || 0;
            const x = xG(i) + ki * barW;
            return <rect key={k} x={x} y={yP(v)} width={barW - 1} height={bH(v)}
              fill={colors[ki]} rx={2} opacity={0.85} />;
          })}
          <text x={xG(i) + (barW * keys.length) / 2} y={PT + chartH + 14}
            textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize={9}>
            {labels[i]}
          </text>
        </g>
      ))}
    </svg>
  );
}

export default function Robustez() {
  return (
    <div className="page">
      <div className="page-header">
        <div className="section-tag">◈ Robustez</div>
        <h1>Teste de Robustez da Solução</h1>
        <p>Comparativo entre o cenário resolvido e simulações com bias de demanda de −9% e +9%, avaliando nível de serviço, gap logístico e custo total.</p>
      </div>

      {/* Robustez table */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-title">Tabela Executiva — Comparação de Cenários</div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Cenário</th>
              <th style={{ textAlign: "right" }}>DOI Médio</th>
              <th style={{ textAlign: "right" }}>% Regiões na Meta</th>
              <th style={{ textAlign: "right" }}>Gap Total (HL)</th>
              <th style={{ textAlign: "right" }}>Custo Total (R$)</th>
              <th>Avaliação</th>
            </tr>
          </thead>
          <tbody>
            {robustez.map((r) => {
              const isBest = r.cenario === "-9% bias";
              const isWorst = r.cenario === "+9% bias";
              const isMid = r.cenario === "Resolvido";
              const badge = isBest ? "badge-green" : isWorst ? "badge-red" : "badge-gold";
              const avaliacao = isBest ? "Confortável" : isMid ? "Base" : "Crítico";
              return (
                <tr key={r.cenario}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{
                        width: 10, height: 10, borderRadius: 2,
                        background: isBest ? "var(--c-green)" : isMid ? "var(--c-gold)" : "var(--c-red)"
                      }} />
                      <span style={{ fontWeight: isMid ? 600 : 400, color: isMid ? "var(--c-text)" : "var(--c-text-2)" }}>
                        {r.cenario}
                      </span>
                    </div>
                  </td>
                  <td style={{ textAlign: "right", fontFamily: "var(--font-display)", fontWeight: 700, color: r.doiMedio >= 12 ? "var(--c-green)" : "var(--c-red)" }}>
                    {r.doiMedio.toFixed(1)}d
                  </td>
                  <td style={{ textAlign: "right", color: r.pctMeta >= 80 ? "var(--c-green)" : r.pctMeta >= 60 ? "var(--c-gold)" : "var(--c-red)", fontWeight: 600 }}>
                    {r.pctMeta.toFixed(1)}%
                  </td>
                  <td style={{ textAlign: "right", color: r.gapTotal === 0 ? "var(--c-green)" : r.gapTotal < 5000 ? "var(--c-gold)" : "var(--c-red)" }}>
                    {r.gapTotal === 0 ? "—" : fmt(r.gapTotal)}
                  </td>
                  <td style={{ textAlign: "right", color: "var(--c-text)" }}>
                    R$ {fmt(r.custoTotal)}
                  </td>
                  <td><span className={`badge ${badge}`}>{avaliacao}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="charts-2col">
        {/* DOI por cenário */}
        <div className="card">
          <div className="card-title">DOI Médio por Semana — Cenários</div>
          <div className="legend">
            <div className="legend-item"><div className="legend-dot" style={{ background: "var(--c-green)" }} /> −9% bias</div>
            <div className="legend-item"><div className="legend-dot" style={{ background: "var(--c-gold)" }} /> Resolvido</div>
            <div className="legend-item"><div className="legend-dot" style={{ background: "var(--c-red)" }} /> +9% bias</div>
          </div>
          <LineChart
            data={doiPorCenario}
            keys={["minus9", "resolvido", "plus9"]}
            colors={["var(--c-green)", "var(--c-gold)", "var(--c-red)"]}
            labels={["W0","W1","W2","W3","W4","W5","W6","W7"]}
            metaY={12}
            metaLabel="Meta DOI 12d"
            height={200}
          />
        </div>

        {/* Gap por cenário */}
        <div className="card">
          <div className="card-title">Gap Total por Semana (HL) — Cenários</div>
          <div className="legend">
            <div className="legend-item"><div className="legend-dot" style={{ background: "var(--c-green)" }} /> −9% bias</div>
            <div className="legend-item"><div className="legend-dot" style={{ background: "var(--c-gold)" }} /> Resolvido</div>
            <div className="legend-item"><div className="legend-dot" style={{ background: "var(--c-red)" }} /> +9% bias</div>
          </div>
          <GroupedBarChart
            data={gapPorCenario}
            keys={["minus9", "resolvido", "plus9"]}
            colors={["var(--c-green)", "var(--c-gold)", "var(--c-red)"]}
            labels={["W0","W1","W2","W3","W4","W5","W6","W7"]}
            height={200}
          />
        </div>
      </div>

      {/* Recommendation */}
      <div style={{ marginTop: 4 }}>
        <div className="card" style={{ borderColor: "rgba(240,165,0,0.25)" }}>
          <div className="card-title" style={{ color: "var(--c-gold)" }}>◆ Recomendação Final</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
            {[
              {
                q: "Seguir com incentivos comerciais?",
                r: "Sim, com cautela",
                d: "O +30% Malzbier é viável operacionalmente, mas exige acionamento imediato das alavancas. Custo adicional de ~R$ 988k justifica pelo market share.",
                c: "var(--c-gold)"
              },
              {
                q: "Plano de produção e transferência?",
                r: "4 alavancas sequenciais",
                d: "Redistribuição interna → Prod. extra CE/PE → Estoque SP (rodo) → Prod. SP + cabotagem. Patagonia tem prioridade total na planta CE.",
                c: "var(--c-blue)"
              },
              {
                q: "Principais riscos?",
                r: "Patagônia & demanda real",
                d: "Patagônia não resolve completamente (só produz em CE). Bias de +9% eleva gap para 26.000 HL e custo para R$ 1,3M.",
                c: "var(--c-red)"
              },
            ].map(item => (
              <div key={item.q} style={{ borderTop: `2px solid ${item.c}`, paddingTop: 14 }}>
                <div style={{ fontSize: 11, color: "var(--c-text-3)", marginBottom: 6, fontStyle: "italic" }}>{item.q}</div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: item.c, marginBottom: 8 }}>{item.r}</div>
                <div style={{ fontSize: 12, color: "var(--c-text-2)", lineHeight: 1.6 }}>{item.d}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
