<<<<<<< HEAD
// src/utils/dataAdapter.ts - CORREÇÃO COMPLETA DOS CÁLCULOS FINANCEIROS
=======
// src/utils/dataAdapter.ts - SISTEMA INTELIGENTE SOBRE BASE ESTÁVEL
>>>>>>> cae3b712dedc0dc33b99e985e585c9b0d6fbab55
import { DashboardData, BaseObraData, BaseInvestimentoData } from '@/types/obra'
import { DashboardUnificadoType, ObraUnificada, MetricasGerais, TaskData } from '@/types/obra-unificada'
import { determinarStatusMelhorado } from '@/utils/statusCalculator'

export class DataAdapter {
  static convertToUnificado(dashboardData: DashboardData): DashboardUnificadoType {
<<<<<<< HEAD
    console.log('🔄 === CONVERSÃO BASEADA NOS DADOS REAIS ===')
=======
    console.log('🔄 === CONVERSÃO COM SISTEMA CRONOGRAMA INTELIGENTE ESTÁVEL ===')
>>>>>>> cae3b712dedc0dc33b99e985e585c9b0d6fbab55
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

<<<<<<< HEAD
=======
    // 🔍 DEBUG ORÇAMENTO
    const tarefasComOrcamento = dashboardData.todasTarefas.filter(t => 
      t.Orcamento_R !== null && t.Orcamento_R !== undefined && t.Orcamento_R > 0
    )
    console.log(`💰 Tarefas com Orcamento_R válido: ${tarefasComOrcamento.length} de ${dashboardData.todasTarefas.length}`)

>>>>>>> cae3b712dedc0dc33b99e985e585c9b0d6fbab55
    // ✅ AGRUPAR POR ABA PARA IDENTIFICAR PARES F+E
    const abasPorNome: Record<string, BaseObraData[]> = {}
    dashboardData.todasTarefas.forEach(tarefa => {
      const aba = tarefa._aba || 'Sem_Aba'
      if (!abasPorNome[aba]) {
        abasPorNome[aba] = []
      }
      abasPorNome[aba].push(tarefa)
    })
    
<<<<<<< HEAD
    // ✅ IDENTIFICAR PARES F+E
=======
    // ✅ IDENTIFICAR PARES F+E (LÓGICA RESTAURADA)
>>>>>>> cae3b712dedc0dc33b99e985e585c9b0d6fbab55
    const abas = Object.keys(abasPorNome).filter(nome => nome !== 'Planilha1')
    const abasF = abas.filter(aba => aba.endsWith('-CR-F') || aba.endsWith('CR - F') || aba.endsWith('- F'))
    
<<<<<<< HEAD
    console.log(`\n📊 === PROCESSAMENTO BASEADO NOS DADOS REAIS ===`)
    console.log(`   Sistema: Status inteligente + Finanças corrigidas`)
=======
    console.log(`\n📊 === PROCESSAMENTO DE OBRAS F+E ===`)
    console.log(`   Abas encontradas: ${abas.length}`)
    console.log(`   Abas F (Fiscalização): ${abasF.length}`)
    console.log(`   Sistema: Cronograma Inteligente`)
>>>>>>> cae3b712dedc0dc33b99e985e585c9b0d6fbab55
    
    const obras: ObraUnificada[] = []
    const investimentos = dashboardData.investimentos || []
    
    // ✅ PROCESSAR CADA PAR F+E
    abasF.forEach(abaF => {
      // 🎯 EXTRAIR NOME BASE
      let nomeBase: string
      if (abaF.endsWith('-CR-F')) {
        nomeBase = abaF.slice(0, -5)
      } else if (abaF.endsWith('CR - F')) {
        nomeBase = abaF.slice(0, -7)
      } else if (abaF.endsWith('- F')) {
        nomeBase = abaF.slice(0, -4)
      } else {
        nomeBase = abaF.slice(0, -5)
      }
      
      const abaE = `${nomeBase}-CR-E`
      const temExecucao = abas.includes(abaE)
      
      const tarefasF = abasPorNome[abaF] || []
      const tarefasE = temExecucao ? (abasPorNome[abaE] || []) : []
      
      console.log(`\n🏗️ === PROCESSANDO OBRA: ${nomeBase} ===`)
<<<<<<< HEAD
      console.log(`   📂 Aba Fiscalização: "${abaF}" (${tarefasF.length} tarefas)`)
      console.log(`   📂 Aba Execução: "${abaE}" ${temExecucao ? `✅ EXISTE (${tarefasE.length} tarefas)` : '❌ NÃO EXISTE'}`)
      console.log(`   🎯 Tipo: ${temExecucao ? 'OBRA COMPLETA [F+E]' : 'APENAS FISCALIZAÇÃO [F]'}`)
      
      if (tarefasF.length === 0) {
        console.log(`   ⚠️ Ignorando obra sem tarefas de fiscalização`)
        return
      }
      
      const obra = this.criarObraUnificada(nomeBase, tarefasF, tarefasE, temExecucao, investimentos)
      if (obra) {
        obras.push(obra)
        console.log(`   ✅ Obra criada: "${obra.codigo}" - ${obra.status}`)
        console.log(`   📊 Fiscalização: ${obra.fiscalizacao.totalTarefas} tarefas (${obra.fiscalizacao.progressoMedio}%)`)
        console.log(`   📊 Execução: ${obra.execucao.totalTarefas} tarefas (${obra.execucao.progressoMedio}%)`)
      }
=======
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
>>>>>>> cae3b712dedc0dc33b99e985e585c9b0d6fbab55
    })
    
    // ✅ CALCULAR MÉTRICAS FINAIS
    const metricas = this.calcularMetricasCompletas(obras)
    
<<<<<<< HEAD
    console.log(`\n🎯 === RESULTADO FINAL ===`)
    console.log(`   📊 Obras processadas: ${obras.length}`)
    console.log(`   📈 Progresso médio: ${metricas.progressoMedio}%`)
    console.log(`   ⚡ Obras com execução: ${metricas.obrasComExecucao}`)
=======
    console.log(`\n✅ === RESULTADO FINAL ===`)
    console.log(`   Obras F+E criadas: ${obras.length}`)
    console.log(`   Orçamento total do portfólio: R$ ${metricas.orcamentoTotalPortfolio.toLocaleString()}`)
    console.log(`   Valor realizado: R$ ${metricas.valorRealizadoPortfolio.toLocaleString()}`)
>>>>>>> cae3b712dedc0dc33b99e985e585c9b0d6fbab55
    
    return {
      obras,
      metricas,
      ultimaAtualizacao: new Date().toISOString()
    }
  }

<<<<<<< HEAD
  // ✅ CRIAR OBRA UNIFICADA COM FINANÇAS CORRIGIDAS
  private static criarObraUnificada(
    nomeBase: string,
    tarefasF: BaseObraData[],
    tarefasE: BaseObraData[],
=======
  // ✅ CRIAR OBRA COM CRONOGRAMA INTELIGENTE (MANTENDO BASE ESTÁVEL)
  private static criarObraComCronogramaInteligente(
    nomeBase: string, 
    tarefasF: BaseObraData[], 
    tarefasE: BaseObraData[], 
>>>>>>> cae3b712dedc0dc33b99e985e585c9b0d6fbab55
    temExecucao: boolean,
    investimentos: BaseInvestimentoData[]
  ): ObraUnificada | null {
    
<<<<<<< HEAD
    try {
      // 🎯 DETERMINAR STATUS COM NOVA LÓGICA
      const status = determinarStatusMelhorado(tarefasF, tarefasE)
      
      // ✅ MÉTRICAS BÁSICAS
      const progressoF = this.calcularProgressoMedio(tarefasF)
      const progressoE = this.calcularProgressoMedio(tarefasE)
      const progressoGeral = temExecucao ? Math.round((progressoF + progressoE) / 2) : progressoF
      
      // ✅ TAREFAS E MARCOS
      const totalTarefasF = tarefasF.length
      const tarefasConcluidasF = tarefasF.filter(t => Number(t.Porcentagem_Conclu_do) >= 100).length
      const totalTarefasE = tarefasE.length
      const tarefasConcluidasE = tarefasE.filter(t => Number(t.Porcentagem_Conclu_do) >= 100).length
      
      const totalTarefas = totalTarefasF + totalTarefasE
      const tarefasConcluidas = tarefasConcluidasF + tarefasConcluidasE
      
      // ✅ MARCOS
      const todasTarefas = [...tarefasF, ...tarefasE]
      const marcos = todasTarefas.filter(t => String(t.Marco).toUpperCase() === 'SIM')
      const marcosConcluidos = marcos.filter(t => Number(t.Porcentagem_Conclu_do) >= 100)
      
      // ✅ FORMATAÇÃO DE TAREFAS
      const tarefasFiscalizacaoFormatadas: TaskData[] = tarefasF.map(t => this.formatarTarefaParaTaskData(t))
      const tarefasExecucaoFormatadas: TaskData[] = tarefasE.map(t => this.formatarTarefaParaTaskData(t))
      
      // 💰 DADOS FINANCEIROS CORRIGIDOS
      const dadosFinanceiros = this.calcularDadosFinanceiros(todasTarefas, nomeBase, investimentos, progressoGeral)
      
      // ✅ DETECTAR ENERGIZAÇÃO
      const temEnergizacao = this.detectarEnergizacao(tarefasF, tarefasE)
      
      // ✅ NOME DA OBRA
      const nomeObra = this.extrairNomeObra(tarefasF, tarefasE, nomeBase)
      
      const obra: ObraUnificada = {
        codigo: `${nomeBase} ${temExecucao ? '[F+E]' : '[F]'}`, // ✅ INDICADOR CLARO
        nome: `${nomeObra} ${temExecucao ? '[F+E]' : '[F]'}`, // ✅ TAMBÉM NO NOME
        status: status,
        progressoGeral: progressoGeral,
        avancooFisico: progressoGeral, // ✅ Campo que ListaObrasUnificadas.tsx usa
        avancaoFisico: progressoGeral, // ✅ Alias para compatibilidade
        tarefasConcluidas: tarefasConcluidas,
        totalTarefas: totalTarefas,
        marcos: {
          total: marcos.length,
          concluidos: marcosConcluidos.length
        },
        metricas: {
          progressoGeral: progressoGeral,
          avancooFisico: progressoGeral,
          totalTarefas: totalTarefas,
          tarefasConcluidas: tarefasConcluidas,
          totalMarcos: marcos.length,
          marcosConcluidos: marcosConcluidos.length,
          orcamentoTotal: dadosFinanceiros.orcamentoTotal,
          valorRealizado: dadosFinanceiros.valorRealizado,
          orcamentoAprovado: dadosFinanceiros.orcamentoAprovado,
          eficienciaExecucao: dadosFinanceiros.eficienciaExecucao,
          progressoFinanceiro: dadosFinanceiros.progressoFinanceiro
        },
        temEnergizacao: temEnergizacao,
        dadosFinanceiros: dadosFinanceiros,
        fiscalizacao: {
          tarefas: tarefasFiscalizacaoFormatadas,
          progressoFornecimentos: this.calcularProgressoMedio(tarefasF),
          progressoMedio: this.calcularProgressoMedio(tarefasF),
          tarefasConcluidas: tarefasF.filter(t => Number(t.Porcentagem_Conclu_do) >= 100).length,
          totalTarefas: tarefasF.length
        },
        execucao: {
          tarefas: tarefasExecucaoFormatadas,
          progressoExecucao: this.calcularProgressoMedio(tarefasE),
          progressoMedio: this.calcularProgressoMedio(tarefasE),
          tarefasConcluidas: tarefasE.filter(t => Number(t.Porcentagem_Conclu_do) >= 100).length,
          totalTarefas: tarefasE.length
        }
      }
      
      return obra
      
    } catch (error) {
      console.error(`❌ Erro ao criar obra ${nomeBase}:`, error)
      return null
    }
  }

  // 💰 CALCULAR DADOS FINANCEIROS CORRIGIDOS
  private static calcularDadosFinanceiros(
    todasTarefas: BaseObraData[],
    nomeBase: string,
    investimentos: BaseInvestimentoData[],
    progressoGeral: number
  ) {
    console.log(`\n💰 === CÁLCULO FINANCEIRO CORRIGIDO: ${nomeBase} ===`)
    
    // 1️⃣ ORÇAMENTO DAS TAREFAS
    const orcamentoTarefas = this.calcularOrcamentoTotal(todasTarefas)
    console.log(`   💰 Orçamento das tarefas: R$ ${orcamentoTarefas.toLocaleString()}`)
    
    // 2️⃣ ORÇAMENTO APROVADO (INVESTIMENTOS)
    const orcamentoAprovado = this.buscarOrcamentoAprovado(nomeBase, investimentos)
    console.log(`   💰 Orçamento aprovado: R$ ${orcamentoAprovado.toLocaleString()}`)
    
    // 3️⃣ ESCOLHER ORÇAMENTO FINAL (MAIS CONSERVADOR)
    let orcamentoFinal: number
    if (orcamentoAprovado > 0 && orcamentoTarefas > 0) {
      // Se ambos existem, usar o menor (mais conservador)
      orcamentoFinal = Math.min(orcamentoAprovado, orcamentoTarefas)
      console.log(`   ⚖️ Usando o menor orçamento (conservador): R$ ${orcamentoFinal.toLocaleString()}`)
    } else if (orcamentoAprovado > 0) {
      orcamentoFinal = orcamentoAprovado
      console.log(`   📋 Usando orçamento aprovado`)
    } else if (orcamentoTarefas > 0) {
      orcamentoFinal = orcamentoTarefas
      console.log(`   📊 Usando orçamento das tarefas`)
    } else {
      // 🎯 ORÇAMENTO ESTIMADO BASEADO EM PADRÕES
      orcamentoFinal = this.estimarOrcamento(nomeBase, todasTarefas.length)
      console.log(`   🔮 Orçamento estimado: R$ ${orcamentoFinal.toLocaleString()}`)
    }
    
    // 4️⃣ VALOR REALIZADO CORRIGIDO
    const valorRealizado = this.calcularValorRealizadoCorrigido(todasTarefas, orcamentoFinal, progressoGeral)
    console.log(`   ✅ Valor realizado: R$ ${valorRealizado.toLocaleString()}`)
    
    // 5️⃣ EFICIÊNCIA CORRIGIDA (LIMITADA)
    const eficienciaRaw = orcamentoFinal > 0 ? (valorRealizado / orcamentoFinal) * 100 : 0
    const eficienciaLimitada = Math.min(150, Math.max(0, eficienciaRaw)) // Limitar entre 0% e 150%
    const eficienciaExecucao = Math.round(eficienciaLimitada)
    
    console.log(`   📊 Eficiência bruta: ${eficienciaRaw.toFixed(1)}%`)
    console.log(`   🛡️ Eficiência limitada: ${eficienciaExecucao}%`)
    
    // 6️⃣ PROGRESSO FINANCEIRO
    const progressoFinanceiro = Math.min(100, progressoGeral) // Nunca passar de 100%
    
    // 7️⃣ STATUS DE EFICIÊNCIA
    const statusEficiencia: 'Eficiente' | 'Atenção' | 'Crítico' = 
      eficienciaExecucao >= 80 && eficienciaExecucao <= 120 ? 'Eficiente' :
      eficienciaExecucao >= 60 && eficienciaExecucao <= 140 ? 'Atenção' : 'Crítico'
    
    return {
      orcamentoTotal: orcamentoFinal,
      valorRealizado: valorRealizado,
      orcamentoAprovado: orcamentoFinal,
      eficienciaExecucao: eficienciaExecucao,
      progressoFinanceiro: progressoFinanceiro,
      statusEficiencia: statusEficiencia,
      corelacionEncontrada: orcamentoAprovado > 0
    }
  }

  // 🔮 ESTIMAR ORÇAMENTO BASEADO EM PADRÕES
  private static estimarOrcamento(nomeBase: string, qtdTarefas: number): number {
    const nome = nomeBase.toUpperCase()
    
    // Padrões por tipo de obra (em milhões)
    if (nome.includes('IMPLANTAÇÃO') || nome.includes('CONSTRUÇÃO')) {
      return qtdTarefas * 100000 // R$ 100k por tarefa
    } else if (nome.includes('AMPLIAÇÃO') || nome.includes('RETROFIT')) {
      return qtdTarefas * 50000 // R$ 50k por tarefa
    } else if (nome.includes('ESTUDO')) {
      return qtdTarefas * 10000 // R$ 10k por tarefa
    } else {
      return qtdTarefas * 75000 // R$ 75k por tarefa (padrão)
    }
  }

  // ✅ VALOR REALIZADO CORRIGIDO
  private static calcularValorRealizadoCorrigido(
    tarefas: BaseObraData[], 
    orcamentoTotal: number, 
    progressoGeral: number
  ): number {
    
    // Se tem orçamento por tarefa, usar cálculo específico
    const tarefasComOrcamento = tarefas.filter(t => t.Orcamento_R && t.Orcamento_R > 0)
    
    if (tarefasComOrcamento.length > 0) {
      const valorCalculado = tarefasComOrcamento.reduce((acc, t) => {
        const orcTarefa = Number(t.Orcamento_R) || 0
        const progTarefa = Number(t.Porcentagem_Conclu_do) || 0
        return acc + (orcTarefa * progTarefa / 100)
      }, 0)
      
      return Math.round(valorCalculado)
    }
    
    // Senão, usar proporção do progresso geral
    return Math.round((orcamentoTotal * progressoGeral) / 100)
  }

  // ✅ EXTRAIR NOME REAL DA OBRA CORRETAMENTE
  private static extrairNomeObra(tarefasF: BaseObraData[], tarefasE: BaseObraData[], nomeBase: string): string {
    const todasTarefas = [...tarefasF, ...tarefasE]
    
    // 1️⃣ BUSCAR NO RESUMO (PAI) DAS TAREFAS DE NÍVEL 1
    const tarefaNivel1 = todasTarefas.find(t => Number(t.N_vel) === 1)
    if (tarefaNivel1 && tarefaNivel1.Resumo_pai) {
      const resumo = String(tarefaNivel1.Resumo_pai).trim()
      if (resumo.length > 10) {
        console.log(`🏷️ Nome encontrado no Resumo (pai): ${resumo}`)
        return resumo
      }
    }
    
    // 2️⃣ BUSCAR NO NOME DA TAREFA DE NÍVEL 1
    if (tarefaNivel1 && tarefaNivel1.Nome_da_Tarefa) {
      const nome = String(tarefaNivel1.Nome_da_Tarefa).trim()
      if (nome.length > 10 && !nome.includes('EDT')) {
        console.log(`🏷️ Nome encontrado na Tarefa nível 1: ${nome}`)
        return nome
      }
    }
    
    // 3️⃣ MAPEAR NOMES CONHECIDOS POR CÓDIGO
    const mapeamentoNomes: Record<string, string> = {
      'SEPV_RRE-095-764000-1': 'Construção da SE Paraviana 69/13,8 kV',
      'SESC_RRE-098-764000-3': 'Ampliação SE Sucuba 69/34,5 kV',
      'SERN_RRE-105-764000-1': 'Adequação 87L SE Boa Vista (Eletronorte)',
      'CEPV_RRE-095-764000-1': 'Estudos elétricos de demanda do SEP Aprovado',
      'DTE02-001': 'Implantação LD-CEPV-01 69 kV',
      'DTE31-020': 'Retrofit 87L SEBV 500/230/69 kV',
      'DTE28-003': 'Ampliação SESC 69/34,5/13,8 kV',
      'DTE29-004': 'Implantação SE PSK kV',
      'DTE24-010': 'Ampli/Automação SERN 69/34,5/13,8 kV',
      'DTE-27-013': 'Ampliação SESC 69/34,5/13,8 kV'
    }
    
    const nomeCompleto = mapeamentoNomes[nomeBase]
    if (nomeCompleto) {
      console.log(`🏷️ Nome mapeado: ${nomeCompleto}`)
      return nomeCompleto
    }
    
    // 4️⃣ BUSCAR TAREFA COM NOME MAIS DESCRITIVO
    const tarefaDescritiva = todasTarefas
      .filter(t => {
        const nome = String(t.Nome_da_Tarefa || '')
        return nome.length > 15 && 
               (nome.includes('SE ') || nome.includes('Subestação') || 
                nome.includes('Construção') || nome.includes('Ampliação') ||
                nome.includes('Implantação') || nome.includes('Retrofit'))
      })
      .sort((a, b) => String(b.Nome_da_Tarefa).length - String(a.Nome_da_Tarefa).length)[0]
    
    if (tarefaDescritiva) {
      const nome = String(tarefaDescritiva.Nome_da_Tarefa)
      console.log(`🏷️ Nome descritivo encontrado: ${nome}`)
      return nome
    }
    
    // 5️⃣ FALLBACK: Formatar nome base
    const nomeFormatado = nomeBase
      .replace(/[_-]/g, ' ')
      .replace(/RRE/g, '')
      .replace(/CR/g, '')
      .trim()
      .toUpperCase()
    
    console.log(`🏷️ Nome fallback: ${nomeFormatado}`)
    return nomeFormatado
  }

  // ✅ FORMATAÇÃO PARA TASKDATA
  private static formatarTarefaParaTaskData(tarefa: BaseObraData): TaskData {
    return {
      'EDT': tarefa.EDT,
      'Nome da Tarefa': String(tarefa.Nome_da_Tarefa || ''),
      'Nível': Number(tarefa.N_vel || 0),
      'Resumo (pai)': String(tarefa.Resumo_pai || ''),
      'Data Início': Number(tarefa.Data_In_cio || 0),
      'Data Término': Number(tarefa.Data_T_rmino || 0),
      '% Concluído': Number(tarefa.Porcentagem_Conclu_do || 0),
      'LinhaBase Início': Number(tarefa.LinhaBase_In_cio || 0),
      'LinhaBase Término': Number(tarefa.LinhaBase_T_rmino || 0),
      'Predecessoras': tarefa.Predecessoras || null,
      'Sucessoras': tarefa.Sucessoras || null,
      'Marco': tarefa.Marco || null,
      'Anotações': tarefa.Anota_es || null,
      'Nomes dos Recursos': tarefa.Nomes_dos_Recursos || null,
      'Coordenada': tarefa.Coordenada || null,
      'Orçamento (R$)': tarefa.Orcamento_R || null,
      '_aba': tarefa._aba
    }
  }

  // 💰 BUSCAR ORÇAMENTO APROVADO
  private static buscarOrcamentoAprovado(nomeObra: string, investimentos: BaseInvestimentoData[]): number {
    if (!investimentos || investimentos.length === 0) {
      console.log(`💰 Nenhum investimento disponível para ${nomeObra}`)
      return 0
    }
    
    console.log(`💰 Buscando investimento para: ${nomeObra}`)
    
    // 🎯 CORREÇÃO ESPECÍFICA PARA SESC (DTE28-003)
    if (nomeObra.toLowerCase().includes('sesc') || nomeObra.toLowerCase().includes('seccionadora')) {
      console.log(`🎯 Obra SESC detectada - buscando por palavras-chave específicas`)
      
      const palavrasChaveSESC = ['sesc', 'seccionadora', 'eletrocentro', 'subestação']
      for (const palavra of palavrasChaveSESC) {
        const investimento = investimentos.find(inv => 
          inv.Descricao.toLowerCase().includes(palavra.toLowerCase())
        )
        if (investimento) {
          const valor = Number(investimento.ValorAprovado) || 0
          console.log(`✅ SESC: Encontrado por "${palavra}" = R$ ${valor.toLocaleString()}`)
          return valor
        }
      }
      console.log(`❌ SESC: Nenhuma palavra-chave encontrada nos investimentos`)
    }
    
    // 🎯 CORREÇÃO ESPECÍFICA PARA R87L (DTE31-020)
    if (nomeObra.toLowerCase().includes('r87l') || nomeObra.toLowerCase().includes('retrofit') || 
        nomeObra.toLowerCase().includes('sebv') || nomeObra.toLowerCase().includes('boa vista')) {
      console.log(`🎯 Obra R87L detectada - buscando por palavras-chave específicas`)
      
      const palavrasChaveR87L = ['r87l', '87l', 'retrofit', 'sebv', 'boa vista']
      for (const palavra of palavrasChaveR87L) {
        const investimento = investimentos.find(inv => 
          inv.Descricao.toLowerCase().includes(palavra.toLowerCase())
        )
        if (investimento) {
          const valor = Number(investimento.ValorAprovado) || 0
          console.log(`✅ R87L: Encontrado por "${palavra}" = R$ ${valor.toLocaleString()}`)
          return valor
        }
      }
      console.log(`❌ R87L: Nenhuma palavra-chave encontrada nos investimentos`)
    }
    
=======
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
    
>>>>>>> cae3b712dedc0dc33b99e985e585c9b0d6fbab55
    const match = nomeObra.match(/^([A-Z]+)(\d+)-(\d+)/)
    
    if (!match) {
      const palavrasChave = ['SESC', 'SEPV', 'CEPV', 'SERN', 'SECE', 'R87L']
      for (const palavra of palavrasChave) {
        if (nomeObra.toUpperCase().includes(palavra)) {
          const investimento = investimentos.find(inv => 
            inv.Descricao.toUpperCase().includes(palavra)
          )
          if (investimento) {
<<<<<<< HEAD
            const valor = Number(investimento.ValorAprovado) || 0
            console.log(`✅ Encontrado por palavra-chave "${palavra}" = R$ ${valor.toLocaleString()}`)
            return valor
          }
        }
      }
      console.log(`❌ Nenhuma palavra-chave encontrada para: ${nomeObra}`)
      return 0
    }
    
    const [, prefixo, numero, codigo] = match
    const padroesBusca = [
      `${prefixo}${numero}-${codigo}`,
      `${prefixo}${numero}.${codigo}`,
      `${prefixo} ${numero}-${codigo}`,
      `${prefixo} ${numero}.${codigo}`,
      `${prefixo}${numero}`,
      `${numero}-${codigo}`,
      `${numero}.${codigo}`
    ]
    
    for (const padrao of padroesBusca) {
      const investimento = investimentos.find(inv => 
        inv.ID_Projeto.includes(padrao) || inv.Descricao.includes(padrao)
      )
      if (investimento) {
        const valor = Number(investimento.ValorAprovado) || 0
        console.log(`✅ Encontrado por padrão "${padrao}" = R$ ${valor.toLocaleString()}`)
        return valor
      }
    }
    
    console.log(`❌ Investimento não encontrado para: ${nomeObra}`)
    return 0
  }
  
  private static calcularOrcamentoTotal(tarefas: BaseObraData[]): number {
    return tarefas
      .filter(t => t.Orcamento_R && t.Orcamento_R > 0)
      .reduce((acc, t) => acc + (t.Orcamento_R || 0), 0)
  }
  
=======
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
  
>>>>>>> cae3b712dedc0dc33b99e985e585c9b0d6fbab55
  private static calcularProgressoMedio(tarefas: BaseObraData[]): number {
    if (tarefas.length === 0) return 0
    
    const soma = tarefas.reduce((acc, t) => acc + (Number(t.Porcentagem_Conclu_do) || 0), 0)
    return Math.round(soma / tarefas.length)
  }
  
  private static detectarEnergizacao(tarefasF: BaseObraData[], tarefasE: BaseObraData[]): boolean {
    const todasTarefas = [...tarefasF, ...tarefasE]
<<<<<<< HEAD
    
    return todasTarefas.some(t => {
      const nome = String(t.Nome_da_Tarefa || '').toLowerCase()
      return nome.includes('energização') || nome.includes('energizacao') || 
             nome.includes('entrada em operação') || nome.includes('entrada em operacao') ||
             nome.includes('comissionamento')
=======
    const palavrasChave = [
      'energização', 'energizacao', 'comissionamento', 'subestação', 'subestacao',
      'transformador', 'disjuntor', 'montagem', 'equipamento'
    ]
    
    return todasTarefas.some(t => {
      const nome = String(t.Nome_da_Tarefa || '').toLowerCase()
      const resumo = String(t.Resumo_pai || '').toLowerCase()
      const texto = `${nome} ${resumo}`
      
      return palavrasChave.some(palavra => texto.includes(palavra))
>>>>>>> cae3b712dedc0dc33b99e985e585c9b0d6fbab55
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
<<<<<<< HEAD
      o.status.toLowerCase().includes('atrasada')
=======
      o.status.toLowerCase().includes('atrasado')
>>>>>>> cae3b712dedc0dc33b99e985e585c9b0d6fbab55
    ).length
    
    const prazo = obras.filter(o => 
      o.status.toLowerCase().includes('no prazo') || 
<<<<<<< HEAD
      o.status.toLowerCase().includes('adiantada')
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
    
    const progressoFinanceiroMedio = totalObras > 0 ?
      Math.round(obras.reduce((acc, o) => acc + (o.dadosFinanceiros?.progressoFinanceiro || 0), 0) / totalObras) : 0
    
    // ✅ CONTAGEM DE MARCOS
    const totalMarcosFisicos = obras.reduce((acc, o) => acc + o.marcos.total, 0)
    const marcosFisicosConcluidos = obras.reduce((acc, o) => acc + o.marcos.concluidos, 0)
    
=======
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
    
>>>>>>> cae3b712dedc0dc33b99e985e585c9b0d6fbab55
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
      eficienciaMediaPortfolio: 0,
      progressoFinanceiroMedio: 0,
      mediaaProgressoGeral: 0,
      mediaaAvancaoFisico: 0
    }
  }
}