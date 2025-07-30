// Tipos gerados automaticamente baseado nas planilhas do Excel

export interface BaseObraData {
  EDT: number | string;
  Nome_da_Tarefa: string;
  N_vel: number;
  Resumo__pai_: string;
  Data_In_cio: number;
  Data_T_rmino: number;
  __Conclu_do: number;
  LinhaBase_In_cio: number | string;
  LinhaBase_T_rmino: number | string;
}

export interface Planilha1Data extends BaseObraData {}

export interface R87LRREVAR7640002CRFData extends BaseObraData {}

export interface SEPVRRE0957640001CRFData extends BaseObraData {}

export interface SESCRRE0987640003CRFData extends BaseObraData {}

export interface SESCRRE0987640003CREData extends BaseObraData {}

export interface ObraMetrics {
  totalObras: number;
  obrasConcluidas: number;
  obrasEmAndamento: number;
  obrasPendentes: number;
  valorTotal: number;
  valorGasto: number;
}

export interface ExcelData {
  [sheetName: string]: BaseObraData[];
}

export interface DashboardData {
  sheets: ExcelData;
  metrics: ObraMetrics;
  sheetNames: string[];
}

// Nomes das planilhas encontradas
export const SHEET_NAMES = [
  "Planilha1",
  "R87L_RRE-VAR-764000-2-CR - F",
  "SEPV_RRE-095-764000-1-CR - F",
  "SESC_RRE-098-764000-3-CR - F",
  "SESC_RRE-098-764000-3-CR - E"
] as const;

export type SheetName = typeof SHEET_NAMES[number];