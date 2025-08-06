// src/utils/dataAdapter.ts - CORREÇÃO PROCESSAMENTO FINANCEIRO
import { DashboardData, BaseObraData, BaseInvestimentoData } from '@/types/obra'
import { DashboardUnificadoType, ObraUnificada, MetricasGerais } from '@/types/obra-unificada'

export class DataAdapter {
  
  static convertToUnificado(dashboardData: DashboardData): DashboardUnificadoType {
    console.log('🔄 === CONVERSÃO COM PROCESSAMENTO FINANCEIRO CORRIGIDO ===')
    console.log(`📊 Total de tarefas recebidas: ${dashboardData.todasTarefas.length}`)
    console.log(`💰 Investimentos disponíveis: ${dashboardData.investimentos?.length || 0}`)
    
    if (!dashboardData.todasTarefas || dashboardData.todasTarefas.length === 0) {
      console.log('⚠️ Nenhuma tarefa para processar')
      return {
        obras: [],
        metricas: this.criarMetricasVazias(),
        ultimaAtualizacao: new Date().toISOString()
      }
    }

    // 🔍 DEBUG CRÍTICO - VERIFICAR ORCAMENTO_R
    console.log('\n💰 === DIAGNÓSTICO ORCAMENTO_R ===')
    const tarefasComOrcamento = dashboardData.todasTarefas.filter(t => 
      t.Orcamento_R !== null && t.Orcamento_R !== undefined && t.Orcamento_R > 0
    )
    
    console.log(`💰 Tarefas com Orcamento_R válido: ${tarefasComOrcamento.length} de ${dashboardData.todasTarefas.length}`)
    
    if (tarefasComOrcamento.length > 0) {
      console.log('✅ EXEMPLOS DE ORCAMENTO_R VÁLIDOS:')
      tarefasComOrcamento.slice(0, 3).forEach((t, i) => {
        console.log(`   ${i + 1}. R$ ${t.Orcamento_R!.toLocaleString()} - ${t.Nome_da_Tarefa}`)
      })
      
      const valorTotal = tarefasComOrcamento.reduce((acc, t) => acc + (t.Orcamento_R || 0), 0)
      console.log(`💰 Valor total encontrado: R$ ${valorTotal.toLocaleString()}`)
    } else {
      console.log('❌ PROBLEMA CRÍTICO: Nenhuma tarefa tem Orcamento_R válido!')
      
      // Debug da primeira tarefa para ver a estrutura
      const primeiraTarefa = dashboardData.todasTarefas[0]
      console.log('🔍 Estrutura da primeira tarefa:')
      console.log(`   Nome_da_Tarefa: "${primeiraTarefa.Nome_da_Tarefa}"`)
      console.log(`   Orcamento_R: ${primeiraTarefa.Orcamento_R} (tipo: ${typeof primeiraTarefa.Orcamento_R})`)
      console.log(`   _aba: "${primeiraTarefa._aba}"`)
      
      // Verificar se há outras propriedades que possam conter orçamento
      Object.keys(primeiraTarefa).forEach(key => {
        const value = (primeiraTarefa as any)[key]
        if (typeof value === 'number' && value > 1000) {
          console.log(`   🔍 Possível valor financeiro em "${key}": ${value}`)
        }
      })
    }

    // AGRUPAR POR ABA
    const abasPorNome: Record<string, BaseObraData[]> = {}
    dashboardData.todasTarefas.forEach(tarefa => {
      const aba = tarefa._aba || 'Sem_Aba'
      if (!abasPorNome[aba]) {
        abasPorNome[aba] = []
      }
      abasPorNome[aba].push(tarefa)
    })
    
    // IDENTIFICAR PARES F+E
    const abas = Object.keys(abasPorNome).filter(nome => nome !== 'Planilha1')
    const abasF = abas.filter(aba => aba.endsWith('-CR-F'))
    
    console.log(`\n📊 Processamento de obras:`)
    console.log(`   Abas encontradas: ${abas.length}`)
    console.log(`   Abas F (Fiscalização): ${abasF.length}`)
    
    const obras: ObraUnificada[] = []
    
    abasF.forEach(abaF => {
      const nomeBase = abaF.slice(0, -5) // Remove "-CR-F"
      const abaE = `${nomeBase}-CR-E`
      const temExecucao = abas.includes(abaE)
      
      const tarefasF = abasPorNome[abaF] || []
      const tarefasE = temExecucao ? (abasPorNome[abaE] || []) : []
      
      console.log(`\n🏗️ Processando obra: ${nomeBase}`)
      console.log(`   Fiscalização: ${tarefasF.length} tarefas`)
      console.log(`   Execução: ${tarefasE.length} tarefas (${temExecucao ? 'SIM' : 'NÃO'})`)
      
      // CRIAR OBRA COM FOCO NO FINANCEIRO
      const obra = this.criarObraComFinanceiroCorrigido(
        nomeBase, 
        tarefasF, 
        tarefasE, 
        temExecucao,
        dashboardData.investimentos || []
      )
      obras.push(obra)
    })
    
    const metricas = this.calcularMetricasCompletas(obras)
    
    console.log(`\n✅ RESULTADO FINAL:`)
    console.log(`   Obras criadas: ${obras.length}`)
    console.log(`   Orçamento total do portfólio: R$ ${metricas.orcamentoTotalPortfolio.toLocaleString()}`)
    console.log(`   Valor realizado: R$ ${metricas.valorRealizadoPortfolio.toLocaleString()}`)
    
    return {
      obras,
      metricas,
      ultimaAtualizacao: new Date().toISOString()
    }
  }

  private static criarObraComFinanceiroCorrigido(
    nomeBase: string, 
    tarefasF: BaseObraData[], 
    tarefasE: BaseObraData[], 
    temExecucao: boolean,
    investimentos: BaseInvestimentoData[]
  ): ObraUnificada {
    
    // NOME DA OBRA
    const tarefaNivel1 = tarefasF.find(t => Number(t.N_vel) === 1)
    const nomeReal = tarefaNivel1?.Resumo_pai ? String(tarefaNivel1.Resumo_pai) : 'Obra sem nome'
    
    console.log(`\n💰 === PROCESSAMENTO FINANCEIRO: ${nomeReal} ===`)
    
    // CÓDIGO COM INDICADOR
    const indicador = temExecucao ? '[F+E]' : '[F]'
    const codigo = `${nomeBase} ${indicador}`
    
    // CÁLCULOS BÁSICOS
    const todasTarefas = [...tarefasF, ...tarefasE]
    const totalTarefas = todasTarefas.length
    const tarefasConcluidas = todasTarefas.filter(t => Number(t.Porcentagem_Conclu_do) >= 100).length
    
    // PROGRESSO GERAL
    const progressoGeral = totalTarefas > 0 ? 
      Math.round(todasTarefas.reduce((acc, t) => acc + (Number(t.Porcentagem_Conclu_do) || 0), 0) / totalTarefas) : 0
    
    // MARCOS FÍSICOS
    const marcos = todasTarefas.filter(t => {
      const marco = t.Marco
      if (!marco) return false
      const marcoStr = String(marco).toLowerCase()
      return marcoStr === 'sim' || marcoStr === '1' || marcoStr === 'true'
    })
    
    const marcosConcluidos = marcos.filter(m => Number(m.Porcentagem_Conclu_do) >= 100)
    const avancaoFisico = marcos.length > 0 ? 
      Math.round((marcosConcluidos.length / marcos.length) * 100) : progressoGeral
    
    // STATUS
    const status = this.determinarStatusInteligente(progressoGeral, avancaoFisico, temExecucao)
    
    // 💰 PROCESSAMENTO FINANCEIRO CRÍTICO
    console.log(`📊 Analisando ${totalTarefas} tarefas para orçamento...`)
    
    // Filtrar tarefas leaf (nível >= 3) para evitar duplicidade  
    const tarefasLeaf = todasTarefas.filter(t => Number(t.N_vel) >= 3)
    console.log(`📊 Tarefas leaf (nível >= 3): ${tarefasLeaf.length}`)
    
    let orcamentoTotal = 0
    let valorRealizado = 0
    let tarefasComOrcamentoValidas = 0
    
    console.log(`💰 === PROCESSAMENTO DETALHADO DO ORÇAMENTO ===`)
    
    tarefasLeaf.forEach((tarefa, index) => {
      const orcamento = tarefa.Orcamento_R
      const percentual = Number(tarefa.Porcentagem_Conclu_do) || 0
      
      // Debug das primeiras 5 tarefas
      if (index < 5) {
        console.log(`\nTarefa ${index + 1}:`)
        console.log(`   Nome: ${tarefa.Nome_da_Tarefa}`)
        console.log(`   Nível: ${tarefa.N_vel}`)
        console.log(`   Orcamento_R: ${orcamento} (tipo: ${typeof orcamento})`)
        console.log(`   % Concluído: ${percentual}%`)
      }
      
      // Verificação rigorosa do orçamento
      if (orcamento !== null && orcamento !== undefined && typeof orcamento === 'number' && orcamento > 0) {
        orcamentoTotal += orcamento
        valorRealizado += (orcamento * percentual / 100)
        tarefasComOrcamentoValidas++
        
        if (index < 3) {
          console.log(`   ✅ ORÇAMENTO VÁLIDO: R$ ${orcamento.toLocaleString()}`)
          console.log(`   ✅ VALOR REALIZADO: R$ ${(orcamento * percentual / 100).toLocaleString()}`)
        }
      } else if (index < 5) {
        console.log(`   ❌ Orçamento inválido ou zero`)
      }
    })
    
    console.log(`\n💰 === RESULTADO FINANCEIRO DA OBRA ===`)
    console.log(`   Tarefas com orçamento válido: ${tarefasComOrcamentoValidas}`)
    console.log(`   Orçamento total: R$ ${orcamentoTotal.toLocaleString()}`)
    console.log(`   Valor realizado: R$ ${valorRealizado.toLocaleString()}`)
    
    // Progresso financeiro
    const progressoFinanceiro = orcamentoTotal > 0 ? 
      Math.round((valorRealizado / orcamentoTotal) * 100) : 0
    
    console.log(`   Progresso financeiro: ${progressoFinanceiro}%`)
    
    // 🔍 BUSCAR ORÇAMENTO APROVADO
    const orcamentoAprovado = this.buscarOrcamentoAprovado(nomeReal, investimentos)
    
    // Calcular eficiência
    let eficienciaExecucao = 100
    let statusEficiencia: 'Eficiente' | 'Atenção' | 'Crítico' = 'Eficiente'
    const corelacionEncontrada = orcamentoAprovado > 0
    
    if (corelacionEncontrada && avancaoFisico > 0 && valorRealizado > 0) {
      const valorPrevistoPorProgresso = orcamentoAprovado * (avancaoFisico / 100)
      if (valorPrevistoPorProgresso > 0) {
        eficienciaExecucao = Math.round((valorRealizado / valorPrevistoPorProgresso) * 100)
        
        if (eficienciaExecucao > 150) {
          statusEficiencia = 'Crítico'
        } else if (eficienciaExecucao > 120) {
          statusEficiencia = 'Atenção'
        }
      }
    }
    
    console.log(`   Orçamento aprovado: R$ ${orcamentoAprovado.toLocaleString()}`)
    console.log(`   Eficiência: ${eficienciaExecucao}% (${statusEficiencia})`)
    console.log(`   Correlação encontrada: ${corelacionEncontrada ? 'SIM' : 'NÃO'}`)
    
    // ESTRUTURA OBRA UNIFICADA
    const obra: ObraUnificada = {
      codigo,
      nome: nomeReal,
      status,
      progressoGeral,
      avancooFisico: avancaoFisico,
      avancaoFisico: avancaoFisico,
      tarefasConcluidas,
      totalTarefas,
      marcos: {
        total: marcos.length,
        concluidos: marcosConcluidos.length
      },
      metricas: {
        progressoGeral,
        avancooFisico: avancaoFisico,
        totalTarefas,
        tarefasConcluidas,
        totalMarcos: marcos.length,
        marcosConcluidos: marcosConcluidos.length,
        orcamentoTotal,
        valorRealizado,
        orcamentoAprovado,
        eficienciaExecucao,
        progressoFinanceiro
      },
      temEnergizacao: this.detectarEnergizacao(tarefasF, tarefasE),
      dadosFinanceiros: {
        orcamentoTotal,
        valorRealizado,
        orcamentoAprovado,
        eficienciaExecucao,
        progressoFinanceiro,
        statusEficiencia,
        corelacionEncontrada
      },
      fiscalizacao: {
        tarefas: tarefasF as any[],
        progressoFornecimentos: tarefasF.length > 0 ? 
          Math.round((tarefasF.filter(t => Number(t.Porcentagem_Conclu_do) >= 100).length / tarefasF.length) * 100) : 0,
        tarefasConcluidas: tarefasF.filter(t => Number(t.Porcentagem_Conclu_do) >= 100).length,
        totalTarefas: tarefasF.length
      },
      execucao: {
        tarefas: tarefasE as any[],
        progressoExecucao: tarefasE.length > 0 ? 
          Math.round((tarefasE.filter(t => Number(t.Porcentagem_Conclu_do) >= 100).length / tarefasE.length) * 100) : 0,
        tarefasConcluidas: tarefasE.filter(t => Number(t.Porcentagem_Conclu_do) >= 100).length,
        totalTarefas: tarefasE.length
      }
    }
    
    return obra
  }

  // 🔍 BUSCAR ORÇAMENTO APROVADO COM CORRELAÇÃO MELHORADA
  private static buscarOrcamentoAprovado(nomeObra: string, investimentos: BaseInvestimentoData[]): number {
    console.log(`🔍 Buscando correlação para: "${nomeObra}"`)
    
    if (investimentos.length === 0) {
      console.log(`   ⚠️ Sem dados de BaseInvestimento2025`)
      return 0
    }
    
    // Extrair código do nome da obra: "DTE31-020 - RETROFIT 87L SEBV"
    const match = nomeObra.match(/^([A-Z]+)(\d+)-(\d+)/)
    
    if (!match) {
      console.log(`   ⚠️ Padrão de código não encontrado em: "${nomeObra}"`)
      
      // Tentativa de busca por palavra-chave
      const palavrasChave = ['SESC', 'SEPV', 'CEPV', 'SERN', 'SECE', 'R87L']
      for (const palavra of palavrasChave) {
        if (nomeObra.toUpperCase().includes(palavra)) {
          const investimento = investimentos.find(inv => 
            inv.Descricao.toUpperCase().includes(palavra)
          )
          if (investimento) {
            const valor = Number(investimento.ValorAprovado) || 0
            console.log(`   ✅ Encontrado por palavra-chave "${palavra}": R$ ${valor.toLocaleString()}`)
            return valor
          }
        }
      }
      
      return 0
    }
    
    const depto = match[1]      // "DTE"
    const projeto = match[2]    // "31" 
    const programa = match[3]   // "020"
    
    console.log(`   Código extraído: ${depto}${projeto}-${programa}`)
    
    // Múltiplas tentativas de correlação
    const tentativas = [
      {
        idProjeto: `${depto}-${projeto}`,
        programaOrcamentario: `R200_${depto}${programa.padStart(3, '0')}`,
        descricao: 'Padrão completo'
      },
      {
        idProjeto: `${depto}-${projeto}`,
        programaOrcamentario: `R200_${depto}${programa}`,
        descricao: 'Sem padding zero'
      },
      {
        idProjeto: `${depto}${projeto}`,
        programaOrcamentario: `R200_${depto}${programa}`,
        descricao: 'ID sem hífen'
      }
    ]
    
    for (const tentativa of tentativas) {
      console.log(`   🔍 Tentando: ID="${tentativa.idProjeto}" | Programa="${tentativa.programaOrcamentario}"`)
      
      const investimento = investimentos.find(inv => {
        const matchId = inv.ID_Projeto === tentativa.idProjeto
        const matchPrograma = inv.ProgramaOrcamentario === tentativa.programaOrcamentario
        return matchId || matchPrograma
      })
      
      if (investimento) {
        const valor = Number(investimento.ValorAprovado) || 0
        console.log(`   ✅ CORRELAÇÃO ENCONTRADA: R$ ${valor.toLocaleString()}`)
        console.log(`   ✅ Via: ${tentativa.descricao}`)
        return valor
      }
    }
    
    console.log(`   ❌ Nenhuma correlação encontrada`)
    return 0
  }

  // STATUS MAIS INTELIGENTE
  private static determinarStatusInteligente(progressoGeral: number, avancaoFisico: number, temExecucao: boolean): string {
    if (progressoGeral >= 100) return 'Concluído'
    
    if (progressoGeral >= 80) {
      return temExecucao ? 'Adiantado - Fase Final' : 'Adiantado - Aprovação Final'
    } else if (progressoGeral >= 60) {
      return temExecucao ? 'No Prazo - Execução' : 'No Prazo - Fiscalização Avançada'
    } else if (progressoGeral >= 30) {
      return 'No Prazo - Desenvolvimento'
    } else {
      return 'Atrasado - Procedimentos Preliminares'
    }
  }

  // DETECTAR ENERGIZAÇÃO
  private static detectarEnergizacao(tarefasF: BaseObraData[], tarefasE: BaseObraData[]): boolean {
    const todasTarefas = [...tarefasF, ...tarefasE]
    const palavrasChave = [
      'energização', 'energizacao', 'comissionamento', 'subestação', 'subestacao',
      'transformador', 'disjuntor', 'montagem', 'equipamento', 'linha de transmissao'
    ]
    
    return todasTarefas.some(t => {
      const nome = t.Nome_da_Tarefa ? String(t.Nome_da_Tarefa).toLowerCase() : ''
      const resumo = t.Resumo_pai ? String(t.Resumo_pai).toLowerCase() : ''
      const texto = `${nome} ${resumo}`
      
      return palavrasChave.some(palavra => texto.includes(palavra))
    })
  }

  private static calcularMetricasCompletas(obras: ObraUnificada[]): MetricasGerais {
    const totalObras = obras.length
    const obrasConcluidas = obras.filter(o => o.progressoGeral >= 100).length
    const obrasEmAndamento = obras.filter(o => o.progressoGeral > 0 && o.progressoGeral < 100).length
    const obrasComExecucao = obras.filter(o => o.execucao && o.execucao.totalTarefas && o.execucao.totalTarefas > 0).length
    
    const progressoMedio = totalObras > 0 ? 
      Math.round(obras.reduce((acc, o) => acc + o.progressoGeral, 0) / totalObras) : 0
    
    const mediaAvancaoFisico = totalObras > 0 ? 
      Math.round(obras.reduce((acc, o) => acc + (o.avancaoFisico || 0), 0) / totalObras) : 0
    
    const atrasadas = obras.filter(o => o.status.toLowerCase().includes('atrasado')).length
    const prazo = totalObras - atrasadas
    
    const totalMarcosFisicos = obras.reduce((acc, o) => acc + o.marcos.total, 0)
    const marcosFisicosConcluidos = obras.reduce((acc, o) => acc + o.marcos.concluidos, 0)
    
    // MÉTRICAS FINANCEIRAS DO PORTFÓLIO
    const orcamentoTotalPortfolio = obras.reduce((acc, o) => acc + (o.dadosFinanceiros?.orcamentoTotal || 0), 0)
    const valorRealizadoPortfolio = obras.reduce((acc, o) => acc + (o.dadosFinanceiros?.valorRealizado || 0), 0)
    const orcamentoAprovadoPortfolio = obras.reduce((acc, o) => acc + (o.dadosFinanceiros?.orcamentoAprovado || 0), 0)
    
    const eficienciaMediaPortfolio = totalObras > 0 ? 
      Math.round(obras.reduce((acc, o) => acc + (o.dadosFinanceiros?.eficienciaExecucao || 100), 0) / totalObras) : 100
    
    const progressoFinanceiroMedio = totalObras > 0 ? 
      Math.round(obras.reduce((acc, o) => acc + (o.dadosFinanceiros?.progressoFinanceiro || 0), 0) / totalObras) : 0
    
    console.log('\n💰 === MÉTRICAS FINANCEIRAS DO PORTFÓLIO ===')
    console.log(`   Orçamento total: R$ ${orcamentoTotalPortfolio.toLocaleString()}`)
    console.log(`   Valor realizado: R$ ${valorRealizadoPortfolio.toLocaleString()}`)
    console.log(`   Aprovado 2025: R$ ${orcamentoAprovadoPortfolio.toLocaleString()}`)
    console.log(`   Eficiência média: ${eficienciaMediaPortfolio}%`)
    console.log(`   Progresso financeiro médio: ${progressoFinanceiroMedio}%`)
    
    return {
      totalObras,
      obrasConcluidas,
      obrasEmAndamento,
      progressoMedio,
      atrasadas,
      prazo,
      totalMarcosFisicos,
      marcosFisicosConcluidos,
      mediaAvancaoFisico,
      obrasComExecucao,
      orcamentoTotalPortfolio,
      valorRealizadoPortfolio,
      orcamentoAprovadoPortfolio,
      eficienciaMediaPortfolio,
      progressoFinanceiroMedio,
      mediaaProgressoGeral: progressoMedio,
      mediaaAvancaoFisico: mediaAvancaoFisico
    }
  }

  private static criarMetricasVazias(): MetricasGerais {
    return {
      totalObras: 0,
      obrasConcluidas: 0,
      obrasEmAndamento: 0,
      progressoMedio: 0,
      atrasadas: 0,
      prazo: 0,
      totalMarcosFisicos: 0,
      marcosFisicosConcluidos: 0,
      mediaAvancaoFisico: 0,
      obrasComExecucao: 0,
      orcamentoTotalPortfolio: 0,
      valorRealizadoPortfolio: 0,
      orcamentoAprovadoPortfolio: 0,
      eficienciaMediaPortfolio: 100,
      progressoFinanceiroMedio: 0,
      mediaaProgressoGeral: 0,
      mediaaAvancaoFisico: 0
    }
  }
}