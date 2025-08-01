// src/types/obra-unificada.ts - ATUALIZADO PARA NOVA PLANILHA
export interface TaskData {
  EDT: string
  'Nome da Tarefa': string
  'Nível': number
  'Resumo (pai)': string
  'Marco': string | null
  'Data Início': number
  'Data Término': number
  '% Concluído': number
  'LinhaBase Início': number
  'LinhaBase Término': number
  'Predecessoras': string | null
  'Sucessoras': string | null
  // NOVAS COLUNAS IDENTIFICADAS
  'Anotações': string | null
  'Nomes dos Recursos': string | null
  'Coordenada': string | null
}

export interface FiscalizacaoData {
  tarefas: TaskData[]
  totalTarefas: number
  tarefasConcluidas: number
}

export interface ExecucaoData {
  tarefas: TaskData[]
  totalTarefas: number
  tarefasConcluidas: number
}

export interface MetricasObra {
  progressoGeral: number
  avancooFisico: number
  totalTarefas: number
  tarefasConcluidas: number
  totalMarcos: number
  marcosConcluidos: number
}

export interface ObraUnificada {
  codigo: string
  nome: string
  fiscalizacao: FiscalizacaoData
  execucao: ExecucaoData
  metricas: MetricasObra
}

export interface MetricasGerais {
  totalObras: number
  obrasComExecucao: number
  mediaaProgressoGeral: number
  mediaAvancaoFisico: number
  totalMarcosFisicos: number
  marcosFisicosConcluidos: number
}

// Dashboard principal - objeto com obras indexadas por código
export interface DashboardUnificado {
  [obraId: string]: ObraUnificada
}

// Export do tipo principal para compatibilidade
export type DashboardUnificadoType = DashboardUnificado