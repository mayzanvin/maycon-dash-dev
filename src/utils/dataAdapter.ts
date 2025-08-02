// src/utils/dataAdapter.ts - CORREÇÃO DOS ERROS ESPECÍFICOS
import { DashboardData, BaseObraData } from '@/types/obra'
import { DashboardUnificadoType, ObraUnificada, TaskData, FiscalizacaoData, ExecucaoData, MetricasObra } from '@/types/obra-unificada'

export class DataAdapter {
  
  static convertToDashboardUnificado(dashboardData: DashboardData): DashboardUnificadoType {
    console.log('🔄 Convertendo para DashboardUnificado...')
    
    const unifiedData: DashboardUnificadoType = {}
    const obrasAgrupadas = this.agruparObrasPorCodigo(dashboardData.sheets)
    
    Object.entries(obrasAgrupadas).forEach(([codigoObra, dados]) => {
      console.log(`📋 Processando obra: ${codigoObra}`)
      
      const { tarefasF, tarefasE, nomeReal, temEnergizacao } = dados
      const todasTarefas = [...tarefasF, ...tarefasE]
      
      if (todasTarefas.length === 0) return
      
      // Converter BaseObraData para TaskData
      const taskDataList: TaskData[] = todasTarefas.map(tarefa => ({
        'EDT': String(tarefa.EDT),
        'Nome da Tarefa': tarefa.Nome_da_Tarefa,
        'Nível': tarefa.N_vel,
        'Resumo (pai)': tarefa.Resumo__pai_,
        'Marco': tarefa.Marco || null,
        'Data Início': tarefa.Data_In_cio,
        'Data Término': tarefa.Data_T_rmino,
        '% Concluído': tarefa.__Conclu_do,
        'LinhaBase Início': Number(tarefa.LinhaBase_In_cio) || 0,
        'LinhaBase Término': Number(tarefa.LinhaBase_T_rmino) || 0,
        'Predecessoras': tarefa.Predecessoras || null,
        'Sucessoras': tarefa.Sucessoras || null,
        'Anotações': tarefa.Anotacoes || null,
        'Nomes dos Recursos': tarefa.Nomes_dos_Recursos || null,
        'Coordenada': tarefa.Coordenada || null
      }))
      
      // Calcular métricas
      const metricas = this.calcularMetricas(taskDataList, temEnergizacao)
      
      // Criar dados de fiscalização
      const fiscalizacao: FiscalizacaoData = {
        tarefas: tarefasF.map(t => this.baseObraToTaskData(t)),
        progressoFornecimentos: this.calcularProgressoFornecimentos(tarefasF)
      }
      
      // Criar dados de execução
      const execucao: ExecucaoData = {
        tarefas: tarefasE.map(t => this.baseObraToTaskData(t)),
        progressoExecucao: this.calcularProgressoExecucao(tarefasE)
      }
      
      // ✅ Criar obra unificada e usar imediatamente
      const obraUnificada: ObraUnificada = {
        codigo: codigoObra,
        nome: nomeReal,
        temEnergizacao,
        fiscalizacao,
        execucao,
        metricas
      }
      
      // ✅ USAR a obra criada
      unifiedData[codigoObra] = obraUnificada
      console.log(`   ✅ ${taskDataList.length} tarefas processadas para ${obraUnificada.nome}`)
    })
    
    console.log(`✅ Conversão concluída: ${Object.keys(unifiedData).length} obras`)
    return unifiedData
  }
  
  private static agruparObrasPorCodigo(sheets: { [key: string]: BaseObraData[] }): {
    [key: string]: {
      tarefasF: BaseObraData[]
      tarefasE: BaseObraData[]
      nomeReal: string
      temEnergizacao: boolean
    }
  } {
    const grupos: {
      [key: string]: {
        tarefasF: BaseObraData[]
        tarefasE: BaseObraData[]
        nomeReal: string
        temEnergizacao: boolean
      }
    } = {}
    
    Object.entries(sheets).forEach(([nomeAba, tarefas]) => {
      const codigoObra = nomeAba.replace(/ - [FE]$/, '')
      const tipoAba = nomeAba.endsWith(' - F') ? 'F' : 'E'
      
      if (!grupos[codigoObra]) {
        grupos[codigoObra] = {
          tarefasF: [],
          tarefasE: [],
          nomeReal: codigoObra,
          temEnergizacao: false
        }
      }
      
      // Extrair nome real da primeira tarefa nível 1 (se for F)
      if (tipoAba === 'F' && !grupos[codigoObra].nomeReal) {
        const primeiraResumo = tarefas.find(t => t.N_vel === 1)
        if (primeiraResumo) {
          grupos[codigoObra].nomeReal = primeiraResumo.Resumo__pai_ || primeiraResumo.Nome_da_Tarefa
        }
      }
      
      // Detectar energização
      const temEnergizacao = tarefas.some(t => 
        t.Nome_da_Tarefa.toLowerCase().includes('energização') ||
        t.Nome_da_Tarefa.toLowerCase().includes('energizacao')
      )
      
      if (temEnergizacao) {
        grupos[codigoObra].temEnergizacao = true
      }
      
      // Adicionar tarefas por tipo
      if (tipoAba === 'F') {
        grupos[codigoObra].tarefasF = tarefas
      } else {
        grupos[codigoObra].tarefasE = tarefas
      }
    })
    
    return grupos
  }
  
  private static baseObraToTaskData(tarefa: BaseObraData): TaskData {
    return {
      'EDT': String(tarefa.EDT),
      'Nome da Tarefa': tarefa.Nome_da_Tarefa,
      'Nível': tarefa.N_vel,
      'Resumo (pai)': tarefa.Resumo__pai_,
      'Marco': tarefa.Marco || null,
      'Data Início': tarefa.Data_In_cio,
      'Data Término': tarefa.Data_T_rmino,
      '% Concluído': tarefa.__Conclu_do,
      'LinhaBase Início': Number(tarefa.LinhaBase_In_cio) || 0,
      'LinhaBase Término': Number(tarefa.LinhaBase_T_rmino) || 0,
      'Predecessoras': tarefa.Predecessoras || null,
      'Sucessoras': tarefa.Sucessoras || null,
      'Anotações': tarefa.Anotacoes || null,
      'Nomes dos Recursos': tarefa.Nomes_dos_Recursos || null,
      'Coordenada': tarefa.Coordenada || null
    }
  }
  
  private static calcularMetricas(tarefas: TaskData[], temEnergizacao: boolean): MetricasObra {
    const tarefasExecutaveis = tarefas.filter(t => t['Nível'] > 1)
    const tarefasConcluidas = tarefasExecutaveis.filter(t => t['% Concluído'] === 100)
    
    const progressoGeral = tarefasExecutaveis.length > 0 
      ? (tarefasConcluidas.length / tarefasExecutaveis.length) * 100 
      : 0
    
    // Avanço físico baseado em marcos ou progresso geral
    let avanceFisico = 0
    if (temEnergizacao) {
      const marcos = tarefas.filter(t => t.Marco?.toLowerCase() === 'sim' && t['% Concluído'] === 100)
      const totalMarcos = tarefas.filter(t => t.Marco?.toLowerCase() === 'sim')
      avanceFisico = totalMarcos.length > 0 ? (marcos.length / totalMarcos.length) * 100 : 0
    } else {
      avanceFisico = progressoGeral
    }
    
    return {
      progressoGeral: Math.round(progressoGeral),
      avanceFisico: Math.round(avanceFisico),
      totalTarefas: tarefas.length,
      tarefasConcluidas: tarefasConcluidas.length,
      totalMarcos: tarefas.filter(t => t.Marco?.toLowerCase() === 'sim').length,
      marcosConcluidos: tarefas.filter(t => t.Marco?.toLowerCase() === 'sim' && t['% Concluído'] === 100).length
    }
  }
  
  // ✅ CORRIGIDO: Método que faltava
  private static calcularProgressoFornecimentos(tarefasF: BaseObraData[]): number {
    if (tarefasF.length === 0) return 0
    
    const executaveis = tarefasF.filter(t => t.N_vel > 1)
    const concluidas = executaveis.filter(t => t.__Conclu_do === 100)
    
    return executaveis.length > 0 ? (concluidas.length / executaveis.length) * 100 : 0
  }
  
  // ✅ CORRIGIDO: Método que faltava
  private static calcularProgressoExecucao(tarefasE: BaseObraData[]): number {
    if (tarefasE.length === 0) return 0
    
    const executaveis = tarefasE.filter(t => t.N_vel > 1)
    const concluidas = executaveis.filter(t => t.__Conclu_do === 100)
    
    return executaveis.length > 0 ? (concluidas.length / executaveis.length) * 100 : 0
  }
}