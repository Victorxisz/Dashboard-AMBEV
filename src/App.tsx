import { useState } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { Bar, Line } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, Title, Tooltip, Legend, Filler
)

// ── DADOS REAIS DO EXCEL ──────────────────────────────────────────────
const W = ['W0', 'W1', 'W2', 'W3']
const CA = '#1B6CA8', CL = '#E07B24', CV = '#2E8B57', CR = '#7D3C98'
const CG = '#7F8C8D', CVR = '#C0392B', CGD = '#D4A843'

const DATA = {
  dem: {
    pat_a:   [8419.28, 9248.53, 6802.88, 7456.55],
    goose_a: [14841.94, 15478.99, 11700.63, 13049.39],
    malz_a:  [10448.68, 11250.59, 8005.81, 9228.96],
    malz_n:  [13583.28, 14625.77, 10407.55, 11997.65],
    col_a:   [6052.18, 6712.94, 5004.31, 5615.93],
  },
  doi: {
    pat_a:   [13.10, 10.78, 8.39, 11.65],
    goose_a: [8.78, 11.07, 4.54, 11.38],
    malz_a:  [7.14, 8.40, 15.46, 9.46],
    malz_n:  [4.21, 2.67, 7.37, 1.37],
    col_a:   [18.54, 16.54, 20.53, 14.12],
  },
  ef: {
    malz_a: [13386.98, 11213.56, 23780.15, 14551.28],
    malz_n: [10252.38, 4626.78, 14739.63, 2742.07],
  },
  reg_a: {
    'Mapapi':      [2.93, 6.76, 4.80, 3.37],
    'NE Norte':    [19.64, 14.79, 18.68, 4.64],
    'NE Sul':      [10.98, 7.72, 22.48, 20.41],
    'NO Araguaia': [0, 0, 0, 0],
    'NO Centro':   [1.17, 7.51, 30.51, 14.34],
  },
  reg_n: {
    'Mapapi':      [0.92, 1.18, -0.72, -3.21],
    'NE Norte':    [13.9, 7.94, 9.90, -2.28],
    'NE Sul':      [7.18, 2.33, 12.77, 9.79],
    'NO Araguaia': [-1.18, -3.78, -4.93, -6.32],
    'NO Centro':   [-0.36, 1.89, 18.66, 4.84],
  },
  wsnp_m: [16200, 9000, 20520, 0],
  tran_m: [0, 77, 52, 0],
  sp: {
    gsuf: [11.85, 5.21, 7.70, 7.36],
    msuf: [18.32, 18.79, 7.38, 4.56],
    csuf: [46.52, 64.95, 60.70, 63.90],
  },
  pcp: {
    aq: [12240, 10800, 12600, 12600], aq_c: 12600,
    pe: [27000, 19800, 27000, 27000], pe_c: 27000,
    goose_pe: [5400, 14400, 0, 12600],
    malz_aq:  [0, 9000, 7560, 0],
    malz_pe:  [16200, 0, 12960, 0],
    pat_aq:   [12240, 1800, 5040, 12600],
    col_pe:   [5400, 0, 10800, 0],
  },
  tp: {
    cam: [7200, 7200, 7200, 7200],
    fm:  [4107.4, 0, 0, 0],
    cdr: [5400, 5400, 5400, 5400],
  },
}

// ── CHART DEFAULTS ────────────────────────────────────────────────────
const baseOpts = (yCallback?: (v: number) => string) => ({
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: { labels: { color: '#9A9090', font: { size: 10, family: 'Sora' }, boxWidth: 10, padding: 11 } },
    tooltip: { backgroundColor: '#1E1E26', titleColor: '#F0ECE8', bodyColor: '#9A9090', borderColor: 'rgba(139,26,46,.4)', borderWidth: 1, padding: 9 },
  },
  scales: {
    x: { grid: { color: 'rgba(255,255,255,.04)' }, ticks: { color: '#9A9090', font: { size: 9 } } },
    y: { grid: { color: 'rgba(255,255,255,.04)' }, ticks: { color: '#9A9090', font: { size: 9 }, ...(yCallback ? { callback: yCallback } : {}) } },
  },
})
const hl = (v: number) => Math.abs(v) >= 1000 ? `${(v / 1000).toFixed(1)}k` : v.toFixed(0)
const metaLine = { label: 'Meta 12', data: [12, 12, 12, 12], borderColor: CVR, borderDash: [6, 4], borderWidth: 1.5, pointRadius: 0 }

// ── HEATMAP ───────────────────────────────────────────────────────────
function Heatmap({ data }: { data: Record<string, number[]> }) {
  const cls = (v: number) => v >= 12 ? 'cell-ok' : v >= 5 ? 'cell-warn' : 'cell-bad'
  return (
    <table className="ht">
      <thead><tr><th>Região</th>{W.map(w => <th key={w}>{w}</th>)}</tr></thead>
      <tbody>
        {Object.entries(data).map(([reg, vals]) => (
          <tr key={reg}>
            <td>{reg}</td>
            {vals.map((v, i) => <td key={i} className={cls(v)}>{v.toFixed(1)}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

// ── BADGE ─────────────────────────────────────────────────────────────
function Badge({ text, type }: { text: string; type: 'danger' | 'warn' | 'info' | 'success' }) {
  return <span className={`badge b${type}`}>{text}</span>
}

// ── KPI ───────────────────────────────────────────────────────────────
function KPI({ label, value, sub, accent }: { label: string; value: string; sub: string; accent: string }) {
  return (
    <div className="kpi" style={{ '--ac': accent } as React.CSSProperties}>
      <div className="kl">{label}</div>
      <div className="kv">{value}</div>
      <div className="ks">{sub}</div>
    </div>
  )
}

// ── CARD ──────────────────────────────────────────────────────────────
function Card({ title, sub, badge, children }: { title: string; sub?: string; badge?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="card">
      <div className="card-h">
        <div><div className="ct">{title}</div>{sub && <div className="cs">{sub}</div>}</div>
        {badge}
      </div>
      <div className="cb">{children}</div>
    </div>
  )
}

// ── PANELS ────────────────────────────────────────────────────────────
function PanelKpis() {
  return (
    <>
      <div className="k4">
        <KPI label="Impacto Demanda Malzbier" value="+30%" sub="+3.134 HL em W0 · +3.375 HL em W1" accent={CVR} />
        <KPI label="DOI Malzbier W3 (Nova)" value="1,37d" sub="vs 9,46d atual · Meta = 12 dias" accent={CL} />
        <KPI label="PE541 W0 / W2 / W3" value="100%" sub="27.000/27.000 HL · linha no limite" accent={CV} />
        <KPI label="Transf. Goose → NENO" value="54,5k HL" sub="16.707 (W0) + 3×12.600 HL programados" accent={CA} />
      </div>
      <div className="g2">
        <Card title="DOI Malzbier NENO — Atual vs Nova Demanda" sub="Cenário +30% Fev · Suf.f(d) por semana">
          <Line height={200} options={baseOpts(v => `${v}d`) as any} data={{ labels: W, datasets: [
            { label: 'DOI Atual', data: DATA.doi.malz_a, borderColor: CG, borderDash: [4, 3], borderWidth: 2, pointRadius: 4, fill: false },
            { label: 'DOI Nova (+30%)', data: DATA.doi.malz_n, borderColor: CGD, backgroundColor: 'rgba(212,168,67,.1)', fill: true, tension: .3, pointRadius: 5, borderWidth: 2.5 },
            { ...metaLine },
          ]}} />
        </Card>
        <Card title="Demanda NENO por SKU (Cenário Atual)" sub="HL por semana · empilhado">
          <Bar height={200} options={{ ...baseOpts(hl as any), scales: { x: { stacked: true }, y: { stacked: true, ticks: { callback: hl } } } } as any} data={{ labels: W, datasets: [
            { label: 'Patagonia', data: DATA.dem.pat_a, backgroundColor: CA + 'BB', borderRadius: 3 },
            { label: 'Goose', data: DATA.dem.goose_a, backgroundColor: CL + 'BB', borderRadius: 3 },
            { label: 'Malzbier', data: DATA.dem.malz_a, backgroundColor: CV + 'BB', borderRadius: 3 },
            { label: 'Colorado', data: DATA.dem.col_a, backgroundColor: CR + 'BB', borderRadius: 3 },
          ]}} />
        </Card>
      </div>
      <div className="g2">
        <Card title="EF Malzbier — Atual vs Nova Demanda (HL)" sub="Estoque final total NENO por semana">
          <Line height={200} options={baseOpts(hl as any) as any} data={{ labels: W, datasets: [
            { label: 'EF Atual (HL)', data: DATA.ef.malz_a, borderColor: CA, borderWidth: 2, tension: .3, pointRadius: 4, fill: false },
            { label: 'EF Nova (HL)', data: DATA.ef.malz_n, borderColor: CVR, borderWidth: 2.5, tension: .3, pointRadius: 5, backgroundColor: 'rgba(192,57,43,.08)', fill: true },
          ]}} />
        </Card>
        <Card title="Custos Unitários por SKU (R$/HL)" sub="Produção SP · Transferência · MACO">
          <Bar height={200} options={{ ...baseOpts(), plugins: { legend: { display: false } }, scales: { x: { ticks: { color: '#9A9090', font: { size: 8 } } }, y: { ticks: { callback: (v: any) => `R$${v}` } } } } as any} data={{ labels: ['Prod\nMalz','Prod\nGoose','Prod\nCol','Transf\nMalz','Transf\nGoose','MACO\nCol','MACO\nGoose','MACO\nMalz'], datasets: [{ label: 'R$/HL', data: [149, 155, 150, 84.58, 82.40, 300, 350, 285], backgroundColor: [CV+'99',CL+'99',CR+'99',CV+'66',CL+'66',CR+'CC',CL+'CC',CV+'CC'], borderRadius: 3 }] }} />
        </Card>
      </div>
    </>
  )
}

function PanelDemanda() {
  const demChart = (a: number[], n: number[], cor: string) => ({
    labels: W,
    datasets: [
      { label: 'Atual', data: a, borderColor: CG, borderDash: [4, 3], borderWidth: 1.8, pointRadius: 3, fill: false },
      { label: 'Nova', data: n, borderColor: cor, backgroundColor: cor + '18', fill: true, tension: .3, pointRadius: 4, borderWidth: 2.2 },
    ]
  })
  const opts = baseOpts(hl as any) as any
  return (
    <>
      <div className="g2">
        <Card title="Malzbier Brahma LN355 — Demanda NENO" sub="+30% em W0–W3 vs cenário atual" badge={<Badge text="+30%" type="danger" />}>
          <Line height={185} options={opts} data={demChart(DATA.dem.malz_a, DATA.dem.malz_n, CV)} />
        </Card>
        <Card title="Patagonia Amber Lager LN355" sub="Sem alteração no cenário nova demanda" badge={<Badge text="Sem mudança" type="info" />}>
          <Line height={185} options={opts} data={demChart(DATA.dem.pat_a, DATA.dem.pat_a, CA)} />
        </Card>
      </div>
      <div className="g2">
        <Card title="Goose Island Midway LN" sub="Restrição elaboração PE · Transferências SP programadas" badge={<Badge text="Restrição PE" type="warn" />}>
          <Line height={185} options={opts} data={demChart(DATA.dem.goose_a, DATA.dem.goose_a, CL)} />
        </Card>
        <Card title="Colorado Lager LN355" sub="Sem alteração no cenário nova demanda" badge={<Badge text="Sem mudança" type="info" />}>
          <Line height={185} options={opts} data={demChart(DATA.dem.col_a, DATA.dem.col_a, CR)} />
        </Card>
      </div>
      <Card title="Demanda NENO Total — Atual × Nova (HL reais do Excel)">
        <div className="tb-wrap">
          <table className="dt">
            <thead><tr><th>SKU</th><th>W0 At.</th><th>W0 Nova</th><th>W1 At.</th><th>W1 Nova</th><th>W2 At.</th><th>W2 Nova</th><th>W3 At.</th><th>W3 Nova</th><th>Δ</th></tr></thead>
            <tbody>
              <tr><td><span className="sn" style={{color:CV}}>Malzbier</span></td><td>10.448,7</td><td style={{color:'#e74c3c'}}>13.583,3</td><td>11.250,6</td><td style={{color:'#e74c3c'}}>14.625,8</td><td>8.005,8</td><td style={{color:'#e74c3c'}}>10.407,5</td><td>9.229,0</td><td style={{color:'#e74c3c'}}>11.997,6</td><td><Badge text="+30%" type="danger"/></td></tr>
              <tr><td><span className="sn" style={{color:CA}}>Patagonia</span></td><td>8.419,3</td><td>8.419,3</td><td>9.248,5</td><td>9.248,5</td><td>6.802,9</td><td>6.802,9</td><td>7.456,6</td><td>7.456,6</td><td><Badge text="0%" type="info"/></td></tr>
              <tr><td><span className="sn" style={{color:CL}}>Goose Island</span></td><td>14.841,9</td><td>14.841,9</td><td>15.479,0</td><td>15.479,0</td><td>11.700,6</td><td>11.700,6</td><td>13.049,4</td><td>13.049,4</td><td><Badge text="0%" type="info"/></td></tr>
              <tr><td><span className="sn" style={{color:CR}}>Colorado</span></td><td>6.052,2</td><td>6.052,2</td><td>6.712,9</td><td>6.712,9</td><td>5.004,3</td><td>5.004,3</td><td>5.615,9</td><td>5.615,9</td><td><Badge text="0%" type="info"/></td></tr>
              <tr style={{background:'rgba(255,255,255,.02)'}}><td><span className="sn">TOTAL</span></td><td>39.362,1</td><td style={{color:'#e74c3c'}}>42.496,7</td><td>42.691,0</td><td style={{color:'#e74c3c'}}>46.066,2</td><td>31.513,6</td><td style={{color:'#e74c3c'}}>33.915,3</td><td>35.349,8</td><td style={{color:'#e74c3c'}}>38.119,2</td><td><Badge text="+8%" type="danger"/></td></tr>
            </tbody>
          </table>
        </div>
      </Card>
    </>
  )
}

function PanelDoi() {
  const doiOpts = { ...baseOpts(v => `${v}d`), scales: { x: { grid: { color: 'rgba(255,255,255,.04)' }, ticks: { color: '#9A9090', font: { size: 9 } } }, y: { min: -2, grid: { color: 'rgba(255,255,255,.04)' }, ticks: { color: '#9A9090', font: { size: 9 }, callback: (v: any) => `${v}d` } } } } as any
  return (
    <>
      <div className="g2">
        <Card title="DOI NENO — Todos SKUs (Cenário Atual)" sub="Suf.f(d) total NENO · Meta = 12 dias">
          <Line height={220} options={doiOpts} data={{ labels: W, datasets: [
            { label: 'Patagonia', data: DATA.doi.pat_a, borderColor: CA, pointRadius: 5, tension: .3, borderWidth: 2.2 },
            { label: 'Goose', data: DATA.doi.goose_a, borderColor: CL, pointRadius: 5, tension: .3, borderWidth: 2.2 },
            { label: 'Malzbier', data: DATA.doi.malz_a, borderColor: CV, pointRadius: 5, tension: .3, borderWidth: 2.2 },
            { label: 'Colorado', data: DATA.doi.col_a, borderColor: CR, pointRadius: 5, tension: .3, borderWidth: 2.2 },
            { ...metaLine },
          ]}} />
          <div className="leg">
            {[['Patagonia', CA],['Goose', CL],['Malzbier', CV],['Colorado', CR]].map(([l,c]) => (
              <div key={l} className="ld"><span style={{background:c as string}}></span>{l}</div>
            ))}
          </div>
        </Card>
        <Card title="EF Malzbier NENO — Atual vs Nova (+30%)" sub="HL estoque final total NENO">
          <Line height={220} options={baseOpts(hl as any) as any} data={{ labels: W, datasets: [
            { label: 'EF Atual', data: DATA.ef.malz_a, borderColor: CA, borderWidth: 2, tension: .3, pointRadius: 4, fill: false },
            { label: 'EF Nova (+30%)', data: DATA.ef.malz_n, borderColor: CVR, borderWidth: 2.5, tension: .3, pointRadius: 5, backgroundColor: 'rgba(192,57,43,.1)', fill: true },
          ]}} />
        </Card>
      </div>
      <Card title="Heatmap DOI Malzbier por Região — Atual vs Nova" sub="Verde ≥12d · Amarelo 5–11d · Vermelho <5d">
        <p className="hm-lbl">CENÁRIO ATUAL</p>
        <Heatmap data={DATA.reg_a} />
        <p className="hm-lbl" style={{marginTop:14}}>CENÁRIO NOVA DEMANDA (+30% Malzbier)</p>
        <Heatmap data={DATA.reg_n} />
      </Card>
      <div className="g2" style={{marginTop:16}}>
        <Card title="Composição WSNP + Trânsito — Malzbier NENO" sub="W0=16.200 / W1=9.000 / W2=20.520 / W3=0 WSNP">
          <Bar height={200} options={{ ...baseOpts(), scales: { x: { stacked: true }, y: { stacked: true, ticks: { callback: hl } } } } as any} data={{ labels: W, datasets: [
            { label: 'WSNP', data: DATA.wsnp_m, backgroundColor: CA + 'CC', borderRadius: 2 },
            { label: 'Trânsito', data: DATA.tran_m, backgroundColor: CG + '88', borderRadius: 2 },
          ]}} />
        </Card>
        <Card title="DOI São Paulo — Goose / Malzbier / Colorado" sub="Suficiência SP após transferências programadas">
          <Line height={200} options={{ ...baseOpts(), scales: { x: { ticks: { color: '#9A9090' } }, y: { ticks: { callback: (v: any) => `${v}d` } } } } as any} data={{ labels: W, datasets: [
            { label: 'Goose SP', data: DATA.sp.gsuf, borderColor: CL, pointRadius: 4, borderWidth: 2, tension: .3 },
            { label: 'Malzbier SP', data: DATA.sp.msuf, borderColor: CV, pointRadius: 4, borderWidth: 2, tension: .3 },
            { label: 'Colorado SP', data: DATA.sp.csuf, borderColor: CR, pointRadius: 4, borderWidth: 2, tension: .3 },
            { ...metaLine },
          ]}} />
        </Card>
      </div>
    </>
  )
}

function PanelProducao() {
  const aqPct = DATA.pcp.aq.map(v => +(v / DATA.pcp.aq_c * 100).toFixed(1))
  const pePct = DATA.pcp.pe.map(v => +(v / DATA.pcp.pe_c * 100).toFixed(1))
  return (
    <>
      <div className="k3">
        <KPI label="Aquiraz AQ541 — Capacidade" value="12.600 HL" sub="por semana · 72.000 grf/hora" accent={CV} />
        <KPI label="Pernambuco PE541 — Capacidade" value="27.000 HL" sub="por semana · 108.000 grf/hora" accent={CL} />
        <KPI label="Ociosidade PE541 (W1)" value="7.200 HL" sub="Única semana com folga · W0/W2/W3 = 100%" accent={CVR} />
      </div>
      <div className="g2">
        <Card title="Utilização das Linhas (% da Capacidade)" sub="AQ541 cap 12.600 · PE541 cap 27.000 HL/semana">
          <Bar height={220} options={{ ...baseOpts(), scales: { x: { ticks: { color: '#9A9090', font: { size: 9 } } }, y: { max: 115, ticks: { callback: (v: any) => `${v}%` } } } } as any} data={{ labels: W, datasets: [
            { label: 'Aquiraz AQ541', data: aqPct, backgroundColor: aqPct.map(v => v >= 100 ? CVR + 'BB' : v >= 90 ? CL + 'BB' : CV + 'BB'), borderRadius: 3 },
            { label: 'Pernambuco PE541', data: pePct, backgroundColor: pePct.map(v => v >= 100 ? CVR + 'BB' : v >= 80 ? CL + 'BB' : CA + 'BB'), borderRadius: 3 },
          ]}} />
        </Card>
        <Card title="Mix de Produção por SKU e Linha (HL)" sub="Patagonia + Malzbier em Aquiraz · Goose + Malzbier + Colorado em PE">
          <Bar height={220} options={{ ...baseOpts(), scales: { x: { stacked: true }, y: { stacked: true, ticks: { callback: hl } } }, plugins: { legend: { labels: { font: { size: 9 }, boxWidth: 8 } } } } as any} data={{ labels: W, datasets: [
            { label: 'Patagonia (AQ)', data: DATA.pcp.pat_aq, backgroundColor: CA + 'CC', borderRadius: 2 },
            { label: 'Malzbier (AQ)', data: DATA.pcp.malz_aq, backgroundColor: CV + 'AA', borderRadius: 2 },
            { label: 'Goose (PE)', data: DATA.pcp.goose_pe, backgroundColor: CL + 'CC', borderRadius: 2 },
            { label: 'Malzbier (PE)', data: DATA.pcp.malz_pe, backgroundColor: CV + '66', borderRadius: 2 },
            { label: 'Colorado (PE)', data: DATA.pcp.col_pe, backgroundColor: CR + 'CC', borderRadius: 2 },
          ]}} />
        </Card>
      </div>
      <Card title="Plano PCP Detalhado — HL por SKU, Linha e Semana">
        <div className="tb-wrap">
          <table className="dt">
            <thead><tr><th>Planta</th><th>Linha</th><th>SKU</th><th>W0</th><th>W1</th><th>W2</th><th>W3</th><th>Total</th></tr></thead>
            <tbody>
              <tr><td>Aquiraz (CE)</td><td>L541</td><td><span className="sn" style={{color:CA}}>Patagonia</span></td><td>12.240</td><td>1.800</td><td>5.040</td><td>12.600</td><td style={{color:CGD}}>31.680</td></tr>
              <tr><td>Aquiraz (CE)</td><td>L541</td><td><span className="sn" style={{color:CV}}>Malzbier</span></td><td>0</td><td>9.000</td><td>7.560</td><td>0</td><td style={{color:CGD}}>16.560</td></tr>
              <tr style={{background:'rgba(255,255,255,.025)'}}><td colSpan={3}><strong>Subtotal Aquiraz</strong></td><td>12.240</td><td>10.800</td><td>12.600</td><td>12.600</td><td style={{color:CGD}}>48.240</td></tr>
              <tr><td>Pernambuco (PE)</td><td>L541</td><td><span className="sn" style={{color:CL}}>Goose Island</span></td><td>5.400</td><td>14.400</td><td>0</td><td>12.600</td><td style={{color:CGD}}>32.400</td></tr>
              <tr><td>Pernambuco (PE)</td><td>L541</td><td><span className="sn" style={{color:CV}}>Malzbier</span></td><td>16.200</td><td>0</td><td>12.960</td><td>0</td><td style={{color:CGD}}>29.160</td></tr>
              <tr><td>Pernambuco (PE)</td><td>L541</td><td><span className="sn" style={{color:CR}}>Colorado</span></td><td>5.400</td><td>0</td><td>10.800</td><td>0</td><td style={{color:CGD}}>16.200</td></tr>
              <tr style={{background:'rgba(255,255,255,.025)'}}><td colSpan={3}><strong>Subtotal Pernambuco</strong></td><td>27.000</td><td style={{color:'#2ecc71'}}>19.800</td><td style={{color:'#e67e22'}}>27.000</td><td style={{color:'#e67e22'}}>27.000</td><td style={{color:CGD}}>100.800</td></tr>
              <tr><td colSpan={3} style={{fontSize:10,color:'#9A9090'}}>Capacidade Livre PE541</td><td style={{color:'#e74c3c'}}>0</td><td style={{color:'#2ecc71'}}>7.200</td><td style={{color:'#e74c3c'}}>0</td><td style={{color:'#e74c3c'}}>0</td><td>—</td></tr>
            </tbody>
          </table>
        </div>
      </Card>
    </>
  )
}

function PanelCustos() {
  const cam = DATA.tp.cam.reduce((a, b) => a + b, 0) * 82.40
  const fm = DATA.tp.fm.reduce((a, b) => a + b, 0) * 88.30
  const cdr = DATA.tp.cdr.reduce((a, b) => a + b, 0) * 82.40
  const tot = cam + fm + cdr
  const bars = [
    { l: 'Goose: SP→Camaçari', v: cam, c: CL },
    { l: 'Goose: SP→FonteMata', v: fm, c: CL + '88' },
    { l: 'Goose: SP→CDR Bahia', v: cdr, c: CL + '66' },
  ]
  return (
    <>
      <div className="k4">
        <KPI label="Prod. Malzbier (SP)" value="R$149/HL" sub="Jaguariúna → Camaçari" accent={CV} />
        <KPI label="Prod. Goose (SP)" value="R$155/HL" sub="Jacareí → FonteMata" accent={CL} />
        <KPI label="MACO Goose (maior)" value="R$350/HL" sub="Maior margem do portfólio LN" accent={CR} />
        <KPI label="Custo Transf. Malz→FM" value="R$95,33/HL" sub="Rota mais cara do portfólio" accent={CA} />
      </div>
      <div className="g2">
        <Card title="Custo de Transferência SP→NENO (R$/HL)" sub="Por SKU e destino: Camaçari (BA) e FonteMata (PB)">
          <Bar height={200} options={{ ...baseOpts(), plugins: { legend: { display: false } }, scales: { x: { ticks: { color: '#9A9090', font: { size: 8 } } }, y: { min: 60, ticks: { callback: (v: any) => `R$${v}` } } } } as any} data={{ labels: ['Malzbier\n→Cam','Malzbier\n→FM','Goose\n→Cam','Goose\n→FM','Colorado\n→Cam','Colorado\n→FM'], datasets: [{ label: 'R$/HL', data: [84.58, 95.33, 82.40, 88.30, 76.59, 82.08], backgroundColor: [CV+'BB',CV+'88',CL+'BB',CL+'88',CR+'BB',CR+'88'], borderRadius: 4 }] }} />
        </Card>
        <Card title="MACO vs Custo Produção SP (R$/HL)" sub="Margem de contribuição vs custo incremental">
          <Bar height={200} options={{ ...baseOpts(), scales: { x: { ticks: { color: '#9A9090' } }, y: { ticks: { callback: (v: any) => `R$${v}` } } } } as any} data={{ labels: ['Colorado', 'Goose', 'Malzbier'], datasets: [
            { label: 'MACO (R$/HL)', data: [300, 350, 285], backgroundColor: [CR+'BB', CL+'BB', CV+'BB'], borderRadius: 4 },
            { label: 'Custo Prod SP (R$/HL)', data: [150, 155, 149], backgroundColor: [CR+'44', CL+'44', CV+'44'], borderRadius: 4 },
          ]}} />
        </Card>
      </div>
      <Card title="Custo Estimado Transferências Goose (únicas transferências programadas no Excel)" sub={`Total 54.507 HL · Cabotagem SP→NENO`}>
        {bars.map(x => (
          <div key={x.l} className="ar">
            <div className="al">{x.l}</div>
            <div className="aw"><div className="ab" style={{ width: `${(x.v / tot * 100).toFixed(0)}%`, background: x.c }} /></div>
            <div className="av">R${(x.v / 1000).toFixed(0)}k</div>
          </div>
        ))}
        <div style={{ fontSize: 11, color: '#9A9090', marginTop: 10, textAlign: 'right', fontFamily: 'IBM Plex Mono, monospace' }}>
          Total: <strong style={{ color: CGD }}>R${(tot / 1000).toFixed(0)}k</strong>
        </div>
      </Card>
    </>
  )
}

function PanelRegioes() {
  const REGS = Object.keys(DATA.reg_a)
  const CRS = [CA, CL, CV, CR, CG]
  const doiOpts = { ...baseOpts(v => `${v}d`), scales: { x: { ticks: { color: '#9A9090', font: { size: 9 } } }, y: { ticks: { callback: (v: any) => `${v}d` } } } } as any
  const doiNOpts = { ...doiOpts, scales: { ...doiOpts.scales, y: { min: -8, ticks: { callback: (v: any) => `${v}d` } } } } as any
  const cls = (v: number) => v < 0 ? { color: '#e74c3c' } : v < 5 ? { color: '#e67e22' } : { color: '#2ecc71' }
  return (
    <>
      <div className="g2">
        <Card title="DOI Malzbier por Região — Cenário Atual" sub="Suf.f(d) por sub-região ao longo das semanas">
          <Line height={220} options={doiOpts} data={{ labels: W, datasets: [...REGS.map((r, i) => ({ label: r, data: DATA.reg_a[r as keyof typeof DATA.reg_a], borderColor: CRS[i], pointRadius: 4, tension: .3, borderWidth: 2 })), { ...metaLine }] }} />
        </Card>
        <Card title="DOI Malzbier por Região — Nova Demanda (+30%)" sub="Negativo = ruptura de estoque real">
          <Line height={220} options={doiNOpts} data={{ labels: W, datasets: [...REGS.map((r, i) => ({ label: r, data: DATA.reg_n[r as keyof typeof DATA.reg_n], borderColor: CRS[i], pointRadius: 4, tension: .3, borderWidth: 2 })), { ...metaLine }] }} />
        </Card>
      </div>
      <Card title="Transferências Programadas Goose SP→NENO (HL reais)" sub="Única transferência com dados reais no arquivo · Modal Cabotagem">
        <Bar height={180} options={{ ...baseOpts(), scales: { x: { stacked: true }, y: { stacked: true, ticks: { callback: hl } } }, plugins: { legend: { display: false } } } as any} data={{ labels: W, datasets: [
          { label: 'SP→Camaçari', data: DATA.tp.cam, backgroundColor: CL + 'CC', borderRadius: 2 },
          { label: 'SP→FonteMata', data: DATA.tp.fm, backgroundColor: CA + 'CC', borderRadius: 2 },
          { label: 'SP→CDR Bahia', data: DATA.tp.cdr, backgroundColor: CV + 'CC', borderRadius: 2 },
        ]}} />
        <div className="leg" style={{borderTop:'1px solid rgba(139,26,46,.3)',marginTop:8}}>
          <div className="ld"><span style={{background:CL}}></span>SP→Camaçari</div>
          <div className="ld"><span style={{background:CA}}></span>SP→FonteMata</div>
          <div className="ld"><span style={{background:CV}}></span>SP→CDR Bahia</div>
        </div>
      </Card>
      <div className="g2" style={{marginTop:16}}>
        <Card title="DOI São Paulo por SKU" sub="Goose · Malzbier · Colorado após transferências">
          <Line height={220} options={doiOpts} data={{ labels: W, datasets: [
            { label: 'Goose SP', data: DATA.sp.gsuf, borderColor: CL, pointRadius: 5, borderWidth: 2.2, tension: .3 },
            { label: 'Malzbier SP', data: DATA.sp.msuf, borderColor: CV, pointRadius: 5, borderWidth: 2.2, tension: .3 },
            { label: 'Colorado SP', data: DATA.sp.csuf, borderColor: CR, pointRadius: 5, borderWidth: 2.2, tension: .3 },
            { ...metaLine },
          ]}} />
        </Card>
        <Card title="Situação por Região — DOI Nova Demanda Malzbier" sub="Pior valor e semanas críticas">
          <div className="tb-wrap">
            <table className="dt">
              <thead><tr><th>Região</th><th>W0</th><th>W1</th><th>W2</th><th>W3</th><th>Pior</th></tr></thead>
              <tbody>
                {REGS.map(r => {
                  const vals = DATA.reg_n[r as keyof typeof DATA.reg_n]
                  const worst = Math.min(...vals)
                  return (
                    <tr key={r}>
                      <td><span className="sn">{r}</span></td>
                      {vals.map((v, i) => <td key={i} style={cls(v)}>{v.toFixed(1)}d</td>)}
                      <td style={cls(worst)}><strong>{worst.toFixed(1)}d</strong></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </>
  )
}

// ── APP ───────────────────────────────────────────────────────────────
type Tab = 'kpis' | 'demanda' | 'doi' | 'producao' | 'custos' | 'regioes'
const TABS: { id: Tab; label: string }[] = [
  { id: 'kpis', label: 'Resumo' },
  { id: 'demanda', label: 'Demanda' },
  { id: 'doi', label: 'DOI · Estoque' },
  { id: 'producao', label: 'Produção PCP' },
  { id: 'custos', label: 'Custos' },
  { id: 'regioes', label: 'Regiões' },
]

export default function App() {
  const [active, setActive] = useState<Tab>('kpis')

  return (
    <div className="app">
      {/* HEADER */}
      <header>
        <div className="hdr">
          <div className="brand">
            <div className="ic">LN</div>
            <div>
              <h1>Dashboard Long Neck — NENO</h1>
              <p className="sub-hdr">Dados reais · Analise_LongNeck_WSNP_Rafael.xlsb · Fev/2026</p>
            </div>
          </div>
          <div className="hdr-meta">
            <strong>W0–W3 · Fev 2026</strong><br />
            Linhas: AQ541 (Aquiraz/CE) · PE541 (Pernambuco/PE)<br />
            SKUs: Patagonia · Goose · Malzbier · Colorado
          </div>
        </div>
      </header>

      {/* TABS */}
      <nav className="tabs-bar">
        <div className="tabs">
          {TABS.map(t => (
            <button key={t.id} className={`tab${active === t.id ? ' active' : ''}`} onClick={() => setActive(t.id)}>
              {t.label}
            </button>
          ))}
        </div>
      </nav>

      {/* MAIN */}
      <main>
        <div className="sec">{TABS.find(t => t.id === active)?.label} · Dados Reais do Excel</div>
        {active === 'kpis'     && <PanelKpis />}
        {active === 'demanda'  && <PanelDemanda />}
        {active === 'doi'      && <PanelDoi />}
        {active === 'producao' && <PanelProducao />}
        {active === 'custos'   && <PanelCustos />}
        {active === 'regioes'  && <PanelRegioes />}
      </main>
    </div>
  )
}