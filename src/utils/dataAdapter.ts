// src/utils/dataAdapter.ts - SISTEMA INTELIGENTE SOBRE BASE ESTÁVEL
import { DashboardData, BaseObraData, BaseInvestimentoData } from '@/types/obra'
import { DashboardUnificadoType, ObraUnificada, MetricasGerais } from '@/types/obra-unificada'

export class DataAdapter {
  static convertToUnificado(dashboardData: DashboardData): DashboardUnificadoType {
    console.log('🔄 === CONVERSÃO COM SISTEMA CRONOGRAMA INTELIGENTE ESTÁVEL ===')
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

    // 🔍 DEBUG ORÇAMENTO
    const tarefasComOrcamento = dashboardData.todasTarefas.filter(t => 
      t.Orcamento_R !== null && t.Orcamento_R !== undefined && t.Orcamento_R > 0
    )
    console.log(`💰 Tarefas com Orcamento_R válido: ${tarefasComOrcamento.length} de ${dashboardData.todasTarefas.length}`)

    // ✅ AGRUPAR POR ABA PARA IDENTIFICAR PARES F+E
    const abasPorNome: Record<string, BaseObraData[]> = {}
    dashboardData.todasTarefas.forEach(tarefa => {
      const aba = tarefa._aba || 'Sem_Aba'
      if (!abasPorNome[aba]) {
        abasPorNome[aba] = []
      }
      abasPorNome[aba].push(tarefa)
    })
    
    // ✅ IDENTIFICAR PARES F+E (LÓGICA RESTAURADA)
    const abas = Object.keys(abasPorNome).filter(nome => nome !== 'Planilha1')
    const abasF = abas.filter(aba => aba.endsWith('-CR-F'))
    
    console.log(`\n📊 === PROCESSAMENTO DE OBRAS F+E ===`)
    console.log(`   Abas encontradas: ${abas.length}`)
    console.log(`   Abas F (Fiscalização): ${abasF.length}`)
    console.log(`   Sistema: Cronograma Inteligente`)
    
    const obras: ObraUnificada[] = []
    const investimentos = dashboardData.investimentos || []
    
    // ✅ PROCESSAR CADA PAR F+E
    abasF.forEach(abaF => {
      const nomeBase = abaF.slice(0, -5) // Remove "-CR-F"
      const abaE = `${nomeBase}-CR-E`
      const temExecucao = abas.includes(abaE)
      
      const tarefasF = abasPorNome[abaF] || []
      const tarefasE = temExecucao ? (abasPorNome[abaE] || []) : []
      
      console.log(`\n🏗️ === PROCESSANDO OBRA: ${nomeBase} ===`)
      console.log(`   Fiscalização (${abaF}): ${tarefasF.length} tarefas`)
      console.log(`   Execução (${abaE}): ${tarefasE.length} tarefas (${temExecucao ? 'SIM' : 'NÃO'})`)
      
      // ✅ CRIAR OBRA COM SISTEMA CRONOGRAMA INTELIGENTE
      const obra = this.criarObraComCronogramaInteligente(
        nomeBase, 
        tarefasF, 
        tarefasE, 
        temExecucao,
        investimentos
      )
      obras.push(obra)
    })
    
    const metricas = this.calcularMetricasCompletas(obras)
    
    console.log(`\n✅ === RESULTADO FINAL ===`)
    console.log(`   Obras F+E criadas: ${obras.length}`)
    console.log(`   Orçamento total do portfólio: R$ ${metricas.orcamentoTotalPortfolio.toLocaleString()}`)
    console.log(`   Valor realizado: R$ ${metricas.valorRealizadoPortfolio.toLocaleString()}`)
    
    return {
      obras,
      metricas,
      ultimaAtualizacao: new Date().toISOString()
    }
  }

  // ✅ CRIAR OBRA COM CRONOGRAMA INTELIGENTE (MANTENDO BASE ESTÁVEL)
  private static criarObraComCronogramaInteligente(
    nomeBase: string, 
    tarefasF: BaseObraData[], 
    tarefasE: BaseObraData[], 
    temExecucao: boolean,
    investimentos: BaseInvestimentoData[]
  ): ObraUnificada {
    
    // ✅ EXTRAIR NOME REAL DA OBRA
    const nomeReal = this.extrairNomeObraCorreto(tarefasF, tarefasE)
    
    console.log(`\n🧠 === CRONOGRAMA INTELIGENTE: ${nomeReal} ===`)
    
    // 🧠 DETERMINAR STATUS INTELIGENTE
    const statusInteligente = this.determinarStatusInteligente(tarefasF, tarefasE, temExecucao)
    console.log(`🎯 Status inteligente: ${statusInteligente}`)
    
    // ✅ CÓDIGO COM INDICADOR F+E
    const indicador = temExecucao ? '[F+E]' : '[F]'
    const codigo = `${nomeBase} ${indicador}`
    
    // ✅ COMBINAR TODAS AS TAREFAS
    const todasTarefas = [...tarefasF, ...tarefasE]
    const totalTarefas = todasTarefas.length
    const tarefasConcluidas = todasTarefas.filter(t => Number(t.Porcentagem_Conclu_do) >= 100).length
    
    // ✅ CALCULAR PROGRESSO GERAL
    const progressoGeral = totalTarefas > 0 ? 
      Math.round(todasTarefas.reduce((acc, t) => acc + (Number(t.Porcentagem_Conclu_do) || 0), 0) / totalTarefas) : 0
    
    // ✅ CALCULAR AVANÇO FÍSICO (MARCOS)
    const marcos = todasTarefas.filter(t => {
      const marco = t.Marco
      if (!marco) return false
      const marcoStr = String(marco).toLowerCase()
      return marcoStr === 'sim' || marcoStr === '1' || marcoStr === 'true'
    })
    
    const marcosConcluidos = marcos.filter(m => Number(m.Porcentagem_Conclu_do) >= 100)
    const avancaoFisicoCalculado = marcos.length > 0 ? 
      Math.round((marcosConcluidos.length / marcos.length) * 100) : progressoGeral
    
    // 💰 PROCESSAMENTO FINANCEIRO
    const orcamentoTarefas = this.calcularOrcamentoTarefas(todasTarefas)
    const orcamentoAprovado = this.buscarOrcamentoAprovado(nomeReal, investimentos)
    const orcamentoFinal = orcamentoAprovado > 0 ? orcamentoAprovado : orcamentoTarefas
    const valorRealizado = this.calcularValorRealizado(todasTarefas, orcamentoFinal)
    
    // ✅ STATUS EFICIÊNCIA PARA CURVATENDENCIA
    const eficienciaExecucao = orcamentoFinal > 0 ? Math.round((valorRealizado / orcamentoFinal) * 100) : 100
    const progressoFinanceiro = orcamentoFinal > 0 ? Math.round((valorRealizado / orcamentoFinal) * 100) : 0
    const statusEficiencia: 'Eficiente' | 'Atenção' | 'Crítico' = 
      eficienciaExecucao >= 100 ? 'Eficiente' :
      eficienciaExecucao >= 80 ? 'Atenção' : 'Crítico'
    
    console.log(`💰 Orçamento final: R$ ${orcamentoFinal.toLocaleString()}`)
    console.log(`💰 Valor realizado: R$ ${valorRealizado.toLocaleString()}`)
    
    // ✅ CONVERTER TAREFAS PARA TaskData
    const tarefasFiscalizacaoFormatadas = this.converterParaTaskData(tarefasF)
    const tarefasExecucaoFormatadas = this.converterParaTaskData(tarefasE)
    
    // ✅ ESTRUTURA OBRA UNIFICADA COMPLETA
    const obra: ObraUnificada = {
      codigo,
      nome: nomeReal,
      status: statusInteligente, // ✅ STATUS INTELIGENTE
      progressoGeral,
      avancooFisico: avancaoFisicoCalculado,
      avancaoFisico: avancaoFisicoCalculado,
      tarefasConcluidas,
      totalTarefas,
      marcos: {
        total: marcos.length,
        concluidos: marcosConcluidos.length
      },
      metricas: {
        progressoGeral,
        avancooFisico: avancaoFisicoCalculado,
        totalTarefas,
        tarefasConcluidas,
        totalMarcos: marcos.length,
        marcosConcluidos: marcosConcluidos.length,
        orcamentoTotal: orcamentoFinal,
        valorRealizado: valorRealizado,
        orcamentoAprovado: orcamentoFinal,
        eficienciaExecucao: eficienciaExecucao,
        progressoFinanceiro: progressoFinanceiro
      },
      temEnergizacao: this.detectarEnergizacao(tarefasF, tarefasE),
      dadosFinanceiros: {
        orcamentoTotal: orcamentoFinal,
        valorRealizado: valorRealizado,
        orcamentoAprovado: orcamentoFinal,
        eficienciaExecucao: eficienciaExecucao, // ✅ PARA CURVATENDENCIA
        progressoFinanceiro: progressoFinanceiro, // ✅ PARA CURVATENDENCIA
        statusEficiencia: statusEficiencia, // ✅ PARA CURVATENDENCIA
        corelacionEncontrada: orcamentoAprovado > 0
      },
      fiscalizacao: {
        tarefas: tarefasFiscalizacaoFormatadas,
        progressoFornecimentos: this.calcularProgressoMedio(tarefasF),
        progressoMedio: this.calcularProgressoMedio(tarefasF), // ✅ PARA MODAL
        tarefasConcluidas: tarefasF.filter(t => Number(t.Porcentagem_Conclu_do) >= 100).length,
        totalTarefas: tarefasF.length
      },
      execucao: {
        tarefas: tarefasExecucaoFormatadas,
        progressoExecucao: this.calcularProgressoMedio(tarefasE),
        progressoMedio: this.calcularProgressoMedio(tarefasE), // ✅ PARA MODAL
        tarefasConcluidas: tarefasE.filter(t => Number(t.Porcentagem_Conclu_do) >= 100).length,
        totalTarefas: tarefasE.length
      }
    }
    
    return obra
  }

  // 🧠 DETERMINAR STATUS INTELIGENTE (SISTEMA COMPLETO)
  private static determinarStatusInteligente(tarefasF: BaseObraData[], tarefasE: BaseObraData[], temExecucao: boolean): string {
    console.log(`\n🔍 === DETERMINANDO STATUS INTELIGENTE ===`)
    
    // ETAPA 1: DETERMINAR ETAPA ATUAL
    const etapaAtual = this.determinarEtapaAtual(tarefasF, tarefasE, temExecucao)
    console.log(`📍 Etapa: ${etapaAtual}`)
    
    // ETAPA 2: DETERMINAR PROGRESSO VS LINHA BASE
    const progressoVsBase = this.determinarProgressoVsLinhaBase(tarefasF, tarefasE)
    console.log(`⏱️ Progresso: ${progressoVsBase}`)
    
    // RESULTADO FINAL
    const statusFinal = `${etapaAtual} - ${progressoVsBase}`
    return statusFinal
  }

  // 📍 DETERMINAR ETAPA ATUAL DA OBRA
  private static determinarEtapaAtual(_tarefasF: BaseObraData[], tarefasE: BaseObraData[], temExecucao: boolean): string {
    // Se não tem execução, só pode estar em Processos Iniciais
    if (!temExecucao || tarefasE.length === 0) {
      return 'Processos Iniciais'
    }
    
    // ✅ FILTRAR TAREFAS LEAF (nível mais detalhado)
    const tarefasLeafE = this.filtrarTarefasLeaf(tarefasE)
    
    // ✅ CATEGORIAS EM ORDEM HIERÁRQUICA (mais avançada primeiro)
    const categorias = [
      { nome: 'SPCS', palavras: ['spcs', 'elétrica', 'comissionamento', 'tac', 'energização'] },
      { nome: 'Montagens Eletromecânicas', palavras: ['montagem', 'eletromecânica', 'equipamento', 'transformador'] },
      { nome: 'Obras Civis', palavras: ['obra', 'civil', 'construção', 'fundação', 'concreto'] },
      { nome: 'Projetos Executivos', palavras: ['projeto', 'executivo', 'básico', 'elaboração'] }
    ]
    
    // Buscar a etapa mais avançada com pelo menos uma tarefa 100%
    for (const categoria of categorias) {
      const tarefas100 = tarefasLeafE.filter(t => {
        const nome = String(t.Nome_da_Tarefa || '').toLowerCase()
        const resumo = String(t.Resumo_pai || '').toLowerCase()
        const texto = `${nome} ${resumo}`
        
        const temPalavra = categoria.palavras.some(palavra => texto.includes(palavra))
        const esta100 = Number(t.Porcentagem_Conclu_do) >= 100
        
        return temPalavra && esta100
      })
      
      if (tarefas100.length > 0) {
        console.log(`   ✅ ${categoria.nome}: ${tarefas100.length} tarefas 100%`)
        return categoria.nome
      }
    }
    
    return 'Processos Iniciais'
  }

  // 📊 FILTRAR TAREFAS LEAF (mais detalhadas)
  private static filtrarTarefasLeaf(tarefas: BaseObraData[]): BaseObraData[] {
    if (tarefas.length === 0) return []
    
    const nivelMaximo = Math.max(...tarefas.map(t => Number(t.N_vel) || 0))
    // Considerar LEAF: níveis mais altos (mais detalhados)
    return tarefas.filter(t => Number(t.N_vel) >= nivelMaximo - 1)
  }

  // ⏱️ DETERMINAR PROGRESSO VS LINHA BASE
  private static determinarProgressoVsLinhaBase(tarefasF: BaseObraData[], tarefasE: BaseObraData[]): string {
    const todasTarefas = [...tarefasF, ...tarefasE]
    
    // 🎯 PRIORIDADE 1: BUSCAR ENERGIZAÇÃO
    const tarefaEnergizacao = todasTarefas.find(t => {
      const nome = String(t.Nome_da_Tarefa || '').toLowerCase()
      return nome.includes('energização') || nome.includes('energizacao')
    })
    
    if (tarefaEnergizacao) {
      console.log(`   🎯 Energização: "${tarefaEnergizacao.Nome_da_Tarefa}"`)
      return this.analisarProgressoTarefa(tarefaEnergizacao)
    }
    
    // 🎯 PRIORIDADE 2: MARCOS CRÍTICOS
    const marcosCriticos = todasTarefas
      .filter(t => t.Marco === 'SIM')
      .sort((a, b) => Number(b.Porcentagem_Conclu_do) - Number(a.Porcentagem_Conclu_do))
    
    if (marcosCriticos.length > 0) {
      console.log(`   🎯 Marco crítico: "${marcosCriticos[0].Nome_da_Tarefa}"`)
      return this.analisarProgressoTarefa(marcosCriticos[0])
    }
    
    // FALLBACK: No Prazo
    return 'No Prazo'
  }

  // 📅 ANALISAR PROGRESSO DE UMA TAREFA
  private static analisarProgressoTarefa(tarefa: BaseObraData): string {
    const dataTermino = this.converterParaData(tarefa.Data_T_rmino)
    const linhaBaseTermino = this.converterParaData(tarefa.LinhaBase_T_rmino)
    
    if (!dataTermino || !linhaBaseTermino) {
      return 'No Prazo'
    }
    
    const diferencaDias = Math.round((dataTermino.getTime() - linhaBaseTermino.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diferencaDias > 5) {
      return 'Atrasado'
    } else if (diferencaDias < -5) {
      return 'Adiantado'
    } else {
      return 'No Prazo'
    }
  }

  // 📅 CONVERTER PARA DATA
  private static converterParaData(valor: any): Date | null {
    if (!valor) return null
    
    if (typeof valor === 'number') {
      // Excel serial date
      const excelEpoch = new Date(1900, 0, 1)
      return new Date(excelEpoch.getTime() + (valor - 1) * 24 * 60 * 60 * 1000)
    }
    
    if (typeof valor === 'string') {
      const date = new Date(valor)
      return isNaN(date.getTime()) ? null : date
    }
    
    if (valor instanceof Date) {
      return valor
    }
    
    return null
  }

  // ✅ EXTRAIR NOME CORRETO DA OBRA
  private static extrairNomeObraCorreto(tarefasF: BaseObraData[], tarefasE: BaseObraData[]): string {
    const todasTarefas = [...tarefasF, ...tarefasE]
    
    const tarefaNivel1 = todasTarefas.find(t => Number(t.N_vel) === 1)
    if (tarefaNivel1?.Resumo_pai) {
      return String(tarefaNivel1.Resumo_pai)
    }
    
    if (tarefaNivel1?.Nome_da_Tarefa) {
      return String(tarefaNivel1.Nome_da_Tarefa)
    }
    
    if (tarefasF.length > 0 && tarefasF[0].Nome_da_Tarefa) {
      return String(tarefasF[0].Nome_da_Tarefa)
    }
    
    return 'Obra sem nome'
  }

  // ✅ BUSCAR ORÇAMENTO APROVADO
  private static buscarOrcamentoAprovado(nomeObra: string, investimentos: BaseInvestimentoData[]): number {
    if (investimentos.length === 0) return 0
    
    const match = nomeObra.match(/^([A-Z]+)(\d+)-(\d+)/)
    
    if (!match) {
      const palavrasChave = ['SESC', 'SEPV', 'CEPV', 'SERN', 'SECE', 'R87L']
      for (const palavra of palavrasChave) {
        if (nomeObra.toUpperCase().includes(palavra)) {
          const investimento = investimentos.find(inv => 
            inv.Descricao.toUpperCase().includes(palavra)
          )
          if (investimento) {
            return Number(investimento.ValorAprovado) || 0
          }
        }
      }
      return 0
    }
    
    const depto = match[1]
    const projeto = match[2]
    
    const tentativas = [
      `${depto}-${projeto}`,
      `${depto}${projeto}`,
      `${depto}-${projeto}-SESC`
    ]
    
    for (const tentativa of tentativas) {
      const investimento = investimentos.find(inv => 
        inv.ID_Projeto === tentativa ||
        inv.ProgramaOrcamentario.includes(tentativa)
      )
      
      if (investimento) {
        return Number(investimento.ValorAprovado) || 0
      }
    }
    
    return 0
  }

  // ✅ CONVERTER BaseObraData PARA TaskData
  private static converterParaTaskData(tarefas: BaseObraData[]) {
    return tarefas.map(tarefa => ({
      'EDT': tarefa.EDT,
      'Nome da Tarefa': tarefa.Nome_da_Tarefa,
      'Nível': tarefa.N_vel,
      'Resumo (pai)': tarefa.Resumo_pai || '',
      'Data Início': tarefa.Data_In_cio,
      'Data Término': tarefa.Data_T_rmino,
      '% Concluído': tarefa.Porcentagem_Conclu_do,
      'LinhaBase Início': tarefa.LinhaBase_In_cio || '',
      'LinhaBase Término': tarefa.LinhaBase_T_rmino || '',
      'Predecessoras': tarefa.Predecessoras,
      'Sucessoras': tarefa.Sucessoras,
      'Marco': tarefa.Marco,
      'Anotações': tarefa.Anota_es,
      'Nomes dos Recursos': tarefa.Nomes_dos_Recursos,
      'Coordenada': tarefa.Coordenada,
      'Orçamento (R$)': tarefa.Orcamento_R,
      '_aba': tarefa._aba
    }))
  }
  
  private static calcularOrcamentoTarefas(tarefas: BaseObraData[]): number {
    return tarefas
      .filter(t => t.Orcamento_R && t.Orcamento_R > 0)
      .reduce((acc, t) => acc + (t.Orcamento_R || 0), 0)
  }
  
  private static calcularValorRealizado(tarefas: BaseObraData[], orcamentoTotal: number): number {
    if (orcamentoTotal <= 0) return 0
    
    const tarefasComOrcamento = tarefas.filter(t => t.Orcamento_R && t.Orcamento_R > 0)
    
    if (tarefasComOrcamento.length > 0) {
      return Math.round(tarefasComOrcamento.reduce((acc, t) => {
        return acc + ((t.Orcamento_R || 0) * (Number(t.Porcentagem_Conclu_do) / 100))
      }, 0))
    }
    
    const progressoMedio = this.calcularProgressoMedio(tarefas)
    return Math.round((orcamentoTotal * progressoMedio) / 100)
  }
  
  private static calcularProgressoMedio(tarefas: BaseObraData[]): number {
    if (tarefas.length === 0) return 0
    
    const soma = tarefas.reduce((acc, t) => acc + (Number(t.Porcentagem_Conclu_do) || 0), 0)
    return Math.round(soma / tarefas.length)
  }
  
  private static detectarEnergizacao(tarefasF: BaseObraData[], tarefasE: BaseObraData[]): boolean {
    const todasTarefas = [...tarefasF, ...tarefasE]
    const palavrasChave = [
      'energização', 'energizacao', 'comissionamento', 'subestação', 'subestacao',
      'transformador', 'disjuntor', 'montagem', 'equipamento'
    ]
    
    return todasTarefas.some(t => {
      const nome = String(t.Nome_da_Tarefa || '').toLowerCase()
      const resumo = String(t.Resumo_pai || '').toLowerCase()
      const texto = `${nome} ${resumo}`
      
      return palavrasChave.some(palavra => texto.includes(palavra))
    })
  }
  
  private static calcularMetricasCompletas(obras: ObraUnificada[]): MetricasGerais {
    const totalObras = obras.length
    const obrasConcluidas = obras.filter(o => o.progressoGeral >= 100).length
    const obrasEmAndamento = obras.filter(o => o.progressoGeral > 0 && o.progressoGeral < 100).length
    
    const progressoMedio = totalObras > 0 ? 
      Math.round(obras.reduce((acc, o) => acc + o.progressoGeral, 0) / totalObras) : 0
    
    const mediaAvancaoFisico = totalObras > 0 ?
      Math.round(obras.reduce((acc, o) => acc + o.avancooFisico, 0) / totalObras) : 0
    
    const atrasadas = obras.filter(o => 
      o.status.toLowerCase().includes('atrasado')
    ).length
    
    const prazo = obras.filter(o => 
      o.status.toLowerCase().includes('no prazo') || 
      o.status.toLowerCase().includes('adiantado')
    ).length
    
    const obrasComExecucao = obras.filter(o => 
      o.execucao && o.execucao.totalTarefas && o.execucao.totalTarefas > 0
    ).length
    
    // 💰 MÉTRICAS FINANCEIRAS
    const orcamentoTotalPortfolio = obras.reduce((acc, o) => 
      acc + (o.dadosFinanceiros?.orcamentoTotal || 0), 0)
    
    const valorRealizadoPortfolio = obras.reduce((acc, o) => 
      acc + (o.dadosFinanceiros?.valorRealizado || 0), 0)
    
    const eficienciaMediaPortfolio = orcamentoTotalPortfolio > 0 ?
      Math.round((valorRealizadoPortfolio / orcamentoTotalPortfolio) * 100) : 0
    
    const progressoFinanceiroMedio = eficienciaMediaPortfolio
    
    // MÉTRICAS DE MARCOS
    const totalMarcosFisicos = obras.reduce((acc, o) => acc + o.marcos.total, 0)
    const marcosFisicosConcluidos = obras.reduce((acc, o) => acc + o.marcos.concluidos, 0)
    
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
      orcamentoAprovadoPortfolio: orcamentoTotalPortfolio,
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