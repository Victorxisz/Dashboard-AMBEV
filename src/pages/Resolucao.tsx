import { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";
import { doiSku, doiRegiao, gapSku, W, REGIOES, SKUS, SKU_COLORS } from "../data/caseData";
import { C, SKU_C, fmt, baseOpts, doiColor } from "../components/utils";

Chart.register(...registerables);

const DOI_META = 12;

function DOIporSKU() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(()=>{
    if(!ref.current) return;
    const ch = new Chart(ref.current,{
      type:"line",
      data:{
        labels: W,
        datasets:[
          ...SKUS.map(s=>({
            label: s,
            data: doiSku[s],
            borderColor: SKU_C[s],
            backgroundColor: "transparent",
            pointBackgroundColor: doiSku[s].map(v => v < DOI_META ? C.red : SKU_C[s]),
            pointRadius: 5,
            pointHoverRadius: 7,
            borderWidth: 2.2,
          })),
          { label:"Meta 12d", data:Array(8).fill(DOI_META), borderColor:C.red+"88", backgroundColor:"transparent", pointRadius:0, borderWidth:1.5, borderDash:[5,4] },
        ]
      },
      options:{
        ...baseOpts(),
        plugins:{
          ...baseOpts().plugins,
          legend:{display:true, labels:{color:C.text2, font:{size:11}, boxWidth:12, boxHeight:12, filter:(item)=>item.text!=="Meta 12d"}},
          tooltip:{
            ...baseOpts().plugins.tooltip,
            callbacks:{
              label:(ctx)=>{
                if(ctx.dataset.label==="Meta 12d") return null as unknown as string;
                const v = ctx.parsed.y;
                return `${ctx.dataset.label}: ${v.toFixed(1)}d ${v<DOI_META?"⚠":"✓"}`;
              }
            }
          }
        },
        scales:{
          ...baseOpts().scales,
          y:{...baseOpts().scales.y, min:0, max:22, ticks:{...baseOpts().scales.y.ticks, callback:(v)=>`${v}d`}}
        }
      }
    });
    return ()=>ch.destroy();
  },[]);
  return <canvas ref={ref}/>;
}

function GapSemana() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(()=>{
    if(!ref.current) return;
    const ch = new Chart(ref.current,{
      type:"bar",
      data:{
        labels: W,
        datasets:[{
          label:"Gap Patagonia (HL)",
          data: gapSku["Patagonia"],
          backgroundColor: W.map((_,i)=> gapSku["Patagonia"][i]>0 ? C.red+"bb" : C.green+"44"),
          borderRadius: 4,
        }]
      },
      options:{
        ...baseOpts(),
        plugins:{
          ...baseOpts().plugins,
          tooltip:{
            ...baseOpts().plugins.tooltip,
            callbacks:{ label:(ctx)=>`Gap: ${fmt(ctx.parsed.y)} HL` }
          }
        },
        scales:{
          ...baseOpts().scales,
          y:{...baseOpts().scales.y, ticks:{...baseOpts().scales.y.ticks, callback:(v)=>` ${Number(v)/1000}k`}}
        }
      }
    });
    return ()=>ch.destroy();
  },[]);
  return <canvas ref={ref}/>;
}

export default function Resolucao() {
  return (
    <div className="page">
      <div className="page-tag">◉ Resolução</div>
      <div className="page-title">Resultado Pós-Alavancas — NENO</div>
      <div className="page-sub">DOI por SKU após aplicação das 4 alavancas sequenciais. Patagonia é o único SKU com gap residual — concentrado em W2–W7.</div>

      {/* DOI por SKU */}
      <div className="g1">
        <div className="card">
          <div className="card-title">DOI médio por SKU por semana — pontos vermelhos indicam abaixo da meta</div>
          <div className="chart-wrap" style={{height:220}}><DOIporSKU/></div>
          <div className="info info-a" style={{marginTop:10}}>
            Goose, Malzbier e Colorado atingem ou superam DOI 12 em todas as semanas. Patagonia cai para <strong>5,2d em W6</strong> — único SKU com ruptura estrutural.
          </div>
        </div>
      </div>

      <div className="g2">
        {/* Gap Patagonia */}
        <div className="card">
          <div className="card-title">Gap residual por semana — 100% concentrado em Patagonia (HL)</div>
          <div className="chart-wrap" style={{height:170}}><GapSemana/></div>
          <div className="info info-r">Gap acumulado: <strong>28.730 HL</strong>. Pico em W6 (16/03): 9.344 HL. Causa: Patagonia só produz na planta CE (NS541).</div>
        </div>

        {/* Heatmap por região */}
        <div className="card">
          <div className="card-title">Heatmap DOI — região × semana (média todos SKUs)</div>
          <table className="heat-tbl">
            <thead>
              <tr>
                <th style={{textAlign:"left",paddingRight:8}}>Região</th>
                {W.map(w=><th key={w}>{w}</th>)}
              </tr>
            </thead>
            <tbody>
              {REGIOES.map(r=>(
                <tr key={r}>
                  <td className="rl">{r}</td>
                  {(doiRegiao[r]||[]).map((v,i)=>{
                    const c = doiColor(v);
                    return (
                      <td key={i} style={{padding:"2px 2px",textAlign:"center"}}>
                        <div className="heat-cell" style={{background:c.bg,color:c.fg}}>{v.toFixed(1)}</div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{display:"flex",gap:10,marginTop:8}}>
            {[["#7f1d1d","#fecaca","<6d"],["#7c2d12","#fed7aa","6–9d"],["#713f12","#fef08a","9–12d"],["#166534","#dcfce7","≥12d"],["#14532d","#bbf7d0","≥15d"]].map(([bg,fg,l])=>(
              <div key={l} style={{display:"flex",alignItems:"center",gap:4,fontSize:9,color:"var(--text3)"}}>
                <div style={{width:8,height:8,background:bg,borderRadius:2}}/>
                {l}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabela DOI por SKU */}
      <div className="card">
        <div className="card-title">DOI por SKU — tabela completa (células vermelhas = abaixo de 12d)</div>
        <table className="tbl">
          <thead>
            <tr>
              <th>SKU</th>
              {W.map(w=><th key={w} style={{textAlign:"right"}}>{w}</th>)}
              <th style={{textAlign:"right"}}>Mín.</th>
              <th style={{textAlign:"right"}}>Máx.</th>
            </tr>
          </thead>
          <tbody>
            {SKUS.map(s=>{
              const vals = doiSku[s];
              const min = Math.min(...vals), max = Math.max(...vals);
              return (
                <tr key={s}>
                  <td style={{color:SKU_COLORS[s],fontWeight:600}}>{s}</td>
                  {vals.map((v,i)=>(
                    <td key={i} style={{textAlign:"right",color:v<12?"var(--red)":"var(--green)",fontWeight:v<12?700:400}}>
                      {v.toFixed(1)}
                    </td>
                  ))}
                  <td style={{textAlign:"right",color:min<12?"var(--red)":"var(--green)",fontWeight:700}}>{min.toFixed(1)}</td>
                  <td style={{textAlign:"right",color:"var(--text2)"}}>{max.toFixed(1)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
