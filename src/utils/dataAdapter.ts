// src/utils/dataAdapter.ts - CORREÇÃO COMPLETA DOS CÁLCULOS FINANCEIROS
import { DashboardData, BaseObraData, BaseInvestimentoData } from '@/types/obra'
import { DashboardUnificadoType, ObraUnificada, MetricasGerais, TaskData } from '@/types/obra-unificada'
import { determinarStatusMelhorado } from '@/utils/statusCalculator'

export class DataAdapter {
  static convertToUnificado(dashboardData: DashboardData): DashboardUnificadoType {
    console.log('🔄 === CONVERSÃO BASEADA NOS DADOS REAIS ===')
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

    // ✅ AGRUPAR POR ABA PARA IDENTIFICAR PARES F+E
    const abasPorNome: Record<string, BaseObraData[]> = {}
    dashboardData.todasTarefas.forEach(tarefa => {
      const aba = tarefa._aba || 'Sem_Aba'
      if (!abasPorNome[aba]) {
        abasPorNome[aba] = []
      }
      abasPorNome[aba].push(tarefa)
    })
    
    // ✅ IDENTIFICAR PARES F+E
    const abas = Object.keys(abasPorNome).filter(nome => nome !== 'Planilha1')
    const abasF = abas.filter(aba => aba.endsWith('-CR-F') || aba.endsWith('CR - F') || aba.endsWith('- F'))
    
    console.log(`\n📊 === PROCESSAMENTO BASEADO NOS DADOS REAIS ===`)
    console.log(`   Sistema: Status inteligente + Finanças corrigidas`)
    
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
    })
    
    // ✅ CALCULAR MÉTRICAS FINAIS
    const metricas = this.calcularMetricasCompletas(obras)
    
    console.log(`\n🎯 === RESULTADO FINAL ===`)
    console.log(`   📊 Obras processadas: ${obras.length}`)
    console.log(`   📈 Progresso médio: ${metricas.progressoMedio}%`)
    console.log(`   ⚡ Obras com execução: ${metricas.obrasComExecucao}`)
    
    return {
      obras,
      metricas,
      ultimaAtualizacao: new Date().toISOString()
    }
  }

  // ✅ CRIAR OBRA UNIFICADA COM FINANÇAS CORRIGIDAS
  private static criarObraUnificada(
    nomeBase: string,
    tarefasF: BaseObraData[],
    tarefasE: BaseObraData[],
    temExecucao: boolean,
    investimentos: BaseInvestimentoData[]
  ): ObraUnificada | null {
    
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
      
      // 💰 DADOS FINANCEIROS CORRIGIDOS (USAR CÓDIGO DTE)
      const codigoDTE = this.extrairCodigoDTE(tarefasF, tarefasE, nomeBase)
      const dadosFinanceiros = this.calcularDadosFinanceiros(todasTarefas, codigoDTE, investimentos, progressoGeral)
      
      // ✅ DETECTAR ENERGIZAÇÃO
      const temEnergizacao = this.detectarEnergizacao(tarefasF, tarefasE)
      
      // ✅ NOME DA OBRA
      const nomeObra = this.extrairNomeObra(tarefasF, tarefasE, nomeBase)
      
      const obra: ObraUnificada = {
        codigo: `${nomeBase} ${temExecucao ? '[F+E]' : '[F]'}`, // ✅ INDICADOR APENAS NO CÓDIGO TÉCNICO
        nome: nomeObra, // ✅ NOME LIMPO SEM INDICADOR
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
    
    // 2️⃣ ORÇAMENTO APROVADO (INVESTIMENTOS) - FUNÇÃO CORRIGIDA
    const orcamentoAprovado = this.buscarOrcamentoAprovado(nomeBase, investimentos)
    console.log(`   💰 Orçamento aprovado: R$ ${orcamentoAprovado.toLocaleString()}`)
    
    // 3️⃣ ESCOLHER ORÇAMENTO FINAL
    let orcamentoFinal: number
    if (orcamentoAprovado > 0 && orcamentoTarefas > 0) {
      orcamentoFinal = Math.min(orcamentoAprovado, orcamentoTarefas)
      console.log(`   ⚖️ Usando o menor orçamento (conservador): R$ ${orcamentoFinal.toLocaleString()}`)
    } else if (orcamentoAprovado > 0) {
      orcamentoFinal = orcamentoAprovado
      console.log(`   📋 Usando orçamento aprovado`)
    } else if (orcamentoTarefas > 0) {
      orcamentoFinal = orcamentoTarefas
      console.log(`   📊 Usando orçamento das tarefas`)
    } else {
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

  // ✅ EXTRAIR NOME REAL DA OBRA CORRETAMENTE (REVERTER PARA VERSÃO ORIGINAL)
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
      'CEPV_RRE-3995-764000-1': 'Implantação LD-CEPV-01 69 kV',
      'R87L_RRE-VAR-764000-2': 'Retrofit 87L SEBV 500/230/69 kV',
      'SECE_RRE-093-764005-1': 'Ampliação SESC 69/34,5/13,8 kV',
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

  // 🎯 NOVA FUNÇÃO: EXTRAIR CÓDIGO DTE PARA BUSCA FINANCEIRA (CORRIGIDA)
  private static extrairCodigoDTE(tarefasF: BaseObraData[], tarefasE: BaseObraData[], nomeBase: string): string {
    const todasTarefas = [...tarefasF, ...tarefasE]
    
    console.log(`🔍 === EXTRAINDO CÓDIGO DTE: ${nomeBase} ===`)
    
    // 1️⃣ BUSCAR NA TAREFA EDT 0 (TAREFA-RESUMO MÃE)
    const tarefaEDT0 = todasTarefas.find(t => 
      Number(t.N_vel) === 0 || 
      String(t.EDT).trim() === '0' ||
      String(t.EDT).trim() === '' ||
      Number(t.N_vel) === 1  // Incluir nível 1 também
    )
    
    if (tarefaEDT0) {
      console.log(`   🎯 Tarefa EDT 0/1 encontrada: "${tarefaEDT0.Nome_da_Tarefa}"`)
      
      const nomeTarefa = String(tarefaEDT0.Nome_da_Tarefa || '').trim()
      const match = nomeTarefa.match(/DTE\d+-\d+/i)
      if (match) {
        const codigo = match[0].toUpperCase()
        console.log(`   ✅ CÓDIGO DTE ENCONTRADO: "${codigo}"`)
        return codigo
      }
    }
    
    // 2️⃣ BUSCAR EM TODAS AS TAREFAS
    for (const tarefa of todasTarefas) {
      const nomeTarefa = String(tarefa.Nome_da_Tarefa || '').trim()
      const edt = String(tarefa.EDT || '').trim()
      const resumo = String(tarefa.Resumo_pai || '').trim()
      
      // Buscar DTE em qualquer campo
      const campos = [nomeTarefa, edt, resumo]
      for (const campo of campos) {
        const match = campo.match(/DTE\d+-\d+/i)
        if (match) {
          const codigo = match[0].toUpperCase()
          console.log(`   ✅ CÓDIGO DTE ENCONTRADO em "${campo}": "${codigo}"`)
          return codigo
        }
      }
    }
    
    // 3️⃣ MAPEAMENTO CORRIGIDO POR NOME DA ABA
    const mapeamento: Record<string, string> = {
      'CEPV_RRE-3995-764000-1': 'DTE02-001',
      'R87L_RRE-VAR-764000-2': 'DTE31-020',
      'SECE_RRE-093-764005-1': 'DTE28-003',
      'SEPV_RRE-095-764000-1': 'DTE29-004',
      'SERN_RRE-105-764000-1': 'DTE24-010',
      'SESC_RRE-098-764000-3': 'DTE27-013'  // ✅ CORRIGIDO: era DTE-27-013
    }
    
    const codigoMapeado = mapeamento[nomeBase]
    if (codigoMapeado) {
      console.log(`   ✅ CÓDIGO MAPEADO: "${codigoMapeado}"`)
      return codigoMapeado
    }
    
    console.log(`   ❌ Código DTE não encontrado, usando nome da aba: "${nomeBase}"`)
    return nomeBase
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

  // 💰 FUNÇÃO CORRIGIDA: BUSCAR ORÇAMENTO APROVADO
  private static buscarOrcamentoAprovado(nomeObra: string, investimentos: BaseInvestimentoData[]): number {
    if (!investimentos || investimentos.length === 0) {
      console.log(`💰 Nenhum investimento disponível para ${nomeObra}`)
      return 0
    }
    
    console.log(`💰 Buscando investimento para: "${nomeObra}"`)
    
    // 🎯 EXTRAIR PARTES DO NOME DA OBRA
    const match = nomeObra.match(/^([A-Z]+)(\d+)-(\d+)/)
    
    if (!match) {
      console.log(`   ❌ Formato da obra não reconhecido: "${nomeObra}"`)
      return 0
    }
    
    const [_, prefixo, numero, codigo] = match
    console.log(`   🎯 Partes extraídas: prefixo="${prefixo}", numero="${numero}", codigo="${codigo}"`)
    
    // 🔍 PADRÕES DE BUSCA BASEADOS NOS DADOS REAIS DO BaseInvestimento.xlsx
    const padroesBusca = [
      `${prefixo}-${numero}`,        // "DTE-02"  (formato exato do BaseInvestimento)
      `${prefixo}${numero}`,         // "DTE02"   (sem hífen)
      `${prefixo} ${numero}`,        // "DTE 02"  (com espaço)
      numero                         // "02"      (apenas número)
    ]
    
    console.log(`   🔍 Padrões de busca:`, padroesBusca)
    
    // 🎯 BUSCAR CORRELAÇÃO
    for (const padrao of padroesBusca) {
      const investimentoEncontrado = investimentos.find(inv => {
        const idInvestimento = inv.ID_Projeto.toUpperCase().trim()
        const padraoUpper = padrao.toUpperCase()
        
        // Busca exata
        if (idInvestimento === padraoUpper) {
          return true
        }
        
        // Busca flexível (contém)
        if (idInvestimento.includes(padraoUpper) || padraoUpper.includes(idInvestimento)) {
          return true
        }
        
        return false
      })
      
      if (investimentoEncontrado) {
        const valor = Number(investimentoEncontrado.ValorAprovado) || 0
        console.log(`   ✅ ENCONTRADO por padrão "${padrao}"`)
        console.log(`   📋 ID Investimento: "${investimentoEncontrado.ID_Projeto}"`)
        console.log(`   📝 Descrição: "${investimentoEncontrado.Descricao.substring(0, 50)}..."`)
        console.log(`   💰 Valor: R$ ${valor.toLocaleString()}`)
        return valor
      }
    }
    
    // 🔍 BUSCA ALTERNATIVA POR NÚMERO APENAS (para casos especiais)
    const numeroLimpo = numero.replace(/^0+/, '') // Remove zeros à esquerda
    const investimentoNumerico = investimentos.find(inv => {
      const id = inv.ID_Projeto.toUpperCase()
      return id.includes(`-${numero}`) || id.includes(`-${numeroLimpo}`) || id.endsWith(numero)
    })
    
    if (investimentoNumerico) {
      const valor = Number(investimentoNumerico.ValorAprovado) || 0
      console.log(`   ✅ ENCONTRADO por busca numérica "${numero}"`)
      console.log(`   📋 ID Investimento: "${investimentoNumerico.ID_Projeto}"`)
      console.log(`   💰 Valor: R$ ${valor.toLocaleString()}`)
      return valor
    }
    
    console.log(`   ❌ Investimento não encontrado para: "${nomeObra}"`)
    console.log(`   📋 IDs disponíveis:`, investimentos.map(i => i.ID_Projeto).join(', '))
    return 0
  }
  
  private static calcularOrcamentoTotal(tarefas: BaseObraData[]): number {
    return tarefas
      .filter(t => t.Orcamento_R && t.Orcamento_R > 0)
      .reduce((acc, t) => acc + (t.Orcamento_R || 0), 0)
  }
  
  private static calcularProgressoMedio(tarefas: BaseObraData[]): number {
    if (tarefas.length === 0) return 0
    
    const soma = tarefas.reduce((acc, t) => acc + (Number(t.Porcentagem_Conclu_do) || 0), 0)
    return Math.round(soma / tarefas.length)
  }
  
  private static detectarEnergizacao(tarefasF: BaseObraData[], tarefasE: BaseObraData[]): boolean {
    const todasTarefas = [...tarefasF, ...tarefasE]
    
    return todasTarefas.some(t => {
      const nome = String(t.Nome_da_Tarefa || '').toLowerCase()
      return nome.includes('energização') || nome.includes('energizacao') || 
             nome.includes('entrada em operação') || nome.includes('entrada em operacao') ||
             nome.includes('comissionamento')
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
      o.status.toLowerCase().includes('atrasada')
    ).length
    
    const prazo = obras.filter(o => 
      o.status.toLowerCase().includes('no prazo') || 
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