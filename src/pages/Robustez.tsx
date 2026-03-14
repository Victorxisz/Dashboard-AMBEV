import { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";
import { robustez, doiCenarios, gapCenarios, doiPatCenarios, W } from "../data/caseData";
import { C, fmt, fmtM, baseOpts } from "../components/utils";

Chart.register(...registerables);

function DOICenarios() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(()=>{
    if(!ref.current) return;
    const ch = new Chart(ref.current,{
      type:"line",
      data:{
        labels:W,
        datasets:[
          { label:"-9% bias",  data:doiCenarios["-9% bias"],  borderColor:C.green,  backgroundColor:"transparent", pointBackgroundColor:C.green,  pointRadius:4, borderWidth:2.2 },
          { label:"Resolvido", data:doiCenarios["Resolvido"], borderColor:C.gold,   backgroundColor:"transparent", pointBackgroundColor:C.gold,   pointRadius:4, borderWidth:2.2 },
          { label:"+9% bias",  data:doiCenarios["+9% bias"],  borderColor:C.red,    backgroundColor:"transparent", pointBackgroundColor:C.red,    pointRadius:4, borderWidth:2.2 },
          { label:"Meta 12d",  data:Array(8).fill(12),        borderColor:C.red+"55", backgroundColor:"transparent", pointRadius:0, borderWidth:1.5, borderDash:[5,4] },
        ]
      },
      options:{
        ...baseOpts(),
        plugins:{
          ...baseOpts().plugins,
          legend:{display:true, labels:{color:C.text2, font:{size:11}, boxWidth:12, boxHeight:12, filter:(i)=>i.text!=="Meta 12d"}},
          tooltip:{...baseOpts().plugins.tooltip, callbacks:{label:(ctx)=>`${ctx.dataset.label}: ${ctx.parsed.y.toFixed(2)}d`}}
        },
        scales:{...baseOpts().scales, y:{...baseOpts().scales.y, min:8, max:18, ticks:{...baseOpts().scales.y.ticks, callback:(v)=>`${v}d`}}}
      }
    });
    return ()=>ch.destroy();
  },[]);
  return <canvas ref={ref}/>;
}

function GapCenarios() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(()=>{
    if(!ref.current) return;
    const ch = new Chart(ref.current,{
      type:"bar",
      data:{
        labels:W,
        datasets:[
          { label:"-9% bias",  data:gapCenarios["-9% bias"],  backgroundColor:C.green+"88",  borderRadius:3 },
          { label:"Resolvido", data:gapCenarios["Resolvido"], backgroundColor:C.gold+"bb",   borderRadius:3 },
          { label:"+9% bias",  data:gapCenarios["+9% bias"],  backgroundColor:C.red+"bb",    borderRadius:3 },
        ]
      },
      options:{
        ...baseOpts(),
        plugins:{
          ...baseOpts().plugins,
          legend:{display:true, labels:{color:C.text2, font:{size:11}, boxWidth:12, boxHeight:12}},
          tooltip:{...baseOpts().plugins.tooltip, callbacks:{label:(ctx)=>`${ctx.dataset.label}: ${fmt(ctx.parsed.y)} HL`}}
        },
        scales:{...baseOpts().scales, y:{...baseOpts().scales.y, ticks:{...baseOpts().scales.y.ticks, callback:(v)=>` ${Number(v)/1000}k`}}}
      }
    });
    return ()=>ch.destroy();
  },[]);
  return <canvas ref={ref}/>;
}

function PatagoniaCenarios() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(()=>{
    if(!ref.current) return;
    const ch = new Chart(ref.current,{
      type:"line",
      data:{
        labels:W,
        datasets:[
          { label:"-9% bias",  data:doiPatCenarios["-9% bias"],  borderColor:C.green,  backgroundColor:"transparent", pointBackgroundColor:doiPatCenarios["-9% bias"].map(v=>v<12?C.red:C.green),  pointRadius:4, borderWidth:2 },
          { label:"Resolvido", data:doiPatCenarios["Resolvido"], borderColor:C.gold,   backgroundColor:"transparent", pointBackgroundColor:doiPatCenarios["Resolvido"].map(v=>v<12?C.red:C.gold),   pointRadius:4, borderWidth:2 },
          { label:"+9% bias",  data:doiPatCenarios["+9% bias"],  borderColor:C.red,    backgroundColor:"transparent", pointBackgroundColor:doiPatCenarios["+9% bias"].map(v=>v<12?C.red:"#f97316"), pointRadius:4, borderWidth:2 },
          { label:"Meta 12d",  data:Array(8).fill(12), borderColor:C.red+"55", backgroundColor:"transparent", pointRadius:0, borderWidth:1.5, borderDash:[5,4] },
        ]
      },
      options:{
        ...baseOpts(),
        plugins:{
          ...baseOpts().plugins,
          legend:{display:true, labels:{color:C.text2, font:{size:11}, boxWidth:12, boxHeight:12, filter:(i)=>i.text!=="Meta 12d"}},
          tooltip:{...baseOpts().plugins.tooltip, callbacks:{label:(ctx)=>`${ctx.dataset.label}: ${ctx.parsed.y.toFixed(2)}d ${ctx.parsed.y<12?"⚠":""}`}}
        },
        scales:{...baseOpts().scales, y:{...baseOpts().scales.y, min:0, max:18, ticks:{...baseOpts().scales.y.ticks, callback:(v)=>`${v}d`}}}
      }
    });
    return ()=>ch.destroy();
  },[]);
  return <canvas ref={ref}/>;
}

export default function Robustez() {
  return (
    <div className="page">
      <div className="page-tag">◇ Robustez</div>
      <div className="page-title">Robustez & Situação da Patagonia</div>
      <div className="page-sub">Simulações com bias de ±9% na demanda e análise detalhada da Patagonia — único SKU com gap residual em todos os cenários.</div>

      {/* Tabela executiva */}
      <div className="card" style={{marginBottom:13}}>
        <div className="card-title">Tabela executiva — comparação dos 3 cenários</div>
        <table className="tbl">
          <thead>
            <tr>
              <th>Cenário</th>
              <th style={{textAlign:"right"}}>DOI médio</th>
              <th style={{textAlign:"right"}}>% na meta</th>
              <th style={{textAlign:"right"}}>Gap total (HL)</th>
              <th style={{textAlign:"right"}}>Custo total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {robustez.map(r=>{
              const isMinus = r.cenario==="-9% bias";
              const isBase  = r.cenario==="Resolvido";
              const color   = isMinus?"var(--green)":isBase?"var(--gold)":"var(--red)";
              const badge   = isMinus?"bg":isBase?"ba":"br";
              const status  = isMinus?"Confortável":isBase?"Base":"Crítico";
              return (
                <tr key={r.cenario}>
                  <td><div style={{display:"flex",alignItems:"center",gap:7}}>
                    <div style={{width:8,height:8,borderRadius:2,background:color,flexShrink:0}}/>
                    <span style={{color:isBase?"var(--text)":"var(--text2)",fontWeight:isBase?600:400}}>{r.cenario}</span>
                  </div></td>
                  <td style={{textAlign:"right",color:r.doiMedio>=12?"var(--green)":"var(--red)",fontWeight:700}}>{r.doiMedio.toFixed(2)}d</td>
                  <td style={{textAlign:"right",color:r.pctMeta>=90?"var(--green)":r.pctMeta>=75?"var(--gold)":"var(--red)",fontWeight:600}}>{r.pctMeta.toFixed(1)}%</td>
                  <td style={{textAlign:"right",color:r.gapTotal<5000?"var(--green)":r.gapTotal<30000?"var(--gold)":"var(--red)"}}>{fmt(r.gapTotal)}</td>
                  <td style={{textAlign:"right"}}>{fmtM(r.custoTotal)}</td>
                  <td><span className={`badge ${badge}`}>{status}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="g2">
        <div className="card">
          <div className="card-title">DOI médio NENO — 3 cenários (pontos vermelhos = abaixo de 12d)</div>
          <div className="chart-wrap" style={{height:190}}><DOICenarios/></div>
        </div>
        <div className="card">
          <div className="card-title">Gap total por semana (HL) — 3 cenários</div>
          <div className="chart-wrap" style={{height:190}}><GapCenarios/></div>
        </div>
      </div>

      {/* Patagonia por cenário */}
      <div className="g2">
        <div className="card">
          <div className="card-title">Patagonia — DOI por semana nos 3 cenários</div>
          <div className="chart-wrap" style={{height:190}}><PatagoniaCenarios/></div>
          <div className="info info-r" style={{marginTop:8}}>
            No cenário +9%: DOI cai para <strong>1,2d em W6</strong>. No cenário resolvido: <strong>5,2d em W6</strong>. Apenas no −9% o DOI se mantém próximo de 12d — mas ainda cai para 9,9d em W6.
          </div>
        </div>

        {/* Recomendação final */}
        <div className="card" style={{borderColor:"rgba(240,165,0,0.25)"}}>
          <div className="card-title" style={{color:"var(--gold)"}}>◆ Recomendação Final</div>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {[
              { q:"Seguir com os incentivos?", r:"Sim, com condição", d:"O custo de R$ 16,3M é justificado pelo market share — desde que a Patagonia seja habilitada na linha PE (AQ541) antes de fevereiro.", color:"var(--gold)" },
              { q:"Maior risco identificado?", r:"Patagonia em março", d:"DOI cai para 5,2d em W6 mesmo no cenário resolvido. Com +9% bias, colapsa para 1,2d. É o único ponto de ruptura real do plano.", color:"var(--red)" },
              { q:"Solução de longo prazo?", r:"Habilitar PE para Patagonia", d:"Adicionar Patagonia na linha AQ541 (PE) elimina a dependência exclusiva de CE e fecha o único gap residual do sistema.", color:"var(--green)" },
            ].map(item=>(
              <div key={item.q} style={{borderTop:`1.5px solid ${item.color}`,paddingTop:10}}>
                <div style={{fontSize:10,color:"var(--text3)",fontStyle:"italic",marginBottom:4}}>{item.q}</div>
                <div style={{fontFamily:"var(--font-d)",fontWeight:700,fontSize:13,color:item.color,marginBottom:4}}>{item.r}</div>
                <div style={{fontSize:11,color:"var(--text2)",lineHeight:1.55}}>{item.d}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
