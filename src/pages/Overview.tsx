import { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";
import { demandaRegional, demandaVsProducao, kpis, W, demandaNENO, wsnpNENO, capacidadeMax } from "../data/caseData";
import { C, fmt, fmtM, baseOpts } from "../components/utils";

Chart.register(...registerables);

function BarRegional() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(()=>{
    if(!ref.current) return;
    const ch = new Chart(ref.current,{
      type:"bar",
      data:{
        labels: demandaRegional.map(d=>d.regiao),
        datasets:[
          { label:"Janeiro", data: demandaRegional.map(d=>d.jan), backgroundColor: C.blue+"99", borderRadius:3 },
          { label:"Fevereiro", data: demandaRegional.map(d=>d.fev), backgroundColor: C.gold+"bb", borderRadius:3 },
        ]
      },
      options:{
        ...baseOpts(),
        plugins:{
          ...baseOpts().plugins,
          legend:{display:true, labels:{color:C.text2, font:{size:11}, boxWidth:12, boxHeight:12}},
          tooltip:{
            ...baseOpts().plugins.tooltip,
            callbacks:{ label:(ctx)=>`${ctx.dataset.label}: ${ctx.parsed.y.toFixed(0)} KHL` }
          }
        }
      }
    });
    return ()=>ch.destroy();
  },[]);
  return <canvas ref={ref}/>;
}

function LineCapacidade() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(()=>{
    if(!ref.current) return;
    const ch = new Chart(ref.current,{
      type:"line",
      data:{
        labels: W,
        datasets:[
          { label:"Demanda Nova", data: demandaNENO, borderColor: C.orange, backgroundColor:"transparent", pointBackgroundColor:C.orange, pointRadius:4, borderWidth:2.2 },
          { label:"WSNP", data: wsnpNENO, borderColor: C.blue, backgroundColor:"transparent", pointBackgroundColor:C.blue, pointRadius:4, borderWidth:2.2 },
          { label:"Cap. Máxima", data: capacidadeMax, borderColor: C.red+"99", backgroundColor:"transparent", pointRadius:0, borderWidth:1.5, borderDash:[5,4] },
        ]
      },
      options:{
        ...baseOpts(),
        plugins:{
          ...baseOpts().plugins,
          legend:{display:true, labels:{color:C.text2, font:{size:11}, boxWidth:12, boxHeight:12}},
          tooltip:{
            ...baseOpts().plugins.tooltip,
            callbacks:{ label:(ctx)=>`${ctx.dataset.label}: ${fmt(ctx.parsed.y)} HL` }
          }
        },
        scales:{
          ...baseOpts().scales,
          y:{ ...baseOpts().scales.y, ticks:{ ...baseOpts().scales.y.ticks, callback:(v)=>` ${Number(v)/1000}k` } }
        }
      }
    });
    return ()=>ch.destroy();
  },[]);
  return <canvas ref={ref}/>;
}

export default function Overview() {
  return (
    <div className="page">
      <div className="page-tag">⬡ Visão Geral</div>
      <div className="page-title">Long Neck NENO — Contexto e Capacidade</div>
      <div className="page-sub">Crescimento premium pressiona capacidade instalada de 158 KHL/mês. Aumento de +30% Malzbier (fev) e +10% TT LN (mar) exige ação imediata.</div>

      {/* KPIs */}
      <div className="kpi-row" style={{gridTemplateColumns:"repeat(5,minmax(0,1fr))"}}>
        {[
          {label:"Custo Total Resolução", val:fmtM(kpis.custoTotal),    sub:"Alavancas 2+3+4",       ac:"var(--gold)"  },
          {label:"DOI Médio Final",       val:`${kpis.doiMedio}d`,       sub:"Meta: 12 dias",         ac:"var(--green)" },
          {label:"Regiões na Meta",       val:`${kpis.pctMeta}%`,        sub:"atende DOI ≥ 12",       ac:"var(--blue)"  },
          {label:"Gap Residual",          val:`${fmt(kpis.gapTotal)} HL`,sub:"100% em Patagonia",     ac:"var(--red)"   },
          {label:"Volume Enviado SP",     val:`${fmt(kpis.volSP)} HL`,   sub:"Alavancas 3+4",         ac:"var(--orange)"},
        ].map(k=>(
          <div key={k.label} className="kpi-card" style={{"--ac":k.ac} as React.CSSProperties}>
            <div className="kpi-label">{k.label}</div>
            <div className="kpi-val" style={{fontSize:18}}>{k.val}</div>
            <div className="kpi-sub">{k.sub}</div>
          </div>
        ))}
      </div>

      <div className="g2">
        {/* Demanda regional */}
        <div className="card">
          <div className="card-title">Demanda LN por regional — Jan vs Fev (KHL)</div>
          <div className="chart-wrap" style={{height:180}}><BarRegional/></div>
          <div className="info info-b" style={{marginTop:8}}>NENO tem o maior volume do Brasil — 201 KHL em Jan. Destaque em vermelho no slide.</div>
        </div>

        {/* Demanda vs cap */}
        <div className="card">
          <div className="card-title">Demanda nova vs WSNP vs capacidade máxima (HL/sem)</div>
          <div className="chart-wrap" style={{height:180}}><LineCapacidade/></div>
          <div className="info info-r" style={{marginTop:8}}>Demanda supera cap. máxima em 6 das 8 semanas. Pico: 50.673 HL em W5 vs cap. 39.600 HL.</div>
        </div>
      </div>

      {/* Estrutura + contexto */}
      <div className="g2">
        <div className="card">
          <div className="card-title">Estrutura produtiva NENO</div>
          <div style={{display:"flex",flexDirection:"column",gap:9}}>
            {[
              {linha:"AQ541",cap:108,skus:"Brahma Zero · Goose · Malzbier · Colorado · Beats · Bud Zero"},
              {linha:"NS541",cap:50, skus:"Malzbier · Colorado · Patagonia"},
            ].map(l=>(
              <div key={l.linha} style={{background:"var(--surface2)",borderRadius:8,padding:"11px 14px",borderLeft:"2px solid var(--gold)"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
                  <span style={{fontFamily:"var(--font-d)",fontWeight:700,fontSize:14}}>{l.linha}</span>
                  <span className="badge ba">{l.cap} KHL/mês</span>
                </div>
                <div style={{fontSize:11,color:"var(--text3)"}}>{l.skus}</div>
              </div>
            ))}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginTop:2}}>
              <div style={{background:"var(--surface2)",borderRadius:8,padding:"9px",textAlign:"center"}}>
                <div style={{fontSize:9,color:"var(--text3)",textTransform:"uppercase",letterSpacing:".06em",marginBottom:3}}>Cap. combinada</div>
                <div style={{fontFamily:"var(--font-d)",fontWeight:700,fontSize:17,color:"var(--text)"}}>158 KHL</div>
              </div>
              <div style={{background:"var(--red-bg)",borderRadius:8,padding:"9px",textAlign:"center"}}>
                <div style={{fontSize:9,color:"var(--red)",textTransform:"uppercase",letterSpacing:".06em",marginBottom:3}}>Demanda Jan</div>
                <div style={{fontFamily:"var(--font-d)",fontWeight:700,fontSize:17,color:"var(--red)"}}>201 KHL</div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-title">Demanda vs produção — Jan/Fev (HL)</div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {demandaVsProducao.map((d,i)=>{
              const colors=["var(--red)","var(--blue)","var(--blue)","var(--orange)","var(--green)"];
              return (
                <div key={i} className="prog-row">
                  <div className="prog-label">
                    <span style={{color:"var(--text2)"}}>{d.label}</span>
                    <span style={{fontWeight:600,color:"var(--text)"}}>{fmt(d.val)} HL</span>
                  </div>
                  <div className="prog-track">
                    <div className="prog-fill" style={{width:`${(d.val/210000)*100}%`,background:colors[i]}}/>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="info info-r">Gap produtivo Jan: <strong>57.219 HL</strong> — sistema já dependia de transferências antes do aumento.</div>

          <div style={{marginTop:14,display:"flex",flexDirection:"column",gap:7}}>
            <div className="card-title">Sub-regiões NENO</div>
            {[
              {r:"Mapapi",     dest:"CDR João Pessoa"},
              {r:"NE Norte",   dest:"CDR João Pessoa"},
              {r:"NE Sul",     dest:"CDR Camaçari (BA)"},
              {r:"NO Araguaia",dest:"Uberlândia (retirada)"},
              {r:"NO Centro",  dest:"CDR João Pessoa"},
            ].map((s,i)=>{
              const cs=["var(--gold)","var(--blue)","var(--green)","var(--purple)","var(--orange)"];
              return (
                <div key={s.r} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"5px 10px",background:"var(--surface2)",borderRadius:6,borderLeft:`2px solid ${cs[i]}`}}>
                  <span style={{fontSize:12,color:"var(--text)"}}>{s.r}</span>
                  <span style={{fontSize:10,color:"var(--text3)"}}>{s.dest}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
