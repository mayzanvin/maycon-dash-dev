// src/types/obra-unificada.ts - ADICIONANDO progressoMedio PARA CURVATENDENCIA

// ✅ MÉTRICAS GERAIS COMPATÍVEIS COM TODOS OS COMPONENTES
export interface MetricasGerais {
  totalObras: number
  obrasConcluidas: number
  obrasEmAndamento: number
  progressoMedio: number
  atrasadas: number
  prazo: number
  // ✅ MÉTRICAS FÍSICAS:
  totalMarcosFisicos: number
  marcosFisicosConcluidos: number
  mediaAvancaoFisico: number
  obrasComExecucao: number
  // 💰 MÉTRICAS FINANCEIRAS COMPATÍVEIS:
  orcamentoTotalPortfolio: number
  valorRealizadoPortfolio: number
  orcamentoAprovadoPortfolio: number
  eficienciaMediaPortfolio: number
  progressoFinanceiroMedio: number
  // ✅ COMPATIBILIDADE COM COMPONENTES EXISTENTES:
  mediaaProgressoGeral?: number
  mediaaAvancaoFisico?: number
}

// ✅ OBRA UNIFICADA COMPATÍVEL COM TODOS OS COMPONENTES
export interface ObraUnificada {
  codigo: string
  nome: string
  status: string
  progressoGeral: number
  avancooFisico: number  // ✅ Nome que ListaObrasUnificadas.tsx usa
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
    // 💰 MÉTRICAS FINANCEIRAS NAS MÉTRICAS (para compatibilidade):
    orcamentoTotal?: number
    valorRealizado?: number
    orcamentoAprovado?: number
    eficienciaExecucao?: number
    progressoFinanceiro?: number
  }
  temEnergizacao?: boolean
  // 💰 DADOS FINANCEIROS DA OBRA (estrutura que os componentes esperam):
  dadosFinanceiros: {
    orcamentoTotal: number
    valorRealizado: number
    orcamentoAprovado: number
    eficienciaExecucao: number
    progressoFinanceiro: number
    statusEficiencia: 'Eficiente' | 'Atenção' | 'Crítico'
    corelacionEncontrada: boolean
  }
  fiscalizacao: {
    tarefas: TaskData[]
    progressoFornecimentos: number
    progressoMedio: number  // ✅ ADICIONADO PARA CURVATENDENCIA
    tarefasConcluidas?: number
    totalTarefas?: number
  }
  execucao: {
    tarefas: TaskData[]
    progressoExecucao: number
    progressoMedio: number  // ✅ ADICIONADO PARA CURVATENDENCIA
    tarefasConcluidas?: number
    totalTarefas?: number
  }
}

// ✅ ESTRUTURA QUE DashboardUnificado.tsx ESPERA
export interface DashboardUnificadoType {
  obras: ObraUnificada[]
  metricas: MetricasGerais
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

// ✅ TaskData COMPATÍVEL COM TODOS OS COMPONENTES
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
  'Orçamento (R$)'?: number | null // 💰 DADOS FINANCEIROS
  '_aba'?: string
}