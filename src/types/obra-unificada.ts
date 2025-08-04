// src/types/obra-unificada.ts - TIPOS CORRETOS PARA TODOS OS COMPONENTES

// ✅ MÉTRICAS EXATAS que MetricasObras.tsx espera
export interface MetricasGerais {
  totalObras: number
  obrasConcluidas: number
  obrasEmAndamento: number
  progressoMedio: number
  atrasadas: number
  prazo: number
  // ✅ ADICIONADAS: propriedades que MetricasObras.tsx usa nos cálculos
  totalMarcosFisicos: number
  marcosFisicosConcluidos: number
  mediaAvancaoFisico: number
  // ✅ COMPATIBILIDADE: nomes alternativos que podem ser usados
  mediaaProgressoGeral?: number
  mediaaAvancaoFisico?: number
}

// ✅ OBRA UNIFICADA com TODAS as propriedades que os componentes esperam
export interface ObraUnificada {
  codigo: string
  nome: string
  status: string
  progressoGeral: number
  avancooFisico: number  // ✅ ListaObrasUnificadas.tsx usa este nome
  avancaoFisico?: number // ✅ Alias para compatibilidade
  tarefasConcluidas: number
  totalTarefas: number
  marcos: {
    total: number
    concluidos: number
  }
  metricas: {
    progressoGeral: number
    avancooFisico: number
    totalTarefas: number
    tarefasConcluidas: number
    totalMarcos: number
    marcosConcluidos: number
  }
  temEnergizacao?: boolean
  fiscalizacao: {
    tarefas: TaskData[]
    progressoFornecimentos: number
    tarefasConcluidas?: number
    totalTarefas?: number
  }
  execucao: {
    tarefas: TaskData[]
    progressoExecucao: number
    tarefasConcluidas?: number
    totalTarefas?: number
  }
}

// ✅ ESTRUTURA QUE DashboardUnificado.tsx ESPERA
export interface DashboardUnificadoType {
  obras: ObraUnificada[]       // ✅ Array de obras
  metricas: MetricasGerais     // ✅ Métricas já calculadas
  ultimaAtualizacao: string
}

// ✅ Props para componentes
export interface DashboardUnificadoProps {
  data: DashboardUnificadoType
  selectedSheet?: string
}

export interface MetricasObrasProps {
  metricas: MetricasGerais
}

export interface GraficosUnificadosProps {
  obras: ObraUnificada[]
  onObraClick?: (obra: ObraUnificada) => void
}

export interface ListaObrasUnificadasProps {
  obras: ObraUnificada[]
  showAll?: boolean
  onObraClick?: (obra: ObraUnificada) => void
}

// ✅ TaskData expandido com propriedades que podem ser necessárias
export interface TaskData {
  'EDT': string | number
  'Nome da Tarefa': string
  'Nível': number
  'Resumo (pai)': string
  'Data Início': number | string
  'Data Término': number | string
  '% Concluído': number
  'LinhaBase Início': string | number
  'LinhaBase Término': string | number
  'Predecessoras'?: string | null
  'Sucessoras'?: string | null
  'Marco'?: string | null
  'Anotações'?: string | null
  'Nomes dos Recursos'?: string | null
  'Coordenada'?: string | null
  '_aba'?: string
  // ✅ Propriedades adicionais que podem ser calculadas
  tarefasConcluidas?: number
  totalTarefas?: number
  progressoFornecimentos?: number
  progressoExecucao?: number
}