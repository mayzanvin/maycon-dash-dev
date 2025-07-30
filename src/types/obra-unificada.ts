// Tipos para obras unificadas (Fiscalização + Execução)

export interface TaskData {
  EDT: number | string;
  'Nome da Tarefa': string;
  'Nível': number;
  'Resumo (pai)': string;
  'Data Início': number;
  'Data Término': number;
  '% Concluído': number;
  'LinhaBase Início': number;
  'LinhaBase Término': number;
  Marco?: string; // Presente apenas na execução
}

export interface FiscalizacaoData {
  planilha: string;
  tarefas: TaskData[];
  totalTarefas: number;
}

export interface ExecucaoData {
  planilha: string;
  tarefas: TaskData[];
  totalTarefas: number;
  marcosComSim: number;
  marcosConcluidos: number;
}

export interface MetricasObra {
  progressoGeral: number;
  avancooFisico: number;
  totalTarefas: number;
  tarefasConcluidas: number;
  totalMarcos: number;
  marcosConcluidos: number;
}

export interface ObraUnificada {
  nome: string;
  codigo: string;
  fiscalizacao: FiscalizacaoData;
  execucao: ExecucaoData;
  metricas: MetricasObra;
}

export interface DashboardUnificado {
  [projectCode: string]: ObraUnificada;
}

export interface MetricasGerais {
  totalObras: number;
  obrasComExecucao: number;
  mediaaProgressoGeral: number;
  mediaAvancaoFisico: number;
  totalMarcosFisicos: number;
  marcosFisicosConcluidos: number;
}