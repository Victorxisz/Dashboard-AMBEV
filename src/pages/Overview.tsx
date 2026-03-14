import { kpis, REGIOES, linhasProducao } from "../data/caseData";

function fmt(n: number) {
  return n.toLocaleString("pt-BR");
}

export default function Overview() {
  return (
    <div className="page">
      <div className="page-header">
        <div className="section-tag">◆ Visão Geral</div>
        <h1>Long Neck NENO — Análise de Capacidade</h1>
        <p>
          Crescimento de demanda premium pressiona capacidade produtiva do Nordeste-Norte.
          Análise de impactos, alavancas e custos do aumento de +30% Malzbier (fev) e +10% TT LN (mar).
        </p>
      </div>

      {/* KPIs */}
      <div className="kpi-grid">
        <div className="kpi-card" style={{ "--accent": "var(--c-gold)" } as React.CSSProperties}>
          <div className="kpi-label">Custo Total da Operação</div>
          <div className="kpi-value">R$ {(kpis.custoTotal / 1000).toFixed(0)}k</div>
          <div className="kpi-sub">Transferências via rodo + cabotagem</div>
        </div>
        <div className="kpi-card" style={{ "--accent": "var(--c-green)" } as React.CSSProperties}>
          <div className="kpi-label">DOI Médio Final</div>
          <div className="kpi-value">{kpis.doiMedioFinal}d</div>
          <div className="kpi-sub">Meta mínima: 12 dias</div>
        </div>
        <div className="kpi-card" style={{ "--accent": "var(--c-blue)" } as React.CSSProperties}>
          <div className="kpi-label">Regiões na Meta DOI</div>
          <div className="kpi-value">{kpis.pctRegioesMeta}%</div>
          <div className="kpi-sub">Das 5 sub-regiões do NENO</div>
        </div>
        <div className="kpi-card" style={{ "--accent": "var(--c-red)" } as React.CSSProperties}>
          <div className="kpi-label">Gap Total em HL</div>
          <div className="kpi-value">{fmt(kpis.gapTotalHL)}</div>
          <div className="kpi-sub">Volume abaixo da meta DOI 12</div>
        </div>
        <div className="kpi-card" style={{ "--accent": "var(--c-orange)" } as React.CSSProperties}>
          <div className="kpi-label">Vol. Transferido de SP</div>
          <div className="kpi-value">{fmt(kpis.volumeTransferidoSP)} HL</div>
          <div className="kpi-sub">Rodoviário + cabotagem</div>
        </div>
        <div className="kpi-card" style={{ "--accent": "var(--c-purple)" } as React.CSSProperties}>
          <div className="kpi-label">Prod. Extra NENO</div>
          <div className="kpi-value">{fmt(kpis.producaoExtraNENO)} HL</div>
          <div className="kpi-sub">Capacidade ociosa CE + PE</div>
        </div>
      </div>

      <div className="charts-2col">
        {/* Estrutura logística */}
        <div className="card">
          <div className="card-title">Estrutura Produtiva NENO</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {linhasProducao.map((l) => (
              <div key={l.linha} style={{
                background: "var(--c-surface-2)",
                borderRadius: "var(--r-sm)",
                padding: "14px 16px",
                borderLeft: "3px solid var(--c-gold)"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15 }}>{l.linha}</span>
                  <span className="badge badge-gold">{l.capacidade} KHL/mês</span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {l.skus.map(s => (
                    <span key={s} style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid var(--c-border-2)",
                      borderRadius: 4,
                      padding: "2px 7px",
                      fontSize: 11,
                      color: "var(--c-text-2)"
                    }}>{s}</span>
                  ))}
                </div>
              </div>
            ))}

            <div style={{
              background: "rgba(240,165,0,0.06)",
              border: "1px solid rgba(240,165,0,0.2)",
              borderRadius: "var(--r-sm)",
              padding: "12px 16px"
            }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "var(--c-gold)", marginBottom: 6, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                Capacidade Combinada
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--c-text-2)", fontSize: 12 }}>Total instalado</span>
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "var(--c-text)" }}>158 KHL/mês</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                <span style={{ color: "var(--c-text-2)", fontSize: 12 }}>Demanda observada (Jan)</span>
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "var(--c-red)" }}>201 KHL/mês</span>
              </div>
              <div style={{ fontSize: 11, color: "var(--c-red)", marginTop: 8 }}>
                ⚠ Gap estrutural de ~43 KHL/mês — sistema já opera no limite
              </div>
            </div>
          </div>
        </div>

        {/* Sub-regiões + logística */}
        <div className="card">
          <div className="card-title">Sub-regiões NENO & Logística</div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
            {REGIOES.map((r, i) => {
              const destinos: Record<string, string> = {
                "Mapapi":      "CDR João Pessoa",
                "NE Norte":    "CDR João Pessoa",
                "NE Sul":      "CDR Camaçari (BA)",
                "NO Araguaia": "Uberlândia (retira)",
                "NO Centro":   "CDR João Pessoa",
              };
              const cores = ["var(--c-gold)", "var(--c-blue)", "var(--c-green)", "var(--c-purple)", "var(--c-orange)"];
              return (
                <div key={r} style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "8px 12px",
                  background: "var(--c-surface-2)",
                  borderRadius: "var(--r-sm)",
                  borderLeft: `3px solid ${cores[i]}`
                }}>
                  <span style={{ fontSize: 13, fontWeight: 500, color: "var(--c-text)" }}>{r}</span>
                  <span style={{ fontSize: 11, color: "var(--c-text-3)" }}>{destinos[r]}</span>
                </div>
              );
            })}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div style={{ background: "var(--c-surface-2)", borderRadius: "var(--r-sm)", padding: "12px", textAlign: "center" }}>
              <div style={{ fontSize: 11, color: "var(--c-text-3)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>Modal Rodo</div>
              <div style={{ fontSize: 12, color: "var(--c-text-2)" }}>Lead time &lt; 1 semana</div>
              <div style={{ fontSize: 11, color: "var(--c-orange)", marginTop: 4 }}>Semanas W0–W2</div>
            </div>
            <div style={{ background: "var(--c-surface-2)", borderRadius: "var(--r-sm)", padding: "12px", textAlign: "center" }}>
              <div style={{ fontSize: 11, color: "var(--c-text-3)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>Cabotagem</div>
              <div style={{ fontSize: 12, color: "var(--c-text-2)" }}>3 semanas antecedência</div>
              <div style={{ fontSize: 11, color: "var(--c-blue)", marginTop: 4 }}>Semanas W3+</div>
            </div>
          </div>
        </div>
      </div>

      {/* Contexto do case */}
      <div className="card" style={{ marginTop: 0 }}>
        <div className="card-title">Contexto do Case</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
          {[
            { label: "+30% Malzbier", desc: "Aumento de demanda em fevereiro via incentivos comerciais para manutenção de market share", color: "var(--c-red)" },
            { label: "+10% TT LN",    desc: "Crescimento de +10% no total de Long Neck a partir de março, caso queiram crescer market share", color: "var(--c-orange)" },
            { label: "DOI Meta: 12d", desc: "Cobertura mínima de 12 dias de estoque para todas as sub-regiões do NENO", color: "var(--c-gold)" },
          ].map((item) => (
            <div key={item.label} style={{
              background: "var(--c-surface-2)",
              borderRadius: "var(--r-sm)",
              padding: "14px",
              borderTop: `2px solid ${item.color}`
            }}>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "var(--c-text)", marginBottom: 6 }}>{item.label}</div>
              <div style={{ fontSize: 12, color: "var(--c-text-2)", lineHeight: 1.6 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
