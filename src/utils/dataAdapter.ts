// src/utils/dataAdapter.ts - ADAPTADOR ESTRATÉGICO PARA OBRAS UNIFICADAS
import { DashboardData, BaseObraData } from '@/types/obra'
import { DashboardUnificadoType, ObraUnificada, TaskData, FiscalizacaoData, ExecucaoData, MetricasObra } from '@/types/obra-unificada'

interface ObraUnificadaInterna {
  codigo: string
  nome: string
  tarefasF: BaseObraData[]
  tarefasE: BaseObraData[]
  todasTarefas: BaseObraData[]
  status: {
    fase: string
    descricao: string
    fasesAtivas: string[]
  }
  alertas: any[]
}

export class DataAdapter {
  
  static convertToUnifiedStructure(dashboardData: DashboardData): DashboardUnificadoType {
    console.log('🔄 Convertendo para estrutura unificada estratégica...')
    
    const unifiedData: DashboardUnificadoType = {}
    
    // 🎯 ETAPA 1: Agrupar abas por obra (reconhecendo F+E)
    const gruposObras = this.agruparAbasPorObra(dashboardData.sheets)
    
    // 🎯 ETAPA 2: Processar cada grupo como obra unificada
    Object.entries(gruposObras).forEach(([codigoObra, dadosObra]) => {
      try {
        const obraUnificada = this.criarObraUnificada(codigoObra, dadosObra)
        if (obraUnificada) {
          unifiedData[codigoObra] = obraUnificada
          console.log(`✅ Obra unificada: ${obraUnificada.nome}`)
          console.log(`   F: ${obraUnificada.fiscalizacao.totalTarefas} tarefas | E: ${obraUnificada.execucao.totalTarefas} tarefas`)
          console.log(`   Progresso: ${obraUnificada.metricas.progressoGeral}% | Avanço: ${obraUnificada.metricas.avancooFisico}%`)
        }
      } catch (error) {
        console.error(`❌ Erro ao processar obra ${codigoObra}:`, error)
      }
    })
    
    console.log(`✅ Conversão concluída: ${Object.keys(unifiedData).length} obras unificadas`)
    return unifiedData
  }
  
  // 🎯 AGRUPAMENTO INTELIGENTE POR OBRA (F+E)
  private static agruparAbasPorObra(sheets: { [key: string]: BaseObraData[] }): { [obra: string]: ObraUnificadaInterna } {
    const grupos: { [obra: string]: { fiscalizacao?: BaseObraData[], execucao?: BaseObraData[], nomeObra?: string } } = {}
    
    // Primeira passada: agrupar por código base
    Object.entries(sheets).forEach(([nomeAba, dados]) => {
      let codigoObra = nomeAba
      let tipo: 'fiscalizacao' | 'execucao' = 'fiscalizacao'
      
      // Detectar tipo e extrair código da obra
      if (nomeAba.endsWith(' - F')) {
        tipo = 'fiscalizacao'
        codigoObra = nomeAba.replace(' - F', '')
      } else if (nomeAba.endsWith(' - E')) {
        tipo = 'execucao'
        codigoObra = nomeAba.replace(' - E', '')
      }
      
      if (!grupos[codigoObra]) {
        grupos[codigoObra] = {}
      }
      
      grupos[codigoObra][tipo] = dados
      
      // Nome da obra vem da primeira tarefa de nível 1 da fiscalização
      if (tipo === 'fiscalizacao' && dados.length > 0) {
        const tarefaRaiz = dados.find(t => t.N_vel === 1)
        if (tarefaRaiz && tarefaRaiz.Nome_da_Tarefa) {
          grupos[codigoObra].nomeObra = tarefaRaiz.Nome_da_Tarefa
        }
      }
    })
    
    // Segunda passada: criar estrutura unificada
    const obrasUnificadas: { [obra: string]: ObraUnificadaInterna } = {}
    
    Object.entries(grupos).forEach(([codigoObra, dadosGrupo]) => {
      const tarefasF = dadosGrupo.fiscalizacao || []
      const tarefasE = dadosGrupo.execucao || []
      const todasTarefas = [...tarefasF, ...tarefasE]
      
      if (todasTarefas.length === 0) return
      
      const nomeObra = dadosGrupo.nomeObra || codigoObra
      
      obrasUnificadas[codigoObra] = {
        codigo: codigoObra,
        nome: nomeObra,
        tarefasF,
        tarefasE,
        todasTarefas,
        status: this.determinarStatusObra(todasTarefas),
        alertas: this.gerarAlertasObra(todasTarefas)
      }
    })
    
    return obrasUnificadas
  }
  
  // 🎯 CRIAÇÃO DA OBRA UNIFICADA COM MÉTRICAS ESTRATÉGICAS
  private static criarObraUnificada(codigoObra: string, dadosObra: ObraUnificadaInterna): ObraUnificada | null {
    
    // Converter dados para TaskData
    const fiscalizacao: FiscalizacaoData = this.converterParaTaskData(dadosObra.tarefasF, 'F')
    const execucao: ExecucaoData = this.converterParaTaskData(dadosObra.tarefasE, 'E')
    
    // Calcular métricas estratégicas
    const metricas = this.calcularMetricasEstrategicas(fiscalizacao, execucao, dadosObra.todasTarefas)
    
    return {
      codigo: codigoObra,
      nome: dadosObra.nome,
      fiscalizacao,
      execucao,
      metricas
    }
  }
  
  // 🎯 CONVERSÃO PARA TASKDATA COM CAMPOS ESTRATÉGICOS
  private static converterParaTaskData(dados: BaseObraData[], _origem: 'F' | 'E'): FiscalizacaoData | ExecucaoData {
    const tarefas: TaskData[] = dados.map(item => ({
      EDT: String(item.EDT),
      'Nome da Tarefa': item.Nome_da_Tarefa,
      'Nível': item.N_vel,
      'Resumo (pai)': item.Resumo__pai_,
      'Marco': null, // Será detectado por análise de padrões
      'Data Início': item.Data_In_cio,
      'Data Término': item.Data_T_rmino,
      '% Concluído': item.__Conclu_do,
      'LinhaBase Início': typeof item.LinhaBase_In_cio === 'number' ? item.LinhaBase_In_cio : 0,
      'LinhaBase Término': typeof item.LinhaBase_T_rmino === 'number' ? item.LinhaBase_T_rmino : 0,
      'Predecessoras': null,
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
  
  // 🎯 CÁLCULO DE MÉTRICAS ESTRATÉGICAS AVANÇADAS
  private static calcularMetricasEstrategicas(
    fiscalizacao: FiscalizacaoData, 
    execucao: ExecucaoData,
    todasTarefas: BaseObraData[]
  ): MetricasObra {
    
    // 📊 PROGRESSO GERAL: baseado em tarefas não-resumo (conforme especificado)
    const tarefasExecutaveis = todasTarefas.filter(t => t.N_vel > 2) // Tarefas não-resumo
    const tarefasExecutaveisConcluidas = tarefasExecutaveis.filter(t => t.__Conclu_do >= 100)
    
    const progressoGeral = tarefasExecutaveis.length > 0 ? 
      Math.round((tarefasExecutaveisConcluidas.length / tarefasExecutaveis.length) * 100) : 0
    
    // 🎯 AVANÇO FÍSICO: baseado em marcos com "SIM" + 100% concluído
    const marcosDetectados = this.detectarMarcos(todasTarefas)
    const marcosConcluidos = marcosDetectados.filter(m => m.concluido)
    
    const avancooFisico = marcosDetectados.length > 0 ? 
      Math.round((marcosConcluidos.length / marcosDetectados.length) * 100) : 0
    
    // 📈 TOTAIS UNIFICADOS
    const totalTarefas = fiscalizacao.totalTarefas + execucao.totalTarefas
    const tarefasConcluidas = fiscalizacao.tarefasConcluidas + execucao.tarefasConcluidas
    
    return {
      progressoGeral,
      avancooFisico,
      totalTarefas,
      tarefasConcluidas,
      totalMarcos: marcosDetectados.length,
      marcosConcluidos: marcosConcluidos.length
    }
  }
  
  // 🎯 DETECÇÃO INTELIGENTE DE MARCOS
  private static detectarMarcos(tarefas: BaseObraData[]): Array<{tarefa: BaseObraData, concluido: boolean}> {
    const marcos: Array<{tarefa: BaseObraData, concluido: boolean}> = []
    
    tarefas.forEach(tarefa => {
      const nome = tarefa.Nome_da_Tarefa.toLowerCase()
      
      // Critérios para identificar marcos (palavras-chave estratégicas)
      const ehMarco = 
        nome.includes('entrega') ||
        nome.includes('aprovação') ||
        nome.includes('aceite') ||
        nome.includes('energização') ||
        nome.includes('comissionamento') ||
        nome.includes('operação') ||
        nome.includes('conclusão') ||
        (tarefa.N_vel <= 2 && tarefa.__Conclu_do > 0) || // Tarefas resumo com progresso
        nome.includes('instalação') && nome.includes('completa')
      
      if (ehMarco) {
        marcos.push({
          tarefa,
          concluido: tarefa.__Conclu_do >= 100
        })
      }
    })
    
    console.log(`   📍 Marcos detectados: ${marcos.length} (${marcos.filter(m => m.concluido).length} concluídos)`)
    return marcos
  }
  
  // 🎯 DETERMINAÇÃO DE STATUS POR FASES
  private static determinarStatusObra(tarefas: BaseObraData[]): { fase: string, descricao: string, fasesAtivas: string[] } {
    const tarefasResumo = tarefas.filter(t => t.N_vel <= 2)
    
    const fases = {
      preliminares: false,
      projetos: false,
      civil: false,
      eletro: false,
      spcs: false,
      finalizacao: false
    }
    
    // Análise baseada em tarefas resumo com progresso
    tarefasResumo.forEach(tarefa => {
      if (tarefa.__Conclu_do === 0) return
      
      const nome = tarefa.Nome_da_Tarefa.toLowerCase()
      
      if (nome.includes('mobilização') || nome.includes('preliminar') || nome.includes('inicialização')) {
        fases.preliminares = true
      }
      if (nome.includes('projeto') || nome.includes('executivo') || nome.includes('desenho') || nome.includes('detalhamento')) {
        fases.projetos = true
      }
      if (nome.includes('civil') || nome.includes('fundação') || nome.includes('estrutura') || nome.includes('concreto')) {
        fases.civil = true
      }
      if (nome.includes('eletromecânica') || nome.includes('elétrica') || nome.includes('cabo') || nome.includes('equipamento')) {
        fases.eletro = true
      }
      if (nome.includes('spcs') || nome.includes('proteção') || nome.includes('automação') || nome.includes('controle')) {
        fases.spcs = true
      }
      if (nome.includes('energização') || nome.includes('operação') || nome.includes('comissionamento')) {
        fases.finalizacao = true
      }
    })
    
    // Determinar fase atual e descrição
    const fasesAtivas: string[] = []
    let descricao = 'Em procedimentos preliminares'
    
    if (fases.finalizacao) {
      fasesAtivas.push('Energização')
      descricao = 'Obra em Energização'
    }
    if (fases.spcs) {
      fasesAtivas.push('SPCS')
      if (!fases.finalizacao) descricao = 'Obra em Execução - SPCS'
    }
    if (fases.eletro) {
      fasesAtivas.push('Eletromecânica')
      if (fasesAtivas.length === 1) descricao = 'Obra em Execução - Eletromecânica'
    }
    if (fases.civil) {
      fasesAtivas.push('Civil')
      if (fasesAtivas.length === 1) descricao = 'Obra em Execução - Civil'
    }
    if (fases.projetos && fasesAtivas.length === 0) {
      descricao = 'Em elaboração de projetos executivos'
    }
    
    // Se múltiplas fases ativas, mostrar combinação
    if (fasesAtivas.length > 1) {
      descricao = `Obra em Execução - ${fasesAtivas.join(' + ')}`
    }
    
    return {
      fase: fasesAtivas.length > 0 ? fasesAtivas[fasesAtivas.length - 1].toLowerCase() : 'preliminares',
      descricao,
      fasesAtivas
    }
  }
  
  // 🎯 GERAÇÃO DE ALERTAS ESTRATÉGICOS
  private static gerarAlertasObra(tarefas: BaseObraData[]): any[] {
    const alertas: any[] = []
    
    // Detectar atrasos baseado na linha base
    const tarefasAtrasadas = tarefas.filter(t => {
      if (typeof t.LinhaBase_T_rmino !== 'number' || typeof t.Data_T_rmino !== 'number') return false
      return t.Data_T_rmino > t.LinhaBase_T_rmino && t.__Conclu_do < 100
    })
    
    if (tarefasAtrasadas.length > 0) {
      alertas.push({
        tipo: 'atraso',
        gravidade: tarefasAtrasadas.length > 5 ? 'alta' : 'media',
        titulo: `${tarefasAtrasadas.length} tarefas atrasadas`,
        descricao: 'Comparação com linha base indica atrasos'
      })
    }
    
    // Detectar riscos na energização
    const tarefasEnergizacao = tarefas.filter(t => 
      t.Nome_da_Tarefa.toLowerCase().includes('energização') ||
      t.Nome_da_Tarefa.toLowerCase().includes('operação')
    )
    
    if (tarefasEnergizacao.length > 0 && tarefasEnergizacao.some(t => t.__Conclu_do < 100)) {
      const energizacaoAtrasada = tarefasEnergizacao.some(t => 
        typeof t.LinhaBase_T_rmino === 'number' && 
        typeof t.Data_T_rmino === 'number' && 
        t.Data_T_rmino > t.LinhaBase_T_rmino
      )
      
      if (energizacaoAtrasada) {
        alertas.push({
          tipo: 'energizacao',
          gravidade: 'critica',
          titulo: 'Risco na meta de energização',
          descricao: 'Tarefas críticas para energização podem estar comprometidas'
        })
      }
    }
    
    return alertas
  }
}