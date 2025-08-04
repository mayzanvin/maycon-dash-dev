// src/utils/dataAdapter.ts - CORREÇÃO CIRÚRGICA MANTENDO EVOLUÇÃO
import { DashboardData, BaseObraData } from '@/types/obra'
import { DashboardUnificadoType, ObraUnificada, MetricasGerais } from '@/types/obra-unificada'

export class DataAdapter {
  
  static convertToUnificado(dashboardData: DashboardData): DashboardUnificadoType {
    console.log('🔄 === INICIANDO CONVERSÃO PARA DASHBOARD UNIFICADO ===')
    console.log('📊 Total de tarefas recebidas:', dashboardData.todasTarefas.length)
    
    if (!dashboardData.todasTarefas || dashboardData.todasTarefas.length === 0) {
      console.log('⚠️ Nenhuma tarefa encontrada')
      return {
        obras: [],
        metricas: this.criarMetricasVazias(),
        ultimaAtualizacao: new Date().toISOString()
      }
    }

    // 📑 AGRUPAR TAREFAS POR ABA usando _aba (BaseObraData)
    const abasPorNome = this.agruparPorAba(dashboardData.todasTarefas)
    console.log('📋 Abas encontradas:', Object.keys(abasPorNome))

    // 🔗 IDENTIFICAR PARES F+E - PADRÃO REAL: -CR-F e -CR-E
    const paresObras = this.identificarParesObras(abasPorNome)
    console.log('🔗 Pares F+E identificados:', paresObras.length)

    // 🏗️ CRIAR OBRAS UNIFICADAS
    const obras = paresObras.map(par => this.criarObraUnificada(par, abasPorNome))
    console.log('🎯 Total de obras unificadas criadas:', obras.length)

    // 📊 CALCULAR MÉTRICAS GERAIS
    const metricas = this.calcularMetricasGerais(obras)

    return {
      obras,
      metricas,
      ultimaAtualizacao: new Date().toISOString()
    }
  }

  // 📑 AGRUPAR TAREFAS POR ABA - USAR _aba DO BaseObraData
  private static agruparPorAba(tasks: BaseObraData[]): Record<string, BaseObraData[]> {
    const abasPorNome: Record<string, BaseObraData[]> = {}
    
    tasks.forEach(task => {
      const aba = task._aba || 'Sem_Aba'
      if (!abasPorNome[aba]) {
        abasPorNome[aba] = []
      }
      abasPorNome[aba].push(task)
    })
    
    return abasPorNome
  }

  // 🔗 IDENTIFICAR PARES F+E - INCLUIR OBRAS SÓ COM F
  private static identificarParesObras(abasPorNome: Record<string, BaseObraData[]>): Array<{nomeBase: string, abaF: string, abaE: string | null}> {
    const abas = Object.keys(abasPorNome).filter(aba => aba !== 'Planilha1') // Filtrar Planilha1
    const pares: Array<{nomeBase: string, abaF: string, abaE: string | null}> = []
    
    console.log('🔍 Analisando abas para pares F+E:', abas)
    
    // Buscar padrão: OBRA-CR-F + OBRA-CR-E (ou só F se não tiver E)
    const abasF = abas.filter(aba => aba.endsWith('-CR-F'))
    
    abasF.forEach(abaF => {
      // CEPV_RRE-9395-764000-1-CR-F -> CEPV_RRE-9395-764000-1-CR-E
      const nomeBase = abaF.slice(0, -5) // Remove "-CR-F"
      const abaE = `${nomeBase}-CR-E`
      
      if (abas.includes(abaE)) {
        // Par completo F+E
        pares.push({ nomeBase, abaF, abaE })
        console.log(`🔗 Par F+E encontrado: ${nomeBase}`)
        console.log(`   F: ${abaF}`)
        console.log(`   E: ${abaE}`)
      } else {
        // Só F (sem E)
        pares.push({ nomeBase, abaF, abaE: null })
        console.log(`📋 Só Fiscalização: ${nomeBase}`)
        console.log(`   F: ${abaF}`)
        console.log(`   E: (não existe)`)
      }
    })
    
    console.log(`📊 Total de obras encontradas: ${pares.length}`)
    return pares
  }

  // 🏗️ CRIAR OBRA UNIFICADA - SUPORTA OBRAS SÓ COM F
  private static criarObraUnificada(
    par: {nomeBase: string, abaF: string, abaE: string | null}, 
    abasPorNome: Record<string, BaseObraData[]>
  ): ObraUnificada {
    const tarefasF = abasPorNome[par.abaF] || []
    const tarefasE = par.abaE ? (abasPorNome[par.abaE] || []) : []
    
    console.log(`🏗️ Criando obra: ${par.nomeBase}`)
    console.log(`   📊 Tarefas F: ${tarefasF.length}, Tarefas E: ${tarefasE.length}`)

    // 📝 OBTER INFORMAÇÕES DA OBRA
    const temExecucao = tarefasE.length > 0
    const nomeReal = this.obterNomeRealObra(tarefasF)
    
    // 🏷️ CRIAR CÓDIGO COM INDICADOR F/E
    const indicador = temExecucao ? '[F+E]' : '[F]'
    const codigoComIndicador = `${par.nomeBase} ${indicador}`
    
    // 📊 CALCULAR MÉTRICAS
    const progressoGeral = this.calcularProgressoGeral(tarefasF, tarefasE)
    const avancaoFisico = this.calcularAvancaoFisico(tarefasF, tarefasE)
    const temEnergizacao = this.detectarEnergizacao(tarefasF, tarefasE)
    const status = this.determinarStatus(temEnergizacao, avancaoFisico, tarefasE.length > 0)
    
    // 🏗️ CRIAR DADOS DE FISCALIZAÇÃO E EXECUÇÃO
    const fiscalizacao = this.criarDadosFiscalizacao(tarefasF)
    const execucao = this.criarDadosExecucao(tarefasE)
    const totalTarefas = tarefasF.length + tarefasE.length
    const tarefasConcluidas = fiscalizacao.tarefasConcluidas + execucao.tarefasConcluidas
    const totalMarcos = fiscalizacao.totalMarcos + execucao.totalMarcos
    const marcosConcluidos = fiscalizacao.marcosConcluidos + execucao.marcosConcluidos
    
    const obra: ObraUnificada = {
      codigo: codigoComIndicador,           // ✅ Código com indicador [F] ou [F+E]
      nome: nomeReal,                       // ✅ Nome limpo sem indicador
      status: status,
      progressoGeral: progressoGeral,
      avancooFisico: avancaoFisico,        // ✅ Nome que ListaObrasUnificadas.tsx espera
      avancaoFisico: avancaoFisico,        // ✅ Alias para compatibilidade
      tarefasConcluidas: tarefasConcluidas,
      totalTarefas: totalTarefas,
      marcos: {
        total: totalMarcos,
        concluidos: marcosConcluidos
      },
      metricas: {
        progressoGeral: progressoGeral,
        avancooFisico: avancaoFisico,
        totalTarefas: totalTarefas,
        tarefasConcluidas: tarefasConcluidas,
        totalMarcos: totalMarcos,
        marcosConcluidos: marcosConcluidos
      },
      temEnergizacao: temEnergizacao,
      fiscalizacao: {
        tarefas: tarefasF as any[], // Cast para compatibilidade
        progressoFornecimentos: fiscalizacao.progressoGeral,
        tarefasConcluidas: fiscalizacao.tarefasConcluidas,
        totalTarefas: fiscalizacao.totalTarefas
      },
      execucao: {
        tarefas: tarefasE as any[], // Cast para compatibilidade
        progressoExecucao: execucao.progressoGeral,
        tarefasConcluidas: execucao.tarefasConcluidas,
        totalTarefas: execucao.totalTarefas
      }
    }
    
    console.log(`✅ Obra criada: ${obra.nome}`)
    console.log(`   Status: ${obra.status}`)
    console.log(`   Progresso: ${obra.progressoGeral}%`)
    console.log(`   Avanço Físico: ${obra.avancaoFisico}%`)
    console.log(`   Tem Execução: ${tarefasE.length > 0 ? 'SIM' : 'NÃO'}`)
    
    return obra
  }

  // 📝 OBTER NOME REAL DA OBRA - SEM INDICADOR (vai no código)
  private static obterNomeRealObra(tarefasF: BaseObraData[]): string {
    console.log(`🔍 Buscando nome real da obra em ${tarefasF.length} tarefas de Fiscalização...`)
    
    // Buscar primeira tarefa nível 1 e pegar o Resumo_pai
    const tarefaNivel1 = tarefasF.find(t => Number(t.N_vel) === 1)
    
    if (tarefaNivel1 && tarefaNivel1.Resumo_pai) {
      const nome = String(tarefaNivel1.Resumo_pai)
      console.log(`✅ Nome encontrado no Resumo (pai): ${nome}`)
      return nome
    }
    
    // Fallback: qualquer tarefa com Resumo_pai preenchido
    const tarefaComResumo = tarefasF.find(t => t.Resumo_pai && String(t.Resumo_pai).trim())
    if (tarefaComResumo && tarefaComResumo.Resumo_pai) {
      const nome = String(tarefaComResumo.Resumo_pai)
      console.log(`⚠️ Nome fallback do Resumo (pai): ${nome}`)
      return nome
    }
    
    console.log(`❌ Nenhum nome encontrado no Resumo (pai), usando nome genérico`)
    return 'Obra sem nome'
  }

  // 📊 CALCULAR PROGRESSO GERAL - ✅ USAR A PROPRIEDADE CORRETA
  private static calcularProgressoGeral(tarefasF: BaseObraData[], tarefasE: BaseObraData[]): number {
    const todasTarefas = [...tarefasF, ...tarefasE]
    if (todasTarefas.length === 0) return 0
    
    const somaProgressos = todasTarefas.reduce((acc, t) => {
      // ✅ USAR A PROPRIEDADE QUE REALMENTE EXISTE NO BaseObraData
      const progresso = Number(t.Porcentagem_Conclu_do) || 0
      return acc + progresso
    }, 0)
    
    const progressoMedio = somaProgressos / todasTarefas.length
    console.log(`📊 Progresso geral calculado: ${progressoMedio.toFixed(1)}%`)
    return Math.round(progressoMedio)
  }

  // 📊 CALCULAR AVANÇO FÍSICO - USANDO Marco e Porcentagem_Conclu_do
  private static calcularAvancaoFisico(tarefasF: BaseObraData[], tarefasE: BaseObraData[]): number {
    const todasTarefas = [...tarefasF, ...tarefasE]
    
    console.log(`📊 Calculando avanço físico para ${todasTarefas.length} tarefas...`)
    
    // Buscar marcos usando coluna Marco
    const marcos = todasTarefas.filter(t => {
      const marco = t.Marco
      if (!marco) return false
      const marcoStr = String(marco).toLowerCase()
      return marcoStr === 'sim' || marcoStr === '1' || marcoStr === 'true'
    })
    
    console.log(`📋 Marcos encontrados: ${marcos.length}`)
    
    if (marcos.length > 0) {
      const marcosConcluidos = marcos.filter(m => Number(m.Porcentagem_Conclu_do) >= 100)
      const avanco = marcos.length > 0 ? (marcosConcluidos.length / marcos.length) * 100 : 0
      console.log(`🎯 Avanço físico (marcos): ${marcosConcluidos.length}/${marcos.length} = ${avanco.toFixed(1)}%`)
      return Math.round(avanco)
    }
    
    // Fallback: tarefas 100% concluídas
    const tarefasConcluidas = todasTarefas.filter(t => Number(t.Porcentagem_Conclu_do) >= 100)
    const avanco = todasTarefas.length > 0 ? (tarefasConcluidas.length / todasTarefas.length) * 100 : 0
    console.log(`🎯 Avanço físico (fallback): ${tarefasConcluidas.length}/${todasTarefas.length} = ${avanco.toFixed(1)}%`)
    return Math.round(avanco)
  }

  // 🔍 DETECTAR ENERGIZAÇÃO - ANÁLISE AVANÇADA
  private static detectarEnergizacao(tarefasF: BaseObraData[], tarefasE: BaseObraData[]): boolean {
    const todasTarefas = [...tarefasF, ...tarefasE]
    
    // ⚡ PALAVRAS-CHAVE DE ENERGIZAÇÃO (mais abrangente)
    const palavrasEnergia = [
      'energização', 'energizacao', 'energizar',
      'comissionamento', 'comissionar',
      'montagem', 'montagens',
      'teste', 'testes', 'ensaio', 'ensaios',
      'ativação', 'ativar',
      'operação', 'operacional',
      'funcionamento',
      'subestação', 'subestacao', 'se ',
      'transformador', 'trafo',
      'disjuntor', 'seccionador',
      'linha de transmissão', 'lt ',
      'equipamento', 'equipamentos'
    ]
    
    // 🏗️ VERIFICAR NOMES DE TAREFAS
    const temEnergia = todasTarefas.some(t => {
      const nome = t.Nome_da_Tarefa ? String(t.Nome_da_Tarefa).toLowerCase() : ''
      const resumo = t.Resumo_pai ? String(t.Resumo_pai).toLowerCase() : ''
      const textoCompleto = `${nome} ${resumo}`
      
      return palavrasEnergia.some(palavra => textoCompleto.includes(palavra))
    })
    
    console.log(`⚡ Energização detectada: ${temEnergia ? 'SIM' : 'NÃO'}`)
    if (temEnergia) {
      console.log(`   🔍 Palavras encontradas no texto das tarefas`)
    }
    
    return temEnergia
  }

  // 🎯 SISTEMA HÍBRIDO: CRONOGRAMA + ETAPA GERENCIAL
  private static determinarStatus(temEnergizacao: boolean, avancaoFisico: number, temExecucao: boolean): string {
    console.log(`🎯 Determinando status híbrido: Avanço=${avancaoFisico}%, Energização=${temEnergizacao}, Execução=${temExecucao}`)
    
    // ✅ OBRA CONCLUÍDA
    if (avancaoFisico >= 100) {
      return 'Concluído'
    }
    
    // ❌ OBRA NÃO INICIADA
    if (avancaoFisico === 0) {
      return 'Não Iniciado'
    }
    
    // 📊 ANÁLISE DE CRONOGRAMA (baseado em benchmarks típicos)
    let statusCronograma = ''
    
    // Lógica baseada na evolução que estabelecemos
    if (temExecucao) {
      if (avancaoFisico >= 60) {
        statusCronograma = 'Adiantado'
      } else if (avancaoFisico >= 30) {
        statusCronograma = 'No Prazo'
      } else {
        statusCronograma = 'Atrasado'
      }
    } else {
      // Obras só com fiscalização têm critério diferente
      if (avancaoFisico >= 70) {
        statusCronograma = 'Adiantado'
      } else if (avancaoFisico >= 40) {
        statusCronograma = 'No Prazo'
      } else {
        statusCronograma = 'Atrasado'
      }
    }
    
    // 📋 DETERMINAÇÃO DA ETAPA GERENCIAL
    let etapaGerencial = ''
    
    // 📋 OBRAS SÓ COM FISCALIZAÇÃO
    if (!temExecucao) {
      if (avancaoFisico >= 80) {
        etapaGerencial = 'Aprovação Final'
      } else if (avancaoFisico >= 60) {
        etapaGerencial = 'Análise Avançada'
      } else if (avancaoFisico >= 30) {
        etapaGerencial = 'Projeto Executivo'
      } else {
        etapaGerencial = 'Procedimentos Preliminares'
      }
    }
    // ⚡ OBRAS COM ENERGIZAÇÃO (subestações, linhas)
    else if (temEnergizacao) {
      if (avancaoFisico >= 80) {
        etapaGerencial = 'Fase de Testes'
      } else if (avancaoFisico >= 60) {
        etapaGerencial = 'Comissionamento'
      } else if (avancaoFisico >= 40) {
        etapaGerencial = 'Execução em Andamento'
      } else if (avancaoFisico >= 20) {
        etapaGerencial = 'Projeto Executivo'
      } else {
        etapaGerencial = 'Procedimentos Preliminares'
      }
    }
    // 🏗️ OBRAS SEM ENERGIZAÇÃO (reformas, ampliações)
    else {
      if (avancaoFisico >= 75) {
        etapaGerencial = 'Fase de Testes'
      } else if (avancaoFisico >= 50) {
        etapaGerencial = 'Execução em Andamento'
      } else if (avancaoFisico >= 25) {
        etapaGerencial = 'Projeto Executivo'
      } else {
        etapaGerencial = 'Procedimentos Preliminares'
      }
    }
    
    // 🎯 COMBINAR CRONOGRAMA + ETAPA
    const statusFinal = `${statusCronograma} - ${etapaGerencial}`
    
    console.log(`   📊 Status Cronograma: ${statusCronograma}`)
    console.log(`   📋 Etapa Gerencial: ${etapaGerencial}`)
    console.log(`   🎯 Status Final: ${statusFinal}`)
    
    return statusFinal
  }

  // 🏗️ CRIAR DADOS FISCALIZAÇÃO
  private static criarDadosFiscalizacao(tarefasF: BaseObraData[]) {
    const total = tarefasF.length
    const concluidas = tarefasF.filter(t => Number(t.Porcentagem_Conclu_do) >= 100).length
    const marcos = tarefasF.filter(t => {
      if (!t.Marco) return false
      const marcoStr = String(t.Marco).toLowerCase()
      return marcoStr === 'sim' || marcoStr === '1' || marcoStr === 'true'
    }).length
    const marcosConcluidos = tarefasF.filter(t => {
      if (!t.Marco) return false
      const marcoStr = String(t.Marco).toLowerCase()
      const isMarco = marcoStr === 'sim' || marcoStr === '1' || marcoStr === 'true'
      return isMarco && Number(t.Porcentagem_Conclu_do) >= 100
    }).length
    
    return {
      totalTarefas: total,
      tarefasConcluidas: concluidas,
      progressoGeral: total > 0 ? Math.round((concluidas / total) * 100) : 0,
      totalMarcos: marcos,
      marcosConcluidos: marcosConcluidos
    }
  }

  // ⚡ CRIAR DADOS EXECUÇÃO
  private static criarDadosExecucao(tarefasE: BaseObraData[]) {
    const total = tarefasE.length
    const concluidas = tarefasE.filter(t => Number(t.Porcentagem_Conclu_do) >= 100).length
    const marcos = tarefasE.filter(t => {
      if (!t.Marco) return false
      const marcoStr = String(t.Marco).toLowerCase()
      return marcoStr === 'sim' || marcoStr === '1' || marcoStr === 'true'
    }).length
    const marcosConcluidos = tarefasE.filter(t => {
      if (!t.Marco) return false
      const marcoStr = String(t.Marco).toLowerCase()
      const isMarco = marcoStr === 'sim' || marcoStr === '1' || marcoStr === 'true'
      return isMarco && Number(t.Porcentagem_Conclu_do) >= 100
    }).length
    
    return {
      totalTarefas: total,
      tarefasConcluidas: concluidas,
      progressoGeral: total > 0 ? Math.round((concluidas / total) * 100) : 0,
      totalMarcos: marcos,
      marcosConcluidos: marcosConcluidos
    }
  }

  // ✅ CALCULAR MÉTRICAS GERAIS - INCLUIR obrasComExecucao
  private static calcularMetricasGerais(obras: ObraUnificada[]): MetricasGerais {
    const totalObras = obras.length
    const obrasConcluidas = obras.filter(o => o.progressoGeral >= 100).length
    const obrasEmAndamento = obras.filter(o => o.progressoGeral > 0 && o.progressoGeral < 100).length
    const obrasComExecucao = obras.filter(o => o.execucao.totalTarefas && o.execucao.totalTarefas > 0).length
    const progressoMedio = totalObras > 0 ? Math.round(obras.reduce((acc, o) => acc + o.progressoGeral, 0) / totalObras) : 0
    const atrasadas = obras.filter(o => o.status.toLowerCase().includes('atrasado')).length
    const prazo = totalObras - atrasadas
    const totalMarcosFisicos = obras.reduce((acc, o) => acc + (o.marcos?.total || 0), 0)
    const marcosFisicosConcluidos = obras.reduce((acc, o) => acc + (o.marcos?.concluidos || 0), 0)
    const mediaAvancaoFisico = totalObras > 0 ? Math.round(obras.reduce((acc, o) => acc + (o.avancaoFisico || 0), 0) / totalObras) : 0

    return {
      totalObras,
      obrasConcluidas,
      obrasEmAndamento,
      obrasComExecucao, // ✅ ADICIONADA
      progressoMedio,
      atrasadas,
      prazo,
      totalMarcosFisicos,
      marcosFisicosConcluidos,
      mediaAvancaoFisico,
      mediaaProgressoGeral: progressoMedio,
      mediaaAvancaoFisico: mediaAvancaoFisico
    }
  }

  // 📊 MÉTRICAS VAZIAS PARA CASO DE ERRO
  private static criarMetricasVazias(): MetricasGerais {
    return {
      totalObras: 0,
      obrasConcluidas: 0,
      obrasEmAndamento: 0,
      obrasComExecucao: 0, // ✅ ADICIONADA
      progressoMedio: 0,
      atrasadas: 0,
      prazo: 0,
      totalMarcosFisicos: 0,
      marcosFisicosConcluidos: 0,
      mediaAvancaoFisico: 0,
      mediaaProgressoGeral: 0,
      mediaaAvancaoFisico: 0
    }
  }
}