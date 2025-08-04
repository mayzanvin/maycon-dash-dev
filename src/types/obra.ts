// src/types/obra.ts - TIPOS BASE ATUALIZADOS COM 5 COLUNAS ADICIONAIS

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
  
  // ✅ 5 COLUNAS ADICIONAIS IMPORTANTES:
  Predecessoras?: string | null     // Dependências da tarefa
  Sucessoras?: string | null        // Tarefas dependentes
  Marco?: string | null             // "SIM" para marcos físicos
  Anota_es?: string | null          // Informações extras
  Nomes_dos_Recursos?: string | null // Equipes (DTE, ENW, etc.)
  Coordenada?: string | null        // Para localização no mapa
  
  _aba?: string // Identificação da aba de origem
}

export interface ExcelData {
  [sheetName: string]: BaseObraData[]
}

export interface DashboardData {
  todasTarefas: BaseObraData[]
  obrasPorAba: ExcelData
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

// Interface para compatibilidade com componentes existentes
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