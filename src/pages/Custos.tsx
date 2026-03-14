import { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";
import { custoPorSemana, volSPsku, custoPorSku, kpis, W, SKUS } from "../data/caseData";
import { C, SKU_C, fmt, fmtM, baseOpts } from "../components/utils";

Chart.register(...registerables);

function CustoBar() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(()=>{
    if(!ref.current) return;
    const ch = new Chart(ref.current,{
      type:"bar",
      data:{
        labels: W,
        datasets:[
          { label:"Rodoviário",data:custoPorSemana.map(d=>d.rodo),backgroundColor:C.orange+"bb",stack:"c",borderRadius:3 },
          { label:"Cabotagem", data:custoPorSemana.map(d=>d.cabo),backgroundColor:C.blue+"bb",  stack:"c",borderRadius:3 },
        ]
      },
      options:{
        ...baseOpts(),
        plugins:{
          ...baseOpts().plugins,
          legend:{display:true, labels:{color:C.text2, font:{size:11}, boxWidth:12, boxHeight:12}},
          tooltip:{
            ...baseOpts().plugins.tooltip,
            callbacks:{
              label:(ctx)=>`${ctx.dataset.label}: ${fmtM(ctx.parsed.y)}`,
              footer:(items)=>{
                const t=items.reduce((a,i)=>a+i.parsed.y,0);
                return t>0?`Total: ${fmtM(t)}`:"";
              }
            }
          }
        },
        scales:{
          ...baseOpts().scales,
          x:{...baseOpts().scales.x, stacked:true},
          y:{...baseOpts().scales.y, stacked:true, ticks:{...baseOpts().scales.y.ticks, callback:(v)=>` R$${Number(v)/1_000_000}M`}}
        }
      }
    });
    return ()=>ch.destroy();
  },[]);
  return <canvas ref={ref}/>;
}

function VolSPBar() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(()=>{
    if(!ref.current) return;
    const datasets = SKUS.filter(s=>s!=="Patagonia").map(s=>({
      label: s,
      data: volSPsku[s],
      backgroundColor: SKU_C[s]+"bb",
      stack:"s",
      borderRadius:3,
    }));
    const ch = new Chart(ref.current,{
      type:"bar",
      data:{ labels:W, datasets },
      options:{
        ...baseOpts(),
        plugins:{
          ...baseOpts().plugins,
          legend:{display:true, labels:{color:C.text2, font:{size:11}, boxWidth:12, boxHeight:12}},
          tooltip:{
            ...baseOpts().plugins.tooltip,
            callbacks:{
              label:(ctx)=>`${ctx.dataset.label}: ${fmt(ctx.parsed.y)} HL`,
            }
          }
        },
        scales:{
          ...baseOpts().scales,
          x:{...baseOpts().scales.x, stacked:true},
          y:{...baseOpts().scales.y, stacked:true, ticks:{...baseOpts().scales.y.ticks, callback:(v)=>` ${Number(v)/1000}k`}}
        }
      }
    });
    return ()=>ch.destroy();
  },[]);
  return <canvas ref={ref}/>;
}

function CustoDoughnut() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(()=>{
    if(!ref.current) return;
    const ch = new Chart(ref.current,{
      type:"doughnut",
      data:{
        labels:["Alav. 2 — Prod. NENO","Alav. 3 — Est. SP","Alav. 4 — Prod. SP"],
        datasets:[{
          data:[kpis.custoAlav2, kpis.custoAlav3, kpis.custoAlav4],
          backgroundColor:[C.blue+"bb", C.orange+"bb", C.red+"bb"],
          borderColor:"#0b1630",
          borderWidth:3,
          hoverOffset:8,
        }]
      },
      options:{
        responsive:true, maintainAspectRatio:false,
        cutout:"65%",
        plugins:{
          legend:{display:false},
          tooltip:{
            backgroundColor:"#0f1d3a",
            borderColor:"rgba(100,140,255,0.3)",
            borderWidth:1,
            titleColor:"#e8edf8",
            bodyColor:"#8fa4cc",
            callbacks:{ label:(ctx)=>`${ctx.label}: ${fmtM(Number(ctx.raw))} (${((Number(ctx.raw)/kpis.custoTotal)*100).toFixed(1)}%)` }
          }
        }
      }
    });
    return ()=>ch.destroy();
  },[]);
  return <canvas ref={ref}/>;
}

export default function Custos() {
  const totalRodo = custoPorSemana.reduce((a,d)=>a+d.rodo,0);
  const totalCabo = custoPorSemana.reduce((a,d)=>a+d.cabo,0);

  return (
    <div className="page">
      <div className="page-tag">◈ Custos & SP</div>
      <div className="page-title">Custos de Transferência e Volumes de SP</div>
      <div className="page-sub">Decomposição do custo de R$ 16,3M por modal, semana e SKU. A produção adicional em SP (Alav. 4) representa 87% do total.</div>

      {/* KPIs */}
      <div className="kpi-row" style={{gridTemplateColumns:"repeat(4,minmax(0,1fr))"}}>
        {[
          {label:"Custo Total",         val:fmtM(kpis.custoTotal),  sub:"Alav. 2+3+4",        ac:"var(--gold)"  },
          {label:"Prod. extra NENO",    val:fmtM(kpis.custoAlav2),  sub:`${fmt(kpis.volProdNENO)} HL`, ac:"var(--green)" },
          {label:"Estoque SP (rodo)",   val:fmtM(kpis.custoAlav3),  sub:`${fmt(6971)} HL`,    ac:"var(--orange)"},
          {label:"Produção SP",         val:fmtM(kpis.custoAlav4),  sub:"87% do custo total", ac:"var(--red)"   },
        ].map(k=>(
          <div key={k.label} className="kpi-card" style={{"--ac":k.ac} as React.CSSProperties}>
            <div className="kpi-label">{k.label}</div>
            <div className="kpi-val" style={{fontSize:17}}>{k.val}</div>
            <div className="kpi-sub">{k.sub}</div>
          </div>
        ))}
      </div>

      <div className="g2">
        {/* Custo por semana */}
        <div className="card">
          <div className="card-title">Custo por semana e modal — passe o mouse para ver total</div>
          <div className="chart-wrap" style={{height:190}}><CustoBar/></div>
          <div style={{display:"flex",justifyContent:"space-between",marginTop:10,padding:"8px 12px",background:"var(--surface2)",borderRadius:8}}>
            <span style={{fontSize:11,color:"var(--text2)"}}>Rodoviário total</span>
            <span style={{fontSize:12,fontWeight:600,color:"var(--orange)"}}>{fmtM(totalRodo)}</span>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",marginTop:6,padding:"8px 12px",background:"var(--surface2)",borderRadius:8}}>
            <span style={{fontSize:11,color:"var(--text2)"}}>Cabotagem total</span>
            <span style={{fontSize:12,fontWeight:600,color:"var(--blue)"}}>{fmtM(totalCabo)}</span>
          </div>
        </div>

        {/* Donut decomposição */}
        <div className="card">
          <div className="card-title">Composição do custo total por alavanca</div>
          <div style={{display:"flex",gap:16,alignItems:"center"}}>
            <div className="chart-wrap" style={{height:160,width:160,flexShrink:0}}><CustoDoughnut/></div>
            <div style={{flex:1}}>
              {[
                {label:"Alav. 2 — Prod. NENO", val:kpis.custoAlav2, color:C.blue,   pct:3.3 },
                {label:"Alav. 3 — Est. SP",    val:kpis.custoAlav3, color:C.orange, pct:9.7 },
                {label:"Alav. 4 — Prod. SP",   val:kpis.custoAlav4, color:C.red,    pct:87.0},
              ].map(item=>(
                <div key={item.label} style={{marginBottom:10}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                    <span style={{fontSize:11,color:"var(--text2)"}}>{item.label}</span>
                    <span style={{fontSize:11,fontWeight:600,color:"var(--text)"}}>{fmtM(item.val)}</span>
                  </div>
                  <div className="prog-track">
                    <div className="prog-fill" style={{width:`${item.pct}%`,background:item.color}}/>
                  </div>
                  <div style={{fontSize:10,color:"var(--text3)",textAlign:"right",marginTop:1}}>{item.pct}%</div>
                </div>
              ))}
            </div>
          </div>
          <div className="info info-r">A Alav. 1 (redistribuição interna) tem <strong>custo zero</strong> e é sempre acionada primeiro — move ~136k HL sem nenhum gasto.</div>
        </div>
      </div>

      {/* Volume SP por SKU */}
      <div className="g2">
        <div className="card">
          <div className="card-title">Volume recebido de SP por SKU e semana (HL)</div>
          <div className="chart-wrap" style={{height:180}}><VolSPBar/></div>
          <div className="info info-b" style={{marginTop:8}}>Patagonia não recebe nenhum volume de SP. Malzbier é o principal receptor (33.608 HL), seguido de Goose (25.876 HL).</div>
        </div>

        {/* Custo por SKU */}
        <div className="card">
          <div className="card-title">Custo total por SKU (alav. 2+3+4)</div>
          <div style={{display:"flex",flexDirection:"column",gap:9,marginTop:4}}>
            {SKUS.map(s=>{
              const val = custoPorSku[s as keyof typeof custoPorSku];
              const pct = val/kpis.custoTotal*100;
              return (
                <div key={s}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                    <span style={{fontSize:12,color:SKU_C[s],fontWeight:600}}>{s}</span>
                    <span style={{fontSize:12,fontWeight:600,color:"var(--text)"}}>{val>0?fmtM(val):"—"}</span>
                  </div>
                  <div className="prog-track">
                    <div className="prog-fill" style={{width:val>0?`${pct}%`:"0%",background:SKU_C[s]}}/>
                  </div>
                  {val>0&&<div style={{fontSize:10,color:"var(--text3)",textAlign:"right",marginTop:1}}>{pct.toFixed(1)}%</div>}
                </div>
              );
            })}
          </div>
          <div className="info info-a" style={{marginTop:10}}>
            Patagonia tem custo zero pois não há dados de MACO/produção em SP — simplificação adotada no modelo. O custo real seria maior.
          </div>
        </div>
      </div>
    </div>
  );
}
