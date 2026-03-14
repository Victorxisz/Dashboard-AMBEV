import { demandaRegional, totalLNDemanda, malzbierFev, demandaVsProducao } from "../data/caseData";

function fmt(n: number) { return n.toLocaleString("pt-BR"); }

// ── MINI BAR CHART ────────────────────────────────────────
function BarChart({
  data, keys, colors, labels, height = 180, showMeta, metaValue, metaLabel
}: {
  data: Record<string, number | string>[];
  keys: string[];
  colors: string[];
  labels?: string[];
  height?: number;
  showMeta?: boolean;
  metaValue?: number;
  metaLabel?: string;
}) {
  const PADDING = { left: 48, right: 16, top: 16, bottom: 32 };
  const W = 520;
  const H = height;
  const chartH = H - PADDING.top - PADDING.bottom;
  const chartW = W - PADDING.left - PADDING.right;

  const allNums = data.flatMap(d => keys.map(k => Number(d[k]) || 0));
  const maxVal = Math.max(...allNums, showMeta && metaValue ? metaValue * 1.05 : 0);
  const minVal = 0;
  const range = maxVal - minVal || 1;

  const n = data.length;
  const groupW = chartW / n;
  const barW = Math.min(groupW / keys.length * 0.7, 28);
  const groupPad = (groupW - barW * keys.length) / 2;

  function yPos(v: number) {
    return PADDING.top + chartH - ((v - minVal) / range) * chartH;
  }

  const yTicks = 4;
  const yStep = range / yTicks;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", overflow: "visible" }}>
      {/* Grid lines */}
      {Array.from({ length: yTicks + 1 }).map((_, i) => {
        const v = minVal + i * yStep;
        const y = yPos(v);
        return (
          <g key={i}>
            <line x1={PADDING.left} y1={y} x2={PADDING.left + chartW} y2={y}
              stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
            <text x={PADDING.left - 4} y={y + 4} textAnchor="end"
              fill="rgba(255,255,255,0.3)" fontSize={9}>
              {v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v.toFixed(0)}
            </text>
          </g>
        );
      })}

      {/* Meta line */}
      {showMeta && metaValue && (
        <>
          <line
            x1={PADDING.left} y1={yPos(metaValue)}
            x2={PADDING.left + chartW} y2={yPos(metaValue)}
            stroke="var(--c-red)" strokeWidth={1.5} strokeDasharray="5,3"
          />
          <text x={PADDING.left + chartW - 2} y={yPos(metaValue) - 4}
            textAnchor="end" fill="var(--c-red)" fontSize={9}>
            {metaLabel || `Meta ${fmt(metaValue)}`}
          </text>
        </>
      )}

      {/* Bars */}
      {data.map((d, gi) => {
        const xG = PADDING.left + gi * groupW + groupPad;
        return (
          <g key={gi}>
            {keys.map((k, ki) => {
              const v = Number(d[k]) || 0;
              const x = xG + ki * barW;
              const y = yPos(v);
              const bH = Math.max(0, chartH - (y - PADDING.top));
              return (
                <rect key={k} x={x} y={y} width={barW - 2} height={bH}
                  fill={colors[ki]} rx={2} opacity={0.85} />
              );
            })}
            {/* X label */}
            <text
              x={xG + (barW * keys.length) / 2}
              y={PADDING.top + chartH + 14}
              textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize={9}>
              {(labels || data.map((_, i) => String(i)))[gi]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ── GROUPED BAR — REGIONAL ────────────────────────────────
function RegionalChart() {
  const max = Math.max(...demandaRegional.flatMap(d => [d.janeiro, d.fevereiro]));
  const H = 180; const W = 520;
  const PL = 48; const PR = 8; const PT = 12; const PB = 28;
  const chartH = H - PT - PB;
  const chartW = W - PL - PR;
  const n = demandaRegional.length;
  const groupW = chartW / n;
  const barW = Math.min(groupW * 0.3, 22);

  function yP(v: number) { return PT + chartH - (v / max) * chartH; }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto" }}>
      {[0, 0.25, 0.5, 0.75, 1].map((f, i) => {
        const v = max * f;
        const y = yP(v);
        return (
          <g key={i}>
            <line x1={PL} y1={y} x2={PL + chartW} y2={y} stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
            <text x={PL - 4} y={y + 4} textAnchor="end" fill="rgba(255,255,255,0.3)" fontSize={9}>
              {v >= 1 ? `${v.toFixed(0)}k` : v.toFixed(1)}
            </text>
          </g>
        );
      })}

      {demandaRegional.map((d, i) => {
        const xG = PL + i * groupW + (groupW - barW * 2 - 2) / 2;
        const yJ = yP(d.janeiro);
        const yF = yP(d.fevereiro);
        const hJ = chartH - (yJ - PT);
        const hF = chartH - (yF - PT);
        const isNeno = d.regiao === "NENO";
        return (
          <g key={d.regiao}>
            <rect x={xG} y={yJ} width={barW} height={hJ}
              fill={isNeno ? "var(--c-gold)" : "var(--c-blue)"} rx={2} opacity={0.8} />
            <rect x={xG + barW + 2} y={yF} width={barW} height={hF}
              fill={isNeno ? "var(--c-orange)" : "rgba(59,130,246,0.45)"} rx={2} opacity={0.8} />
            <text x={xG + barW + 1} y={PT + chartH + 12} textAnchor="middle"
              fill={isNeno ? "var(--c-gold)" : "rgba(255,255,255,0.4)"} fontSize={9}
              fontWeight={isNeno ? "700" : "400"}>
              {d.regiao}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ── LINE CHART — TT LN ────────────────────────────────────
function LineChart({
  data, series, colors, labels, height = 200, metaValue, metaLabel
}: {
  data: Record<string, number | string>[];
  series: { key: string; dash?: boolean }[];
  colors: string[];
  labels: string[];
  height?: number;
  metaValue?: number;
  metaLabel?: string;
}) {
  const W = 560; const H = height;
  const PL = 52; const PR = 16; const PT = 16; const PB = 32;
  const chartH = H - PT - PB;
  const chartW = W - PL - PR;

  const allNums = data.flatMap(d => series.map(s => Number(d[s.key]) || 0));
  if (metaValue) allNums.push(metaValue);
  const maxV = Math.max(...allNums) * 1.05;
  const minV = 0;
  const range = maxV - minV || 1;
  const n = data.length;

  function xP(i: number) { return PL + (i / (n - 1)) * chartW; }
  function yP(v: number) { return PT + chartH - ((v - minV) / range) * chartH; }

  const yTicks = 4;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto" }}>
      {Array.from({ length: yTicks + 1 }).map((_, i) => {
        const v = minV + (i / yTicks) * (maxV - minV);
        const y = yP(v);
        return (
          <g key={i}>
            <line x1={PL} y1={y} x2={PL + chartW} y2={y}
              stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
            <text x={PL - 4} y={y + 4} textAnchor="end"
              fill="rgba(255,255,255,0.3)" fontSize={9}>
              {v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v.toFixed(0)}
            </text>
          </g>
        );
      })}

      {metaValue && (
        <line x1={PL} y1={yP(metaValue)} x2={PL + chartW} y2={yP(metaValue)}
          stroke="var(--c-red)" strokeWidth={1.5} strokeDasharray="5,3" />
      )}
      {metaValue && metaLabel && (
        <text x={PL + chartW - 2} y={yP(metaValue) - 5}
          textAnchor="end" fill="var(--c-red)" fontSize={9}>{metaLabel}</text>
      )}

      {series.map((s, si) => {
        const points = data.map((d, i) => `${xP(i)},${yP(Number(d[s.key]) || 0)}`).join(" ");
        return (
          <g key={s.key}>
            <polyline points={points} fill="none"
              stroke={colors[si]} strokeWidth={2}
              strokeDasharray={s.dash ? "5,4" : undefined}
              opacity={0.9} />
            {data.map((d, i) => (
              <circle key={i} cx={xP(i)} cy={yP(Number(d[s.key]) || 0)} r={3.5}
                fill={colors[si]} />
            ))}
          </g>
        );
      })}

      {data.map((_, i) => (
        <text key={i} x={xP(i)} y={PT + chartH + 16} textAnchor="middle"
          fill="rgba(255,255,255,0.4)" fontSize={9}>
          {labels[i]}
        </text>
      ))}
    </svg>
  );
}

// ── PAGE ──────────────────────────────────────────────────
export default function Demanda() {
  return (
    <div className="page">
      <div className="page-header">
        <div className="section-tag">◈ Demanda & Capacidade</div>
        <h1>Análise de Demanda vs Capacidade</h1>
        <p>Comparativo entre cenário atual e novo (+30% Malzbier fev / +10% TT LN mar) frente à capacidade instalada.</p>
      </div>

      {/* Row 1 */}
      <div className="charts-2col">
        <div className="card">
          <div className="card-title">Demanda LN por Regional (KHL) — Jan vs Fev</div>
          <div className="legend">
            <div className="legend-item"><div className="legend-dot" style={{ background: "var(--c-blue)" }} /> Janeiro</div>
            <div className="legend-item"><div className="legend-dot" style={{ background: "rgba(59,130,246,0.45)" }} /> Fevereiro</div>
            <div className="legend-item"><div className="legend-dot" style={{ background: "var(--c-gold)" }} /> NENO (Jan)</div>
          </div>
          <RegionalChart />
          <div style={{ fontSize: 11, color: "var(--c-text-3)", marginTop: 8 }}>
            ★ NENO é a região com maior volume de LN no Brasil
          </div>
        </div>

        <div className="card">
          <div className="card-title">Demanda vs Produção — Jan/Fev (HL)</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
            {demandaVsProducao.map((d, i) => {
              const max = 210000;
              const pct = (d.valor / max) * 100;
              const cores = ["var(--c-red)", "var(--c-blue)", "var(--c-blue)", "var(--c-orange)", "var(--c-green)"];
              const isGap = d.label.includes("Demanda");
              return (
                <div key={i}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 11.5, color: isGap ? "var(--c-text)" : "var(--c-text-2)" }}>{d.label}</span>
                    <span style={{ fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 700, color: "var(--c-text)" }}>
                      {fmt(d.valor)} HL
                    </span>
                  </div>
                  <div style={{ height: 6, background: "rgba(255,255,255,0.07)", borderRadius: 3 }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: cores[i], borderRadius: 3 }} />
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{
            background: "rgba(224,60,60,0.08)",
            border: "1px solid rgba(224,60,60,0.2)",
            borderRadius: "var(--r-sm)",
            padding: "10px 14px",
            fontSize: 12,
            color: "var(--c-red)"
          }}>
            ⚠ Gap produtivo Jan: <strong>57.219 HL</strong> — sistema já depende de transferências
          </div>
        </div>
      </div>

      {/* Row 2 */}
      <div className="charts-single">
        <div className="card">
          <div className="card-title">Total LN — Demanda Atual vs Nova vs Capacidade Máxima (HL/semana)</div>
          <div className="legend" style={{ marginBottom: 8 }}>
            <div className="legend-item"><div className="legend-dot" style={{ background: "var(--c-blue)" }} /> Demanda Atual</div>
            <div className="legend-item"><div className="legend-dot" style={{ background: "var(--c-orange)" }} /> Demanda Nova</div>
            <div className="legend-item"><div className="legend-line" style={{ background: "var(--c-red)" }} /> Capacidade Máxima (39.600 HL)</div>
          </div>
          <LineChart
            data={totalLNDemanda}
            series={[
              { key: "demandaAtual" },
              { key: "demandaNova" },
              { key: "capacidade", dash: true },
            ]}
            colors={["var(--c-blue)", "var(--c-orange)", "var(--c-red)"]}
            labels={["W0", "W1", "W2", "W3", "W4", "W5", "W6", "W7"]}
            height={200}
          />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginTop: 12 }}>
            {[
              { label: "Semanas com demanda > cap.", value: "6/8", color: "var(--c-red)" },
              { label: "Pico demanda nova", value: "50.600 HL", color: "var(--c-orange)" },
              { label: "Excesso sobre cap. (pico W5)", value: "+11.000 HL", color: "var(--c-red)" },
            ].map(item => (
              <div key={item.label} style={{
                background: "var(--c-surface-2)",
                borderRadius: "var(--r-sm)",
                padding: "10px 12px",
                textAlign: "center"
              }}>
                <div style={{ fontSize: 10, color: "var(--c-text-3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>{item.label}</div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: item.color }}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3 — Malzbier fev */}
      <div className="card">
        <div className="card-title">Malzbier — Demanda Atual vs Nova vs Produção (HL/semana — Fevereiro)</div>
        <div className="legend">
          <div className="legend-item"><div className="legend-dot" style={{ background: "var(--c-blue)" }} /> Demanda Atual</div>
          <div className="legend-item"><div className="legend-dot" style={{ background: "var(--c-red)" }} /> Demanda Nova (+30%)</div>
          <div className="legend-item"><div className="legend-dot" style={{ background: "var(--c-green)" }} /> Produção WSNP</div>
        </div>
        <BarChart
          data={malzbierFev}
          keys={["demandaAtual", "demandaNova", "producao"]}
          colors={["var(--c-blue)", "var(--c-red)", "var(--c-green)"]}
          labels={["W0\n02/02", "W1\n09/02", "W2\n16/02", "W3\n23/02"]}
          height={180}
        />
      </div>
    </div>
  );
}
