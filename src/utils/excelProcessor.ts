// src/utils/excelProcessor.ts - CORREÇÃO ESPECÍFICA DOS TIPOS
import * as XLSX from 'xlsx'
import { DashboardData, BaseObraData, ExcelData, BaseInvestimentoData } from '@/types/obra'

export class ExcelProcessor {
  
  static async processBaseObras(caminhoArquivo: string = '/BaseObras.xlsx'): Promise<DashboardData> {
    console.log('📊 === PROCESSAMENTO COM BUSCA INTELIGENTE DE ORÇAMENTO ===')
    
    try {
      const dashboardData = await this.processarBaseObras(caminhoArquivo)
      const investimentos = await this.processarBaseInvestimento('/BaseInvestimento2025.xlsx')
      
      const resultado: DashboardData = {
        ...dashboardData,
        investimentos
      }
      
      console.log('🎯 === RESUMO FINAL DO PROCESSAMENTO ===')
      console.log(`📊 Total de tarefas processadas: ${resultado.todasTarefas.length}`)
      
      // Estatísticas de orçamento
      const tarefasComOrcamento = resultado.todasTarefas.filter(t => t.Orcamento_R && t.Orcamento_R > 0)
      const valorTotal = tarefasComOrcamento.reduce((acc, t) => acc + (t.Orcamento_R || 0), 0)
      
      console.log(`💰 Tarefas com orçamento válido: ${tarefasComOrcamento.length}`)
      console.log(`💰 Valor total encontrado: R$ ${valorTotal.toLocaleString()}`)
      console.log(`💰 Investimentos disponíveis: ${resultado.investimentos?.length || 0}`)
      
      if (tarefasComOrcamento.length === 0) {
        console.log('⚠️ ATENÇÃO: Nenhuma tarefa com orçamento > 0 foi encontrada!')
        console.log('   Verifique se a coluna "Orçamento (R$)" existe no Excel')
      }
      
      return resultado
      
    } catch (error) {
      console.error('❌ Erro crítico no processamento:', error)
      throw new Error(`Falha ao processar: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
    }
  }
  
  private static async processarBaseObras(caminhoArquivo: string): Promise<DashboardData> {
    console.log('📊 Carregando BaseObras.xlsx...')
    
    const response = await fetch(caminhoArquivo)
    if (!response.ok) {
      throw new Error(`BaseObras não encontrado: ${response.status}`)
    }
    
    const arrayBuffer = await response.arrayBuffer()
    const workbook = XLSX.read(arrayBuffer, { 
      type: 'array', 
      cellDates: true,
      cellNF: false,
      cellStyles: false 
    })
    
    console.log('📋 Abas encontradas:', workbook.SheetNames)
    
    const obrasPorAba: ExcelData = {}
    const todasTarefas: BaseObraData[] = []
    
    for (const sheetName of workbook.SheetNames) {
      if (sheetName === 'Planilha1') {
        console.log('⏭️ Pulando Planilha1 (vazia)')
        continue
      }
      
      console.log(`\n📄 === PROCESSANDO ABA: ${sheetName} ===`)
      
      const worksheet = workbook.Sheets[sheetName]
      if (!worksheet) {
        console.log('⚠️ Worksheet não encontrada')
        continue
      }
      
      // Usar método mais robusto de conversão
      const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1')
      const totalCols = range.e.c + 1
      const totalRows = range.e.r + 1
      
      console.log(`📊 Dimensões: ${totalCols} colunas x ${totalRows} linhas`)
      
      // Extrair headers manualmente
      const headers: string[] = []
      for (let col = 0; col < totalCols; col++) {
        const cellAddr = XLSX.utils.encode_cell({ r: 0, c: col })
        const cell = worksheet[cellAddr]
        headers[col] = cell ? String(cell.v || '') : ''
      }
      
      console.log('📋 Headers encontrados:', headers)
      
      // 💰 BUSCA INTELIGENTE DA COLUNA ORÇAMENTO
      const posicaoOrcamento = this.encontrarColunaOrcamento(headers)
      console.log(`💰 Posição da coluna orçamento: ${posicaoOrcamento}`)
      
      if (posicaoOrcamento === -1) {
        console.log('⚠️ Coluna de orçamento não encontrada nesta aba')
      }
      
      const tarefasAba: BaseObraData[] = []
      let valoresOrcamentoEncontrados = 0
      let exemplosMostrados = 0
      
      // Processar dados linha por linha (pular header - linha 0)
      for (let row = 1; row < totalRows; row++) {
        try {
          const rowData: any[] = []
          
          // Extrair dados de cada célula manualmente
          for (let col = 0; col < totalCols; col++) {
            const cellAddr = XLSX.utils.encode_cell({ r: row, c: col })
            const cell = worksheet[cellAddr]
            rowData[col] = cell ? cell.v : null
          }
          
          // Processar orçamento com múltiplas tentativas
          let orcamentoValue: number | null = null
          
          if (posicaoOrcamento >= 0) {
            const valorBruto = rowData[posicaoOrcamento]
            orcamentoValue = this.conversaoRobustaMoeda(valorBruto)
            
            // Debug dos primeiros exemplos
            if (orcamentoValue && orcamentoValue > 0 && exemplosMostrados < 3) {
              console.log(`💰 EXEMPLO ${exemplosMostrados + 1}:`)
              console.log(`   Valor bruto: "${valorBruto}" (tipo: ${typeof valorBruto})`)
              console.log(`   Valor convertido: R$ ${orcamentoValue.toLocaleString()}`)
              console.log(`   Tarefa: ${this.getStringValue(rowData[1]) || 'Sem nome'}`)
              exemplosMostrados++
            }
            
            if (orcamentoValue && orcamentoValue > 0) {
              valoresOrcamentoEncontrados++
            }
          }
          
          // ✅ CRIAR OBJETO BASEOBRADA COM TIPOS CORRETOS
          const tarefa: BaseObraData = {
            EDT: this.getStringValue(rowData[0]) || `${sheetName}_${row}`,
            Nome_da_Tarefa: this.getStringValue(rowData[1]) || '',
            N_vel: this.getNumberValue(rowData[2]) || 0,
            Resumo_pai: this.getStringValue(rowData[3]) || undefined, // ✅ CORRIGIDO: undefined em vez de null
            Marco: this.getStringValue(rowData[4]) || null,
            Data_In_cio: this.processDate(rowData[5]) || '',
            Data_T_rmino: this.processDate(rowData[6]) || '',
            Porcentagem_Conclu_do: this.getNumberValue(rowData[7]) || 0,
            LinhaBase_In_cio: this.processDate(rowData[8]) || undefined,
            LinhaBase_T_rmino: this.processDate(rowData[9]) || undefined,
            Predecessoras: this.getStringValue(rowData[10]) || null,
            Sucessoras: this.getStringValue(rowData[11]) || null,
            Anota_es: this.getStringValue(rowData[12]) || null,
            Nomes_dos_Recursos: this.getStringValue(rowData[13]) || null,
            Coordenada: this.getStringValue(rowData[14]) || null,
            Orcamento_R: orcamentoValue,
            _aba: sheetName
          }
          
          // Validar se é uma tarefa válida
          if (tarefa.Nome_da_Tarefa && tarefa.Nome_da_Tarefa.trim() !== '') {
            tarefasAba.push(tarefa)
            todasTarefas.push(tarefa)
          }
          
        } catch (error) {
          console.log(`⚠️ Erro na linha ${row + 1}:`, error)
        }
      }
      
      obrasPorAba[sheetName] = tarefasAba
      
      console.log(`✅ Aba ${sheetName} processada:`)
      console.log(`   📊 ${tarefasAba.length} tarefas válidas`)
      console.log(`   💰 ${valoresOrcamentoEncontrados} tarefas com orçamento`)
      
      if (valoresOrcamentoEncontrados > 0) {
        const somaOrcamento = tarefasAba
          .filter(t => t.Orcamento_R && t.Orcamento_R > 0)
          .reduce((acc, t) => acc + (t.Orcamento_R || 0), 0)
        console.log(`   💰 Soma orçamentos: R$ ${somaOrcamento.toLocaleString()}`)
      }
    }
    
    return {
      todasTarefas,
      obrasPorAba,
      ultimaAtualizacao: new Date().toISOString()
    }
  }
  
  // 💰 ENCONTRAR COLUNA DE ORÇAMENTO
  private static encontrarColunaOrcamento(headers: string[]): number {
    const padroes = [
      /orçamento.*\(r\$\)/i,
      /orcamento.*\(r\$\)/i,
      /orçamento/i,
      /orcamento/i,
      /budget/i,
      /valor.*r\$/i,
      /custo.*r\$/i,
      /preço/i,
      /preco/i
    ]
    
    for (let i = 0; i < headers.length; i++) {
      const header = String(headers[i] || '').toLowerCase().trim()
      
      for (const padrao of padroes) {
        if (padrao.test(header)) {
          console.log(`🎯 Coluna de orçamento encontrada: "${headers[i]}" na posição ${i}`)
          return i
        }
      }
    }
    
    return -1
  }
  
  // 💰 CONVERSÃO ROBUSTA DE MOEDA
  private static conversaoRobustaMoeda(value: any): number | null {
    if (value === null || value === undefined || value === '') {
      return null
    }
    
    // Se já é número válido
    if (typeof value === 'number' && !isNaN(value) && value > 0) {
      return Math.round(value)
    }
    
    // Se é string, fazer limpeza
    if (typeof value === 'string') {
      let cleanValue = value
        .replace(/[R$\s]/g, '')         // Remove R$, espaços
        .replace(/\./g, '')             // Remove pontos de milhares
        .replace(',', '.')              // Vírgula vira ponto decimal
        .trim()
      
      const numValue = parseFloat(cleanValue)
      return (!isNaN(numValue) && numValue > 0) ? Math.round(numValue) : null
    }
    
    return null
  }
  
  // AUXILIARES DE CONVERSÃO
  private static getStringValue(value: any): string | null {
    if (value === null || value === undefined || value === '') return null
    return String(value).trim() || null
  }
  
  private static getNumberValue(value: any): number {
    if (typeof value === 'number') return value
    if (typeof value === 'string') {
      const num = parseFloat(value)
      return isNaN(num) ? 0 : num
    }
    return 0
  }
  
  private static processDate(value: any): string | number {
    if (typeof value === 'number') return value
    if (typeof value === 'string') return value
    if (value instanceof Date) return value.getTime()
    return ''
  }
  
  // 💰 PROCESSAR BASEINVESTIMENTO2025.XLSX
  private static async processarBaseInvestimento(caminhoArquivo: string): Promise<BaseInvestimentoData[]> {
    console.log('💰 Carregando BaseInvestimento2025.xlsx...')
    
    try {
      const response = await fetch(caminhoArquivo)
      if (!response.ok) {
        console.log('⚠️ BaseInvestimento2025.xlsx não encontrado')
        return []
      }
      
      const arrayBuffer = await response.arrayBuffer()
      const workbook = XLSX.read(arrayBuffer, { type: 'array' })
      
      const firstSheet = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[firstSheet]
      
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
        header: 1,
        defval: null
      }) as any[][]
      
      if (jsonData.length < 2) {
        console.log('⚠️ BaseInvestimento vazio')
        return []
      }
      
      const headers = jsonData[0]
      console.log('💰 Headers BaseInvestimento:', headers)
      
      const investimentos: BaseInvestimentoData[] = []
      
      for (let i = 1; i < jsonData.length; i++) {
        const row = jsonData[i]
        
        const investimento: BaseInvestimentoData = {
          ID_Projeto: String(row[0] || ''),
          ProgramaOrcamentario: String(row[1] || ''),
          Descricao: String(row[2] || ''),
          ValorAprovado: Number(row[3]) || 0
        }
        
        if (investimento.ID_Projeto && investimento.ValorAprovado > 0) {
          investimentos.push(investimento)
        }
      }
      
      console.log(`💰 ${investimentos.length} investimentos carregados`)
      return investimentos
      
    } catch (error) {
      console.log('⚠️ Erro ao carregar BaseInvestimento:', error)
      return []
    }
  }
}