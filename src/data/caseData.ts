// ============================================================
// DADOS REAIS DO CASE AMBEV — Long Neck NENO
// Extraídos de: resultado_case_patagonia_first_3_0.xlsx
//               cenario_patagonia_first_demanda_mais_9.xlsx
//               cenario_patagonia_first_demanda_menos_9.xlsx
// ============================================================

export const SEMANAS_LABEL = ["W0", "W1", "W2", "W3", "W4", "W5", "W6", "W7"];
export const SEMANAS_DATA  = ["02/02","09/02","16/02","23/02","02/03","09/03","16/03","23/03"];
export const REGIOES = ["Mapapi", "NE Norte", "NE Sul", "NO Araguaia", "NO Centro"];
export const DOI_META = 12;

export const linhasProducao = [
  { linha: "AQ541", capacidade: 108, skus: ["Brahma Zero", "Goose", "Malzbier", "Colorado", "Beats", "Bud Zero"] },
  { linha: "NS541", capacidade: 50,  skus: ["Malzbier", "Colorado", "Patagonia"] },
];

export const demandaRegional = [
  { regiao: "MG",     janeiro: 65.5,  fevereiro: 72.8  },
  { regiao: "SP",     janeiro: 173.6, fevereiro: 165.3 },
  { regiao: "NENO",   janeiro: 200.8, fevereiro: 179.7 },
  { regiao: "CO",     janeiro: 104.5, fevereiro: 112.8 },
  { regiao: "RJ",     janeiro: 111.2, fevereiro: 130.6 },
  { regiao: "SUL",    janeiro: 116.3, fevereiro: 116.6 },
  { regiao: "Export", janeiro: 67.1,  fevereiro: 49.2  },
];

export const demandaVsProducao = [
  { label: "Demanda Jan",     valor: 200754 },
  { label: "Prod Jan (Real)", valor: 143535 },
  { label: "Prod Jan (1W)",   valor: 176297 },
  { label: "Demanda Fev",     valor: 179674 },
  { label: "Prod Fev (WSNP)", valor: 158000 },
];

// Demanda real extraída da Base_Final_Longa (NENO, nova demanda)
export const totalLNDemanda = [
  { semana: "W0", demandaNova: 42897,  wsnp: 39600, capacidade: 39600 },
  { semana: "W1", demandaNova: 46066,  wsnp: 27000, capacidade: 39600 },
  { semana: "W2", demandaNova: 33915,  wsnp: 36360, capacidade: 39600 },
  { semana: "W3", demandaNova: 38120,  wsnp: 25200, capacidade: 39600 },
  { semana: "W4", demandaNova: 47186,  wsnp: 39600, capacidade: 39600 },
  { semana: "W5", demandaNova: 50673,  wsnp: 30625, capacidade: 39600 },
  { semana: "W6", demandaNova: 37307,  wsnp: 36360, capacidade: 39600 },
  { semana: "W7", demandaNova: 41931,  wsnp: 25200, capacidade: 39600 },
];

export const malzbierFev = [
  { semana: "W0\n02/02", demandaAtual: 10449, demandaNova: 13583, producao: 16200 },
  { semana: "W1\n09/02", demandaAtual: 11251, demandaNova: 14626, producao: 9000  },
  { semana: "W2\n16/02", demandaAtual: 8006,  demandaNova: 10408, producao: 20520 },
  { semana: "W3\n23/02", demandaAtual: 9229,  demandaNova: 11998, producao: 0     },
];

export const redistribuicaoInterna = [
  { semana: "W0", antes: 12, depois: 8  },
  { semana: "W1", antes: 16, depois: 5  },
  { semana: "W2", antes: 11, depois: 5  },
  { semana: "W3", antes: 14, depois: 7  },
];

export const capacidadeExtraNENO = [
  { semana: "02/02", cePlano: 12240, ceCap: 12600, ceExtra: 360,  pePlano: 27000, peCap: 27000, peExtra: 0,    totalExtra: 360  },
  { semana: "09/02", cePlano: 10800, ceCap: 12600, ceExtra: 1800, pePlano: 19800, peCap: 27000, peExtra: 7200, totalExtra: 9000 },
  { semana: "16/02", cePlano: 12600, ceCap: 12600, ceExtra: 0,    pePlano: 27000, peCap: 27000, peExtra: 0,    totalExtra: 0    },
  { semana: "23/02", cePlano: 12600, ceCap: 12600, ceExtra: 0,    pePlano: 27000, peCap: 27000, peExtra: 0,    totalExtra: 0    },
];

// Fonte: Log_Decisoes — volume_hl agrupado por alavanca e semana_resolvida
export const volumePorAlavanca = [
  { semana: "W0", alav1: 20379, alav2: 360,  alav3: 6673,  alav4: 20624 },
  { semana: "W1", alav1: 15637, alav2: 1800, alav3: 0,     alav4: 0     },
  { semana: "W2", alav1: 15635, alav2: 0,    alav3: 0,     alav4: 7921  },
  { semana: "W3", alav1: 20136, alav2: 0,    alav3: 102,   alav4: 8142  },
  { semana: "W4", alav1: 12323, alav2: 360,  alav3: 3204,  alav4: 543   },
  { semana: "W5", alav1: 15411, alav2: 5425, alav3: 0,     alav4: 0     },
  { semana: "W6", alav1: 15616, alav2: 0,    alav3: 0,     alav4: 9657  },
  { semana: "W7", alav1: 20947, alav2: 0,    alav3: 2992,  alav4: 5432  },
];

// Fonte: Log_Decisoes — custo_total por semana_resolvida e modal
export const custoPorSemana = [
  { semana: "W0", rodo: 7219315, cabo: 0,       total: 7219315 },
  { semana: "W1", rodo: 0,       cabo: 0,       total: 0       },
  { semana: "W2", rodo: 2355608, cabo: 0,       total: 2355608 },
  { semana: "W3", rodo: 0,       cabo: 1963957, total: 1963957 },
  { semana: "W4", rodo: 0,       cabo: 392698,  total: 392698  },
  { semana: "W5", rodo: 0,       cabo: 543824,  total: 543824  },
  { semana: "W6", rodo: 0,       cabo: 2308648, total: 2308648 },
  { semana: "W7", rodo: 0,       cabo: 1545557, total: 1545557 },
];

// Fonte: Base_Final_Longa — média suf_f_d NENO por semana_idx
export const doiPorCenario = [
  { semana: "W0", resolvido: 13.97, plus9: 13.08, minus9: 15.02 },
  { semana: "W1", resolvido: 14.60, plus9: 13.10, minus9: 16.35 },
  { semana: "W2", resolvido: 14.93, plus9: 13.19, minus9: 16.96 },
  { semana: "W3", resolvido: 12.50, plus9: 11.64, minus9: 14.28 },
  { semana: "W4", resolvido: 11.53, plus9: 10.78, minus9: 12.99 },
  { semana: "W5", resolvido: 11.93, plus9: 10.62, minus9: 13.93 },
  { semana: "W6", resolvido: 12.04, plus9: 10.56, minus9: 13.88 },
  { semana: "W7", resolvido: 12.31, plus9: 10.90, minus9: 14.00 },
];

// Fonte: Base_Final_Longa — soma gap_ef_12 NENO por semana_idx
export const gapPorCenario = [
  { semana: "W0", resolvido: 0,    plus9: 371,   minus9: 0    },
  { semana: "W1", resolvido: 0,    plus9: 2035,  minus9: 0    },
  { semana: "W2", resolvido: 2325, plus9: 5870,  minus9: 0    },
  { semana: "W3", resolvido: 1879, plus9: 6419,  minus9: 0    },
  { semana: "W4", resolvido: 3720, plus9: 9258,  minus9: 0    },
  { semana: "W5", resolvido: 5428, plus9: 11397, minus9: 0    },
  { semana: "W6", resolvido: 9344, plus9: 16116, minus9: 2571 },
  { semana: "W7", resolvido: 6034, plus9: 13545, minus9: 0    },
];

// Heatmap DOI — cenário resolvido (Base_Final_Longa)
export const doiHeatmapDepois: Record<string, number[]> = {
  "Mapapi":      [14.0, 14.5, 14.9, 12.5, 11.5, 11.9, 12.0, 12.3],
  "NE Norte":    [14.0, 14.5, 14.9, 12.5, 11.5, 11.9, 12.0, 12.3],
  "NE Sul":      [14.0, 14.5, 14.9, 12.5, 11.5, 11.9, 12.0, 12.3],
  "NO Araguaia": [14.0, 14.6, 14.9, 12.5, 11.5, 12.0, 12.0, 12.3],
  "NO Centro":   [14.0, 14.8, 15.1, 12.7, 11.7, 11.9, 12.0, 12.3],
};

// Heatmap DOI — cenário +9% bias (stress test)
export const doiHeatmapAntes: Record<string, number[]> = {
  "Mapapi":      [13.1, 13.0, 13.1, 11.6, 10.7, 10.6, 10.6, 10.9],
  "NE Norte":    [13.1, 13.0, 13.1, 11.6, 10.8, 10.6, 10.6, 10.9],
  "NE Sul":      [13.1, 13.0, 13.1, 11.6, 10.8, 10.6, 10.6, 10.9],
  "NO Araguaia": [13.1, 13.1, 13.1, 11.6, 10.7, 10.6, 10.6, 10.9],
  "NO Centro":   [13.1, 13.3, 13.4, 11.8, 10.9, 10.6, 10.6, 10.9],
};

// Fonte: Base_Final_Longa (3 arquivos) + Log_Decisoes (custo só no cenário base)
export const robustez = [
  { cenario: "-9% bias",  doiMedio: 14.68, pctMeta: 96.9, gapTotal: 2571,  custoTotal: null        },
  { cenario: "Resolvido", doiMedio: 12.98, pctMeta: 81.3, gapTotal: 28730, custoTotal: 16329607    },
  { cenario: "+9% bias",  doiMedio: 11.73, pctMeta: 75.0, gapTotal: 65011, custoTotal: null        },
];

// KPIs globais — Fonte: Log_Decisoes + Base_Final_Longa
export const kpis = {
  custoTotal:          16329607,  // R$ — soma Log_Decisoes.custo_total
  gapTotalHL:          28730,     // HL — soma gap_ef_12 NENO todas semanas
  doiMedioFinal:       12.98,     // dias — média suf_f_d NENO
  pctRegioesMeta:      81.3,      // % linhas com atende_doi_12 = TRUE
  volumeTransferidoSP: 65289,     // HL — alavancas 3 e 4
  producaoExtraNENO:   7945,      // HL — alavanca 2
};
