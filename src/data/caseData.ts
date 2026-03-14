// Dados reais — resultado_case_patagonia_first_3_0.xlsx + bias ±9%

export const W = ["W0","W1","W2","W3","W4","W5","W6","W7"];
export const W_DATES = ["02/02","09/02","16/02","23/02","02/03","09/03","16/03","23/03"];
export const REGIOES = ["Mapapi","NE Norte","NE Sul","NO Araguaia","NO Centro"];
export const SKUS = ["Patagonia","Goose","Malzbier","Colorado"];
export const SKU_COLORS: Record<string,string> = {
  Patagonia:"#f97316", Goose:"#3b82f6", Malzbier:"#22c55e", Colorado:"#a855f7"
};
export const DOI_META = 12;

export const kpis = {
  custoTotal:   16329607,
  custoAlav2:   543824,
  custoAlav3:   1577583,
  custoAlav4:   14208201,
  doiMedio:     12.98,
  gapTotal:     28730,
  pctMeta:      81.2,
  volSP:        65289,
  volProdNENO:  7945,
};

// DOI por SKU por semana — cenário resolvido
export const doiSku: Record<string,number[]> = {
  Patagonia: [13.33,12.71,10.13,10.78, 9.80, 7.67, 5.16, 7.59],
  Goose:     [12.00,15.32,12.00,15.06,12.17,14.88,12.00,17.67],
  Malzbier:  [12.00,13.62,16.87,12.00,12.00,13.15,15.53,12.00],
  Colorado:  [18.54,16.77,20.73,12.16,12.15,12.00,15.47,12.00],
};

// DOI médio total NENO
export const doiTotal = [13.97,14.60,14.93,12.50,11.53,11.93,12.04,12.31];

// DOI por região por semana
export const doiRegiao: Record<string,number[]> = {
  "Mapapi":      [13.96,14.54,14.88,12.46,11.49,11.92,12.04,12.31],
  "NE Norte":    [13.98,14.55,14.88,12.46,11.50,11.92,12.04,12.31],
  "NE Sul":      [13.97,14.55,14.88,12.46,11.50,11.93,12.04,12.31],
  "NO Araguaia": [13.96,14.58,14.88,12.46,11.49,11.95,12.04,12.31],
  "NO Centro":   [13.96,14.81,15.13,12.66,11.67,11.91,12.04,12.31],
};

// Gap por SKU por semana (100% em Patagonia)
export const gapSku: Record<string,number[]> = {
  Patagonia: [0,0,2325,1879,3720,5428,9344,6034],
  Goose:     [0,0,0,0,0,0,0,0],
  Malzbier:  [0,0,0,0,0,0,0,0],
  Colorado:  [0,0,0,0,0,0,0,0],
};

// Demanda e WSNP total NENO
export const demandaNENO  = [42897,46066,33915,38120,47186,50673,37307,41931];
export const wsnpNENO     = [39600,27000,36360,25200,39600,30625,36360,25200];
export const capacidadeMax = Array(8).fill(39600);

// Vol SP por SKU por semana (alav 3+4)
export const volSPsku: Record<string,number[]> = {
  Patagonia: [0,0,0,0,0,0,0,0],
  Goose:     [8298,0,7921,0,0,0,9657,0],
  Malzbier:  [18999,0,0,8142,1035,0,0,5432],
  Colorado:  [0,0,0,102,2711,0,0,2992],
};

// Volume por alavanca por semana
export const volAlavanca = [
  {alav1:20379,alav2:360,  alav3:6673, alav4:20624},
  {alav1:15637,alav2:1800, alav3:0,    alav4:0    },
  {alav1:15635,alav2:0,    alav3:0,    alav4:7921 },
  {alav1:20136,alav2:0,    alav3:102,  alav4:8142 },
  {alav1:12323,alav2:360,  alav3:3204, alav4:543  },
  {alav1:15411,alav2:5425, alav3:0,    alav4:0    },
  {alav1:15616,alav2:0,    alav3:0,    alav4:9657 },
  {alav1:20947,alav2:0,    alav3:2992, alav4:5432 },
];

// Custo por semana por modal
export const custoPorSemana = [
  {rodo:7219315,cabo:0      },
  {rodo:0,      cabo:0      },
  {rodo:2355608,cabo:0      },
  {rodo:0,      cabo:1963957},
  {rodo:0,      cabo:392698 },
  {rodo:0,      cabo:543824 },
  {rodo:0,      cabo:2308648},
  {rodo:0,      cabo:1545557},
];

// Custo por SKU
export const custoPorSku = {
  Patagonia: 0,
  Goose:     7128656,
  Malzbier:  8190800,
  Colorado:  1010150,
};

// Robustez
export const robustez = [
  {cenario:"-9% bias", doiMedio:14.68, pctMeta:96.9, gapTotal:2571,  custoTotal:9600000 },
  {cenario:"Resolvido",doiMedio:12.98, pctMeta:81.2, gapTotal:28730, custoTotal:16329607},
  {cenario:"+9% bias", doiMedio:11.73, pctMeta:75.0, gapTotal:65011, custoTotal:23100000},
];

// DOI Patagonia por cenário
export const doiPatCenarios: Record<string,number[]> = {
  "-9% bias":  [15.19,15.51,13.08,13.89,13.17,12.50, 9.93,13.19],
  "Resolvido": [13.33,12.71,10.13,10.78, 9.80, 7.67, 5.16, 7.59],
  "+9% bias":  [11.78,10.38, 7.67, 8.18, 6.99, 3.64, 1.18, 2.91],
};

// DOI total NENO por cenário
export const doiCenarios: Record<string,number[]> = {
  "-9% bias":  [15.02,16.35,16.96,14.28,12.99,13.93,13.88,14.00],
  "Resolvido": [13.97,14.60,14.93,12.50,11.53,11.93,12.04,12.31],
  "+9% bias":  [13.08,13.10,13.19,11.64,10.78,10.62,10.56,10.90],
};

// Gap NENO por cenário por semana
export const gapCenarios: Record<string,number[]> = {
  "-9% bias":  [0,0,0,0,0,0,2571,0],
  "Resolvido": [0,0,2325,1879,3720,5428,9344,6034],
  "+9% bias":  [371,2035,5870,6419,9258,11397,16116,13545],
};

// Contexto
export const demandaRegional = [
  {regiao:"MG",    jan:65.5,  fev:72.8 },
  {regiao:"SP",    jan:173.6, fev:165.3},
  {regiao:"NENO",  jan:200.8, fev:179.7},
  {regiao:"CO",    jan:104.5, fev:112.8},
  {regiao:"RJ",    jan:111.2, fev:130.6},
  {regiao:"SUL",   jan:116.3, fev:116.6},
  {regiao:"Export",jan:67.1,  fev:49.2 },
];

export const demandaVsProducao = [
  {label:"Demanda Jan",    val:200754},
  {label:"Prod Jan (Real)",val:143535},
  {label:"Prod Jan (1W)",  val:176297},
  {label:"Demanda Fev",    val:179674},
  {label:"Prod Fev (WSNP)",val:158000},
];
