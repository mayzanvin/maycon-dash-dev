// src/types/obra-unificada.ts - CORREÇÃO ESPECÍFICA DOS ERROS

export interface TaskData {
  'EDT': string | number
  'Nome da Tarefa': string
  'Nível': number
  'Resumo (pai)': string
  'Marco'?: 'SIM' | string | null
  'Data Início': number | string
  'Data Término': number | string
  '% Concluído': number
  'LinhaBase Início': string | number
  'LinhaBase Término': string | number
  'Predecessoras'?: string | null
  'Sucessoras'?: string | null
  'Anotações'?: string | null
  'Nomes dos Recursos'?: string | null
  'Coordenada'?: string | null
}

export interface MetricasObra {
  progressoGeral: number
  avanceFisico: number
  totalTarefas: number
  tarefasConcluidas: number
  totalMarcos: number
  marcosConcluidos: number
}

export interface FiscalizacaoData {
  tarefas: TaskData[]
  progressoFornecimentos: number  // ✅ ADICIONADO: propriedade que faltava
}

export interface ExecucaoData {
  tarefas: TaskData[]
  progressoExecucao: number
}

export interface ObraUnificada {
  codigo: string              // ✅ ADICIONADO: propriedade que faltava
  nome: string                // ✅ ADICIONADO: propriedade que faltava
  temEnergizacao: boolean     // ✅ ADICIONADO: propriedade que faltava
  fiscalizacao: FiscalizacaoData
  execucao: ExecucaoData
  metricas: MetricasObra
}

export interface MetricasGerais {
  totalObras: number
  obrasComExecucao: number
  mediaProgressoGeral: number
  mediaAvancaoFisico: number
  totalMarcosFisicos: number
  marcosFisicosConcluidos: number
  obrasConcluidas: number      // ✅ ADICIONADO: propriedade que faltava
}

// Dashboard principal - objeto com obras indexadas por código
export interface DashboardUnificadoType {
  [obraId: string]: ObraUnificada
}

// Props para componentes que usam DashboardUnificado
export interface DashboardUnificadoProps {
  data: DashboardUnificadoType
}

export interface MetricasObrasProps {
  metricas: MetricasGerais
}

export interface GraficosUnificadosProps {
  obras: ObraUnificada[]
}

export interface ListaObrasUnificadasProps {
  obras: ObraUnificada[]
  onSelectObra?: (obra: ObraUnificada) => void
}