// src/utils/dataAdapter.ts - ADAPTADOR PARA PRESERVAR DESIGN ORIGINAL
import { DashboardData, BaseObraData } from '@/types/obra'
import { DashboardUnificadoType, ObraUnificada, TaskData, FiscalizacaoData, ExecucaoData, MetricasObra } from '@/types/obra-unificada'

export class DataAdapter {
  
  static convertToUnifiedStructure(dashboardData: DashboardData): DashboardUnificadoType {
    console.log('🔄 Convertendo dados para estrutura unificada...')
    
    const unifiedData: DashboardUnificadoType = {}
    
    // Agrupar abas por obra (baseado no padrão: CODIGO - F/E)
    const obraGroups = this.groupSheetsByProject(dashboardData.sheets)
    
    // Converter cada grupo em ObraUnificada
    Object.entries(obraGroups).forEach(([codigoObra, abas]) => {
      const obra = this.createUnifiedProject(codigoObra, abas)
      if (obra) {
        unifiedData[codigoObra] = obra
      }
    })
    
    console.log('✅ Conversão concluída:', Object.keys(unifiedData).length, 'obras processadas')
    return unifiedData
  }
  
  private static groupSheetsByProject(sheets: { [key: string]: BaseObraData[] }): { [projeto: string]: { fiscalizacao?: BaseObraData[], execucao?: BaseObraData[] } } {
    const groups: { [projeto: string]: { fiscalizacao?: BaseObraData[], execucao?: BaseObraData[] } } = {}
    
    Object.entries(sheets).forEach(([nomeAba, dados]) => {
      // Extrair código do projeto removendo sufixo " - F" ou " - E"
      let codigoProjeto = nomeAba.replace(/ - [FE]$/, '')
      
      // Se não tem sufixo, usar o nome completo
      if (codigoProjeto === nomeAba) {
        codigoProjeto = nomeAba
      }
      
      // Inicializar grupo se não existir
      if (!groups[codigoProjeto]) {
        groups[codigoProjeto] = {}
      }
      
      // Classificar como fiscalização ou execução
      if (nomeAba.endsWith(' - F') || nomeAba.toLowerCase().includes('fiscaliz')) {
        groups[codigoProjeto].fiscalizacao = dados
      } else if (nomeAba.endsWith(' - E') || nomeAba.toLowerCase().includes('execu')) {
        groups[codigoProjeto].execucao = dados
      } else {
        // Se não tem sufixo claro, assumir como fiscalização
        groups[codigoProjeto].fiscalizacao = dados
      }
    })
    
    return groups
  }
  
  private static createUnifiedProject(codigoObra: string, abas: { fiscalizacao?: BaseObraData[], execucao?: BaseObraData[] }): ObraUnificada | null {
    
    // Extrair nome da obra do primeiro item (campo Resumo__pai_)
    let nomeObra = codigoObra
    const primeiroItem = abas.fiscalizacao?.[0] || abas.execucao?.[0]
    if (primeiroItem?.Resumo__pai_ && primeiroItem.Resumo__pai_.trim() !== '') {
      nomeObra = primeiroItem.Resumo__pai_.trim()
    }
    
    // Converter dados de fiscalização
    const fiscalizacao: FiscalizacaoData = this.convertToTaskDataArray(abas.fiscalizacao || [])
    
    // Converter dados de execução  
    const execucao: ExecucaoData = this.convertToTaskDataArray(abas.execucao || [])
    
    // Calcular métricas da obra
    const metricas = this.calculateProjectMetrics(fiscalizacao, execucao)
    
    const obra: ObraUnificada = {
      codigo: codigoObra,
      nome: nomeObra,
      fiscalizacao,
      execucao,
      metricas
    }
    
    console.log(`🏗️ Obra criada: ${nomeObra} (F:${fiscalizacao.totalTarefas}, E:${execucao.totalTarefas})`)
    return obra
  }
  
  private static convertToTaskDataArray(baseData: BaseObraData[]): FiscalizacaoData | ExecucaoData {
    const tarefas: TaskData[] = baseData.map(item => ({
      EDT: String(item.EDT),
      'Nome da Tarefa': item.Nome_da_Tarefa,
      'Nível': item.N_vel,
      'Resumo (pai)': item.Resumo__pai_,
      'Marco': null, // BaseObraData não tem campo Marco
      'Data Início': item.Data_In_cio,
      'Data Término': item.Data_T_rmino,
      '% Concluído': item.__Conclu_do,
      'LinhaBase Início': typeof item.LinhaBase_In_cio === 'number' ? item.LinhaBase_In_cio : 0,
      'LinhaBase Término': typeof item.LinhaBase_T_rmino === 'number' ? item.LinhaBase_T_rmino : 0,
      'Predecessoras': null, // BaseObraData não tem esses campos
      'Sucessoras': null,
      'Anotações': null,
      'Nomes dos Recursos': null,
      'Coordenada': null
    }))
    
    const totalTarefas = tarefas.length
    const tarefasConcluidas = tarefas.filter(t => t['% Concluído'] >= 100).length
    
    return {
      tarefas,
      totalTarefas,
      tarefasConcluidas
    }
  }
  
  private static calculateProjectMetrics(fiscalizacao: FiscalizacaoData, execucao: ExecucaoData): MetricasObra {
    const totalTarefas = fiscalizacao.totalTarefas + execucao.totalTarefas
    const tarefasConcluidas = fiscalizacao.tarefasConcluidas + execucao.tarefasConcluidas
    
    const progressoGeral = totalTarefas > 0 ? Math.round((tarefasConcluidas / totalTarefas) * 100) : 0
    
    // Para avanço físico, usar dados de execução (mais representativo do avanço real)
    const avancooFisico = execucao.totalTarefas > 0 
      ? Math.round((execucao.tarefasConcluidas / execucao.totalTarefas) * 100)
      : progressoGeral
    
    // Marcos - assumir que tarefas de nível 1 são marcos principais
    const marcosExecucao = execucao.tarefas.filter(t => t['Nível'] === 1)
    const totalMarcos = marcosExecucao.length
    const marcosConcluidos = marcosExecucao.filter(t => t['% Concluído'] >= 100).length
    
    return {
      progressoGeral,
      avancooFisico,
      totalTarefas,
      tarefasConcluidas,
      totalMarcos: totalMarcos > 0 ? totalMarcos : Math.max(1, Math.ceil(execucao.totalTarefas / 10)), // Fallback
      marcosConcluidos: totalMarcos > 0 ? marcosConcluidos : Math.ceil(execucao.tarefasConcluidas / 10) // Fallback
    }
  }
}