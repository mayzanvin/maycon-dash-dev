// src/types/obra.ts - TIPOS BASE CORRIGIDOS

export interface BaseObraData {
  EDT: string | number
  Nome_da_Tarefa: string
  N_vel: number
  Resumo_pai?: string
  Data_In_cio: number | string
  Data_T_rmino: number | string
  Porcentagem_Conclu_do: number
  LinhaBase_In_cio?: number | string
  LinhaBase_T_rmino?: number | string

  // ✅ COLUNAS ADICIONAIS:
  Predecessoras?: string | null
  Sucessoras?: string | null
  Marco?: string | null
  Anota_es?: string | null
  Nomes_dos_Recursos?: string | null
  Coordenada?: string | null

  // 💰 DADOS FINANCEIROS
  Orcamento_R?: number | null

  _aba?: string
}

// 💰 INTERFACE BASEINVESTIMENTO EXPORTADA CORRETAMENTE
export interface BaseInvestimentoData {
  ID_Projeto: string
  ProgramaOrcamentario: string
  Descricao: string
  ValorAprovado: number
}

export interface ExcelData {
  [sheetName: string]: BaseObraData[]
}

// ✅ DASHBOARDDATA COM INVESTIMENTOS
export interface DashboardData {
  todasTarefas: BaseObraData[]
  obrasPorAba: ExcelData
  investimentos?: BaseInvestimentoData[]  // 💰 PROPRIEDADE ADICIONADA
  ultimaAtualizacao?: string
}

export interface ObraMetrics {
  totalTarefas: number
  tarefasConcluidas: number
  progressoMedio: number
  avancaoFisico: number
  marcos: {
    total: number
    concluidos: number
  }
}

// Interface para compatibilidade
export interface Obra {
  id: string
  nome: string
  progresso: number
  status: string
  dataInicio: string
  dataTermino: string
  responsavel: string
  localizacao: string
  avancaoFisico: number
  marcos: {
    total: number
    concluidos: number
  }
}