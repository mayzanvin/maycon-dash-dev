// src/utils/excelProcessor.ts - UNIFICAÇÃO REAL F+E COM VALORES REAIS
import * as XLSX from 'xlsx'
import { DashboardData, BaseObraData, ExcelData, ObraMetrics } from '@/types/obra'

interface TarefaReal {
  EDT: string
  nome: string
  nivel: number
  resumoPai: string
  dataInicio: number
  dataTermino: number
  percentualConcluido: number
  linhaBaseInicio: number
  linhaBaseTermino: number
  marco: string | null
  origem: 'F' | 'E'
}

interface ObraReal {
  codigo: string
  nomeReal: string
  tarefasF: TarefaReal[]
  tarefasE: TarefaReal[]
  todasTarefas: TarefaReal[]
  metricas: {
    progressoGeral: number
    avanceFisico: number
    totalTarefas: number
    tarefasConcluidas: number
    totalMarcos: number
    marcosConcluidos: number
  }
}

export class ExcelProcessor {
  
  static async processBaseObras(_caminhoArquivo: string): Promise<DashboardData> {
    console.log('🔄 Processando BaseObras.xlsx - Unificação Real F+E')
    
    let workbook: XLSX.WorkBook | null = null
    
    try {
      const response = await fetch('/BaseObras.xlsx')
      if (response.ok) {
        const arrayBuffer = await response.arrayBuffer()
        workbook = XLSX.read(arrayBuffer, { 
          type: 'array',
          cellDates: true,
          sheetStubs: true
        })
        console.log('✅ Arquivo carregado')
      } else {
        throw new Error(`HTTP ${response.status}`)
      }
    } catch (error) {
      console.error('❌ Erro ao carregar:', error)
      throw new Error(`Não foi possível carregar BaseObras.xlsx: ${error}`)
    }
    
    if (!workbook) {
      throw new Error('Workbook não carregado')
    }
    
    return this.processarObrasUnificadas(workbook)
  }
  
  // 🎯 PROCESSAMENTO PRINCIPAL - UNIFICA F+E DESDE O INÍCIO
  private static processarObrasUnificadas(workbook: XLSX.WorkBook): DashboardData {
    console.log('🔄 Iniciando unificação real F+E...')
    console.log('📋 Abas encontradas:', workbook.SheetNames)
    
    // ETAPA 1: Extrair dados brutos de cada aba
    const abasProcessadas = this.extrairDadosBrutos(workbook)
    
    // ETAPA 2: Agrupar abas por obra (detectar F+E)
    const obrasAgrupadas = this.agruparPorObra(abasProcessadas)
    
    // ETAPA 3: Unificar cada obra (F+E)
    const obrasUnificadas = this.unificarObras(obrasAgrupadas)
    
    // ETAPA 4: Converter para formato de retorno
    const sheets = this.converterParaSheets(obrasUnificadas)
    const metrics = this.calcularMetricasGerais(obrasUnificadas)
    
    console.log('\n📊 RESULTADO FINAL:')
    console.log(`   Obras unificadas: ${obrasUnificadas.length}`)
    console.log(`   Total de tarefas: ${obrasUnificadas.reduce((sum, obra) => sum + obra.todasTarefas.length, 0)}`)
    obrasUnificadas.forEach(obra => {
      console.log(`   ${obra.nomeReal}: ${obra.metricas.progressoGeral}% progresso, ${obra.metricas.avanceFisico}% avanço`)
    })
    
    return {
      sheets,
      metrics,
      sheetNames: Object.keys(sheets)
    }
  }
  
  // 🎯 EXTRAÇÃO DE DADOS BRUTOS DE CADA ABA
  private static extrairDadosBrutos(workbook: XLSX.WorkBook): Array<{nome: string, tipo: 'F' | 'E' | 'outros', tarefas: TarefaReal[]}> {
    const abasProcessadas: Array<{nome: string, tipo: 'F' | 'E' | 'outros', tarefas: TarefaReal[]}> = []
    
    for (const nomeAba of workbook.SheetNames) {
      if (nomeAba === 'Planilha1' || nomeAba === 'Sheet1') continue
      
      console.log(`\n📊 Extraindo dados da aba: ${nomeAba}`)
      
      // Detectar tipo da aba
      let tipo: 'F' | 'E' | 'outros' = 'outros'
      if (nomeAba.endsWith(' - F')) {
        tipo = 'F'
      } else if (nomeAba.endsWith(' - E')) {
        tipo = 'E'
      }
      
      // Extrair tarefas da aba
      const tarefas = this.extrairTarefasDaAba(workbook, nomeAba, tipo)
      
      if (tarefas.length > 0) {
        abasProcessadas.push({
          nome: nomeAba,
          tipo,
          tarefas
        })
        console.log(`   ✅ ${tarefas.length} tarefas extraídas`)
      } else {
        console.log(`   ⚠️ Nenhuma tarefa encontrada`)
      }
    }
    
    return abasProcessadas
  }
  
  // 🎯 EXTRAÇÃO DE TAREFAS DE UMA ABA
  private static extrairTarefasDaAba(workbook: XLSX.WorkBook, nomeAba: string, origem: 'F' | 'E' | 'outros'): TarefaReal[] {
    try {
      const worksheet = workbook.Sheets[nomeAba]
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, blankrows: false })
      
      if (jsonData.length < 2) return []
      
      const headers = jsonData[0] as string[]
      const mapeamento = this.mapearColunas(headers)
      const tarefas: TarefaReal[] = []
      
      for (let i = 1; i < jsonData.length; i++) {
        const tarefa = this.extrairTarefaLinha(worksheet, i + 1, mapeamento, origem as 'F' | 'E')
        if (tarefa) {
          tarefas.push(tarefa)
        }
      }
      
      return tarefas
      
    } catch (error) {
      console.warn(`⚠️ Erro ao extrair tarefas da aba ${nomeAba}:`, error)
      return []
    }
  }
  
  // 🎯 EXTRAÇÃO DE UMA TAREFA (LEITURA DIRETA DA CÉLULA)
  private static extrairTarefaLinha(
    worksheet: XLSX.WorkSheet, 
    numeroLinha: number, 
    mapeamento: {[key: string]: number}, 
    origem: 'F' | 'E'
  ): TarefaReal | null {
    
    const obterValorCelula = (coluna: number): any => {
      if (coluna === -1) return null
      const endereco = XLSX.utils.encode_cell({ r: numeroLinha, c: coluna })
      const celula = worksheet[endereco]
      return celula?.v !== undefined ? celula.v : (celula?.w !== undefined ? celula.w : null)
    }
    
    const nome = String(obterValorCelula(mapeamento.nomeTarefa) || '').trim()
    if (!nome) return null
    
    // Extrair dados com valores reais
    const tarefa: TarefaReal = {
      EDT: String(obterValorCelula(mapeamento.edt) || ''),
      nome: nome,
      nivel: Number(obterValorCelula(mapeamento.nivel) || 0),
      resumoPai: String(obterValorCelula(mapeamento.resumoPai) || ''),
      dataInicio: this.processarDataReal(obterValorCelula(mapeamento.dataInicio)),
      dataTermino: this.processarDataReal(obterValorCelula(mapeamento.dataTermino)),
      percentualConcluido: Number(obterValorCelula(mapeamento.percentual) || 0),
      linhaBaseInicio: this.processarDataReal(obterValorCelula(mapeamento.linhaBaseInicio)),
      linhaBaseTermino: this.processarDataReal(obterValorCelula(mapeamento.linhaBaseTermino)),
      marco: obterValorCelula(mapeamento.marco) ? String(obterValorCelula(mapeamento.marco)).toUpperCase() : null,
      origem
    }
    
    return tarefa
  }
  
  // 🎯 AGRUPAMENTO POR OBRA (DETECTAR F+E)
  private static agruparPorObra(abasProcessadas: Array<{nome: string, tipo: 'F' | 'E' | 'outros', tarefas: TarefaReal[]}>): Array<{codigoObra: string, abaF?: {nome: string, tipo: 'F' | 'E' | 'outros', tarefas: TarefaReal[]}, abaE?: {nome: string, tipo: 'F' | 'E' | 'outros', tarefas: TarefaReal[]}}> {
    const grupos: { [codigo: string]: {codigoObra: string, abaF?: {nome: string, tipo: 'F' | 'E' | 'outros', tarefas: TarefaReal[]}, abaE?: {nome: string, tipo: 'F' | 'E' | 'outros', tarefas: TarefaReal[]}} } = {}
    
    abasProcessadas.forEach(aba => {
      if (aba.tipo === 'outros') return
      
      // Extrair código da obra (remover sufixo - F ou - E)
      let codigoObra = aba.nome
      if (aba.nome.endsWith(' - F')) {
        codigoObra = aba.nome.replace(' - F', '')
      } else if (aba.nome.endsWith(' - E')) {
        codigoObra = aba.nome.replace(' - E', '')
      }
      
      if (!grupos[codigoObra]) {
        grupos[codigoObra] = { codigoObra }
      }
      
      if (aba.tipo === 'F') {
        grupos[codigoObra].abaF = aba
      } else if (aba.tipo === 'E') {
        grupos[codigoObra].abaE = aba
      }
    })
    
    console.log('\n🏗️ Obras agrupadas:')
    Object.values(grupos).forEach(grupo => {
      console.log(`   ${grupo.codigoObra}: F=${grupo.abaF ? 'SIM' : 'NÃO'}, E=${grupo.abaE ? 'SIM' : 'NÃO'}`)
    })
    
    return Object.values(grupos)
  }
  
  // 🎯 UNIFICAÇÃO DAS OBRAS (F+E)
  private static unificarObras(grupos: Array<{codigoObra: string, abaF?: {nome: string, tipo: 'F' | 'E' | 'outros', tarefas: TarefaReal[]}, abaE?: {nome: string, tipo: 'F' | 'E' | 'outros', tarefas: TarefaReal[]}}>): ObraReal[] {
    const obrasUnificadas: ObraReal[] = []
    
    grupos.forEach(grupo => {
      console.log(`\n🔄 Unificando obra: ${grupo.codigoObra}`)
      
      const tarefasF = grupo.abaF ? grupo.abaF.tarefas : []
      const tarefasE = grupo.abaE ? grupo.abaE.tarefas : []
      const todasTarefas = [...tarefasF, ...tarefasE]
      
      if (todasTarefas.length === 0) {
        console.log(`   ⚠️ Obra sem tarefas válidas`)
        return
      }
      
      // 🎯 NOME REAL DA OBRA: primeira tarefa nível 1 da fiscalização
      let nomeReal = grupo.codigoObra
      if (tarefasF.length > 0) {
        const tarefaRaiz = tarefasF.find(t => t.nivel === 1)
        if (tarefaRaiz && tarefaRaiz.nome) {
          nomeReal = tarefaRaiz.nome
        }
      }
      
      // 🎯 CALCULAR MÉTRICAS REAIS
      const metricas = this.calcularMetricasReais(todasTarefas)
      
      const obraUnificada: ObraReal = {
        codigo: grupo.codigoObra,
        nomeReal: nomeReal,
        tarefasF,
        tarefasE,
        todasTarefas,
        metricas
      }
      
      obrasUnificadas.push(obraUnificada)
      
      console.log(`   ✅ ${nomeReal}`)
      console.log(`   📊 F: ${tarefasF.length} tarefas | E: ${tarefasE.length} tarefas`)
      console.log(`   📈 Progresso: ${metricas.progressoGeral}% | Avanço: ${metricas.avanceFisico}%`)
      console.log(`   🎯 Marcos: ${metricas.marcosConcluidos}/${metricas.totalMarcos}`)
    })
    
    return obrasUnificadas
  }
  
  // 🎯 CÁLCULO DE MÉTRICAS REAIS (SEMPRE VALORES REAIS)
  private static calcularMetricasReais(tarefas: TarefaReal[]): {
    progressoGeral: number
    avanceFisico: number
    totalTarefas: number
    tarefasConcluidas: number
    totalMarcos: number
    marcosConcluidos: number
  } {
    
    // 📊 PROGRESSO GERAL: tarefas não-resumo concluídas
    const tarefasExecutaveis = tarefas.filter(t => t.nivel > 2) // Não-resumo
    const tarefasExecutaveisConcluidas = tarefasExecutaveis.filter(t => t.percentualConcluido >= 100)
    
    const progressoGeral = tarefasExecutaveis.length > 0 ? 
      Math.round((tarefasExecutaveisConcluidas.length / tarefasExecutaveis.length) * 100) : 0
    
    // 🎯 AVANÇO FÍSICO: SOMENTE marcos "SIM" + 100% concluído
    const marcosReais = tarefas.filter(t => t.marco === 'SIM')
    const marcosReaisConcluidos = marcosReais.filter(t => t.percentualConcluido >= 100)
    
    // ⚠️ IMPORTANTE: Se não há marcos, avanço físico = 0 (valor real)
    const avanceFisico = marcosReais.length > 0 ? 
      Math.round((marcosReaisConcluidos.length / marcosReais.length) * 100) : 0
    
    console.log(`   📊 Cálculo real: ${tarefasExecutaveisConcluidas.length}/${tarefasExecutaveis.length} tarefas | ${marcosReaisConcluidos.length}/${marcosReais.length} marcos`)
    
    return {
      progressoGeral,
      avanceFisico,
      totalTarefas: tarefasExecutaveis.length,
      tarefasConcluidas: tarefasExecutaveisConcluidas.length,
      totalMarcos: marcosReais.length,
      marcosConcluidos: marcosReaisConcluidos.length
    }
  }
  
  // 🎯 CONVERSÃO PARA FORMATO DE RETORNO
  private static converterParaSheets(obrasUnificadas: ObraReal[]): ExcelData {
    const sheets: ExcelData = {}
    
    obrasUnificadas.forEach(obra => {
      // Converter tarefas para BaseObraData
      const tarefasConvertidas: BaseObraData[] = obra.todasTarefas.map(tarefa => ({
        EDT: tarefa.EDT,
        Nome_da_Tarefa: tarefa.nome,
        N_vel: tarefa.nivel,
        Resumo__pai_: tarefa.resumoPai,
        Data_In_cio: tarefa.dataInicio,
        Data_T_rmino: tarefa.dataTermino,
        __Conclu_do: tarefa.percentualConcluido,
        LinhaBase_In_cio: tarefa.linhaBaseInicio || 'ND',
        LinhaBase_T_rmino: tarefa.linhaBaseTermino || 'ND'
      }))
      
      // Usar código da obra como chave (será processado pelo adaptador)
      sheets[obra.codigo] = tarefasConvertidas
    })
    
    return sheets
  }
  
  private static calcularMetricasGerais(obrasUnificadas: ObraReal[]): ObraMetrics {
    const totalObras = obrasUnificadas.length
    
    return {
      totalObras,
      obrasConcluidas: obrasUnificadas.filter(o => o.metricas.progressoGeral >= 100).length,
      obrasEmAndamento: obrasUnificadas.filter(o => o.metricas.progressoGeral > 0 && o.metricas.progressoGeral < 100).length,
      obrasPendentes: obrasUnificadas.filter(o => o.metricas.progressoGeral === 0).length,
      valorTotal: 0,
      valorGasto: 0
    }
  }
  
  // MÉTODOS AUXILIARES
  private static mapearColunas(headers: string[]): {[key: string]: number} {
    const mapeamento = {
      edt: -1, nomeTarefa: -1, nivel: -1, resumoPai: -1,
      dataInicio: -1, dataTermino: -1, percentual: -1,
      linhaBaseInicio: -1, linhaBaseTermino: -1, marco: -1
    }
    
    headers.forEach((header, index) => {
      if (!header) return
      const headerLower = header.toLowerCase()
      
      if (headerLower.includes('edt')) mapeamento.edt = index
      else if (headerLower.includes('nome') && headerLower.includes('tarefa')) mapeamento.nomeTarefa = index
      else if (headerLower.includes('nível') || headerLower.includes('nivel')) mapeamento.nivel = index
      else if (headerLower.includes('resumo')) mapeamento.resumoPai = index
      else if (headerLower.includes('data') && headerLower.includes('início')) mapeamento.dataInicio = index
      else if (headerLower.includes('data') && headerLower.includes('término')) mapeamento.dataTermino = index
      else if (headerLower.includes('%') || headerLower.includes('concluído')) mapeamento.percentual = index
      else if (headerLower.includes('linhabase') && headerLower.includes('início')) mapeamento.linhaBaseInicio = index
      else if (headerLower.includes('linhabase') && headerLower.includes('término')) mapeamento.linhaBaseTermino = index
      else if (headerLower.includes('marco')) mapeamento.marco = index
    })
    
    return mapeamento
  }
  
  private static processarDataReal(valor: any): number {
    if (valor === null || valor === undefined) return 0
    if (typeof valor === 'number' && valor > 1 && valor < 100000) return valor
    if (valor instanceof Date) return Math.floor(valor.getTime() / 86400000) + 25569
    if (typeof valor === 'string' && !valor.includes('#')) {
      const parsed = parseFloat(valor)
      if (!isNaN(parsed) && parsed > 1 && parsed < 100000) return parsed
    }
    return 0
  }
}