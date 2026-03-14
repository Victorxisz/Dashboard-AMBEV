// ============================================================
// DADOS DO CASE AMBEV — Long Neck NENO
// ============================================================

export const SEMANAS = ["W0\n02/02", "W1\n09/02", "W2\n16/02", "W3\n23/02", "W4\n02/03", "W5\n09/03", "W6\n16/03", "W7\n23/03"];
export const SEMANAS_LABEL = ["W0", "W1", "W2", "W3", "W4", "W5", "W6", "W7"];
export const REGIOES = ["Mapapi", "NE Norte", "NE Sul", "NO Araguaia", "NO Centro"];
export const DOI_META = 12;

// Slide 3 — Contexto Regional: Demanda LN por Regional (Jan → Fev) em KHL
export const demandaRegional = [
  { regiao: "MG",     janeiro: 65.5,  fevereiro: 72.8  },
  { regiao: "SP",     janeiro: 173.6, fevereiro: 165.3 },
  { regiao: "NENO",   janeiro: 200.8, fevereiro: 179.7 },
  { regiao: "CO",     janeiro: 104.5, fevereiro: 112.8 },
  { regiao: "RJ",     janeiro: 111.2, fevereiro: 130.6 },
  { regiao: "SUL",    janeiro: 116.3, fevereiro: 116.6 },
  { regiao: "Export", janeiro: 67.1,  fevereiro: 49.2  },
];

// Slide 4 — Demanda vs Produção Jan/Fev
export const demandaVsProducao = [
  { label: "Demanda Jan",     valor: 200754 },
  { label: "Prod Jan (Real)", valor: 143535 },
  { label: "Prod Jan (1W)",   valor: 176297 },
  { label: "Demanda Fev",     valor: 179674 },
  { label: "Prod Fev (WSNP)", valor: 158000 },
];

// Slide 4 — Capacidade das linhas
export const linhasProducao = [
  { linha: "AQ541", capacidade: 108, skus: ["Brahma Zero", "Goose", "Malzbier", "Colorado", "Beats", "Bud Zero"] },
  { linha: "NS541", capacidade: 50,  skus: ["Malzbier", "Colorado", "Patagonia"] },
];

// Slide 5 — Malzbier: Demanda Atual vs Nova vs Produção (fevereiro)
export const malzbierFev = [
  { semana: "W0\n02/02", demandaAtual: 10449, demandaNova: 13583, producao: 16200 },
  { semana: "W1\n09/02", demandaAtual: 11251, demandaNova: 14626, producao: 9000  },
  { semana: "W2\n16/02", demandaAtual: 8006,  demandaNova: 10408, producao: 20520 },
  { semana: "W3\n23/02", demandaAtual: 9229,  demandaNova: 11998, producao: 0     },
];

// Slide 5 — Total LN: Demanda Atual vs Nova vs Capacidade Máxima (fev + mar)
export const totalLNDemanda = [
  { semana: "W0", demandaAtual: 39700, demandaNova: 42900, capacidade: 39600 },
  { semana: "W1", demandaAtual: 42700, demandaNova: 46100, capacidade: 39600 },
  { semana: "W2", demandaAtual: 31500, demandaNova: 33900, capacidade: 39600 },
  { semana: "W3", demandaAtual: 35300, demandaNova: 38100, capacidade: 39600 },
  { semana: "W4", demandaAtual: 39700, demandaNova: 47200, capacidade: 39600 },
  { semana: "W5", demandaAtual: 42700, demandaNova: 50600, capacidade: 39600 },
  { semana: "W6", demandaAtual: 31500, demandaNova: 37300, capacidade: 39600 },
  { semana: "W7", demandaAtual: 35300, demandaNova: 41900, capacidade: 39600 },
];

// Slide 9 — Redistribuição Interna: regiões abaixo da meta DOI antes/depois
export const redistribuicaoInterna = [
  { semana: "W0", antes: 12, depois: 8  },
  { semana: "W1", antes: 16, depois: 5  },
  { semana: "W2", antes: 11, depois: 5  },
  { semana: "W3", antes: 14, depois: 7  },
];

// Slide 10 — Capacidade de produção extra no NENO (CE + PE)
export const capacidadeExtraNENO = [
  { semana: "02/02", cePlano: 12240, ceCap: 12600, ceExtra: 360,  pePlano: 27000, peCap: 27000, peExtra: 0,    totalExtra: 360  },
  { semana: "09/02", cePlano: 10800, ceCap: 12600, ceExtra: 1800, pePlano: 19800, peCap: 27000, peExtra: 7200, totalExtra: 9000 },
  { semana: "16/02", cePlano: 12600, ceCap: 12600, ceExtra: 0,    pePlano: 27000, peCap: 27000, peExtra: 0,    totalExtra: 0    },
  { semana: "23/02", cePlano: 12600, ceCap: 12600, ceExtra: 0,    pePlano: 27000, peCap: 27000, peExtra: 0,    totalExtra: 0    },
];

// DOI médio por semana — cenários resolvido, +9% e -9% bias
export const doiPorCenario = [
  { semana: "W0", resolvido: 14.2, plus9: 12.8, minus9: 15.6 },
  { semana: "W1", resolvido: 13.1, plus9: 11.4, minus9: 14.8 },
  { semana: "W2", resolvido: 15.8, plus9: 13.9, minus9: 17.1 },
  { semana: "W3", resolvido: 13.5, plus9: 11.8, minus9: 14.9 },
  { semana: "W4", resolvido: 12.4, plus9: 10.6, minus9: 13.9 },
  { semana: "W5", resolvido: 11.9, plus9: 9.8,  minus9: 13.2 },
  { semana: "W6", resolvido: 13.7, plus9: 11.5, minus9: 15.0 },
  { semana: "W7", resolvido: 12.8, plus9: 10.9, minus9: 14.1 },
];

// Gap por semana (HL) — cenários
export const gapPorCenario = [
  { semana: "W0", resolvido: 820,  plus9: 2100, minus9: 0    },
  { semana: "W1", resolvido: 1340, plus9: 3800, minus9: 0    },
  { semana: "W2", resolvido: 0,    plus9: 1200, minus9: 0    },
  { semana: "W3", resolvido: 640,  plus9: 2400, minus9: 0    },
  { semana: "W4", resolvido: 1800, plus9: 4600, minus9: 200  },
  { semana: "W5", resolvido: 2200, plus9: 5800, minus9: 400  },
  { semana: "W6", resolvido: 800,  plus9: 3200, minus9: 0    },
  { semana: "W7", resolvido: 1100, plus9: 3900, minus9: 0    },
];

// Volume movimentado por alavanca por semana (HL)
export const volumePorAlavanca = [
  { semana: "W0", alav1: 1200, alav2: 360,  alav3: 800,  alav4: 0    },
  { semana: "W1", alav1: 2400, alav2: 9000, alav3: 1800, alav4: 600  },
  { semana: "W2", alav1: 1800, alav2: 0,    alav3: 1200, alav4: 0    },
  { semana: "W3", alav1: 2100, alav2: 0,    alav3: 1600, alav4: 400  },
  { semana: "W4", alav1: 1900, alav2: 360,  alav3: 2400, alav4: 1200 },
  { semana: "W5", alav1: 2800, alav2: 1800, alav3: 3100, alav4: 1800 },
  { semana: "W6", alav1: 1600, alav2: 0,    alav3: 1800, alav4: 600  },
  { semana: "W7", alav1: 2200, alav2: 0,    alav3: 2200, alav4: 900  },
];

// Custo total por semana (R$)
export const custoPorSemana = [
  { semana: "W0", rodo: 38400,  cabo: 0,      total: 38400  },
  { semana: "W1", rodo: 86400,  cabo: 0,      total: 86400  },
  { semana: "W2", rodo: 57600,  cabo: 0,      total: 57600  },
  { semana: "W3", rodo: 76800,  cabo: 0,      total: 76800  },
  { semana: "W4", rodo: 115200, cabo: 57600,  total: 172800 },
  { semana: "W5", rodo: 148800, cabo: 86400,  total: 235200 },
  { semana: "W6", rodo: 86400,  cabo: 57600,  total: 144000 },
  { semana: "W7", rodo: 105600, cabo: 72000,  total: 177600 },
];

// Tabela de robustez
export const robustez = [
  { cenario: "-9% bias", doiMedio: 15.1, pctMeta: 94.2, gapTotal: 600,  custoTotal: 612000 },
  { cenario: "Resolvido", doiMedio: 13.2, pctMeta: 81.3, gapTotal: 8700, custoTotal: 988800 },
  { cenario: "+9% bias",  doiMedio: 11.4, pctMeta: 62.5, gapTotal: 26000, custoTotal: 1342800 },
];

// DOI Heatmap — região x semana (cenário resolvido)
export const doiHeatmapDepois: Record<string, number[]> = {
  "Mapapi":      [14.1, 12.8, 16.2, 13.4, 11.8, 10.9, 13.1, 12.2],
  "NE Norte":    [13.5, 11.9, 15.1, 12.8, 11.2, 10.1, 12.5, 11.7],
  "NE Sul":      [15.2, 14.1, 17.3, 14.5, 13.1, 12.4, 14.8, 13.9],
  "NO Araguaia": [12.8, 10.4, 14.1, 11.9, 10.2, 9.1,  11.8, 10.8],
  "NO Centro":   [14.8, 13.2, 16.4, 13.9, 12.4, 11.6, 14.1, 13.2],
};

export const doiHeatmapAntes: Record<string, number[]> = {
  "Mapapi":      [8.4,  6.1,  10.2, 7.8,  5.9,  4.2,  7.1,  6.4],
  "NE Norte":    [7.9,  5.4,  9.8,  7.2,  5.1,  3.8,  6.5,  5.9],
  "NE Sul":      [10.1, 8.3,  12.4, 9.6,  7.8,  6.4,  9.2,  8.5],
  "NO Araguaia": [6.8,  4.1,  8.3,  6.1,  4.2,  2.9,  5.8,  5.1],
  "NO Centro":   [9.2,  7.4,  11.3, 8.8,  6.9,  5.6,  8.4,  7.7],
};

// KPIs resumo
export const kpis = {
  custoTotal: 988800,
  gapTotalHL: 8700,
  doiMedioFinal: 13.2,
  pctRegioesMeta: 81.3,
  volumeTransferidoSP: 18900,
  producaoExtraNENO: 9720,
};
