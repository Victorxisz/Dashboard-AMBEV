import { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";
import { volAlavanca, W } from "../data/caseData";
import { C, fmt, baseOpts } from "../components/utils";

Chart.register(...registerables);

function StackedAlavancas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(()=>{
    if(!ref.current) return;
    const ch = new Chart(ref.current,{
      type:"bar",
      data:{
        labels: W,
        datasets:[
          { label:"Alav. 1 — Redistrib. interna",data:volAlavanca.map(d=>d.alav1),backgroundColor:C.green+"bb",  stack:"a", borderRadius:2 },
          { label:"Alav. 2 — Prod. extra NENO",  data:volAlavanca.map(d=>d.alav2),backgroundColor:C.blue+"bb",   stack:"a", borderRadius:2 },
          { label:"Alav. 3 — Estoque SP (rodo)", data:volAlavanca.map(d=>d.alav3),backgroundColor:C.orange+"bb", stack:"a", borderRadius:2 },
          { label:"Alav. 4 — Prod. SP",          data:volAlavanca.map(d=>d.alav4),backgroundColor:C.red+"bb",    stack:"a", borderRadius:2 },
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
              label:(ctx)=>`${ctx.dataset.label}: ${fmt(ctx.parsed.y)} HL`,
              footer:(items)=>`Total: ${fmt(items.reduce((a,i)=>a+i.parsed.y,0))} HL`
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

export default function Alavancas() {
  return (
    <div className="page">
      <div className="page-tag">◆ Alavancas</div>
      <div className="page-title">Modelo de Resolução — 4 Alavancas Sequenciais</div>
      <div className="page-sub">Cada alavanca é aplicada semana a semana. O estoque final de uma semana vira o inicial da próxima — a ordem importa.</div>

      {/* Cards das 4 alavancas */}
      <div className="alav-grid">
        {[
          { num:"Alavanca 1", title:"Redistribuição interna", desc:"Regiões com DOI acima de 12 atuam como doadoras para as deficitárias. Custo zero — sempre a primeira ação. Equaliza DOI médio entre sub-regiões do NENO.", ac:"var(--green)", vol:"~136k HL no horizonte" },
          { num:"Alavanca 2", title:"Produção extra NENO",    desc:"Usa capacidade ociosa das plantas CE (+360/+1.800 HL) e PE (+7.200 HL). SKU com pior DOI médio recebe prioridade. Patagonia tem prioridade total na planta CE.", ac:"var(--blue)", vol:"7.945 HL total" },
          { num:"Alavanca 3", title:"Estoque de São Paulo",   desc:"Estoque disponível em SP enviado via rodoviário (W0–W2, lead time < 1 semana) ou cabotagem (W3+, programada com 3 semanas de antecedência). SP mantém DOI mínimo de 12d.", ac:"var(--orange)", vol:"6.971 HL total" },
          { num:"Alavanca 4", title:"Produção adicional SP",  desc:"Última e mais cara opção. Produz e envia de SP até fechar o gap semanal. Segue mesmas regras de modal da Alav. 3. Responde por 87% do custo total da operação.", ac:"var(--red)", vol:"58.318 HL total" },
        ].map(a=>(
          <div key={a.num} className="alav-card" style={{"--ac":a.ac} as React.CSSProperties}>
            <div className="alav-num">{a.num}</div>
            <div className="alav-title">{a.title}</div>
            <div className="alav-desc">{a.desc}</div>
            <div style={{marginTop:8,fontSize:10,color:a.ac,fontWeight:600}}>↗ {a.vol}</div>
          </div>
        ))}
      </div>

      {/* Gráfico empilhado */}
      <div className="g1">
        <div className="card">
          <div className="card-title">Volume movimentado por alavanca e semana (HL) — passe o mouse para detalhes</div>
          <div className="chart-wrap" style={{height:220}}><StackedAlavancas/></div>
          <div className="info info-b" style={{marginTop:10}}>
            A Alav. 1 (redistribuição) move o maior volume sem custo. W0 é a semana mais cara: R$ 7,2M em rodoviário (Alav. 4). A Alav. 2 só atua em W0, W1 e W5 — semanas com capacidade ociosa em CE ou PE.
          </div>
        </div>
      </div>

      {/* Tabela simplificações */}
      <div className="card">
        <div className="card-title">Simplificações adotadas no modelo</div>
        <table className="tbl">
          <thead><tr><th>#</th><th>Simplificação</th><th>Impacto</th></tr></thead>
          <tbody>
            {[
              ["1","Produção programada mantida — volumes já planejados em PE e CE não foram realocados","Produção extra usada apenas onde há capacidade ociosa confirmada"],
              ["2","Patagonia fora da análise de custo — MACO e custo de produção não contabilizados (dados ausentes)","Gap residual de Patagonia não tem custo associado no modelo"],
              ["3","Patagonia restrita ao Nordeste — sem estoque em SP e sem custo de transferência, complementação via SP inviável","Único SKU sem resolução completa — DOI cai para 5,2d em W6"],
            ].map(([n,s,i])=>(
              <tr key={n}>
                <td style={{color:"var(--gold)",fontWeight:700,width:30}}>{n}</td>
                <td style={{color:"var(--text)"}}>{s}</td>
                <td style={{color:"var(--text2)",fontSize:11}}>{i}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
