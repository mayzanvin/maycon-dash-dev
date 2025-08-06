// src/utils/excelProcessor.ts - CORREÇÃO EXTRAÇÃO ORÇAMENTO
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
        headers[col] = cell ? String(cell.v || '').trim() : ''
      }
      
      console.log('📋 HEADERS ENCONTRADOS:')
      headers.forEach((header, index) => {
        if (header) {
          console.log(`   ${index}: "${header}"`)
        }
      })
      
      // 🔍 BUSCA INTELIGENTE DA COLUNA ORÇAMENTO
      let posicaoOrcamento = -1
      const padroesBusca = [
        'orçamento (r$)',
        'orçamento',
        'orcamento',
        'orçamento (r)',
        'valor (r$)',
        'valor',
        'custo',
        'budget'
      ]
      
      for (let i = 0; i < headers.length; i++) {
        const headerLower = headers[i].toLowerCase()
        if (padroesBusca.some(padrao => headerLower.includes(padrao))) {
          posicaoOrcamento = i
          console.log(`✅ COLUNA ORÇAMENTO ENCONTRADA: Posição ${i} - "${headers[i]}"`)
          break
        }
      }
      
      if (posicaoOrcamento === -1) {
        console.log('⚠️ Coluna de orçamento não encontrada - tentando posição 15 como fallback')
        if (totalCols > 15) {
          posicaoOrcamento = 15
          console.log(`🔄 Usando posição 15: "${headers[15] || 'Sem nome'}"`)
        }
      }
      
      const tarefasAba: BaseObraData[] = []
      let valoresOrcamentoEncontrados = 0
      let exemplosMostrados = 0
      
      // Processar linhas de dados
      for (let row = 1; row < totalRows; row++) {
        try {
          // Extrair dados da linha
          const rowData: any[] = []
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
          
          // Criar objeto BaseObraData
          const tarefa: BaseObraData = {
            EDT: this.getStringValue(rowData[0]) || `${sheetName}_${row}`,
            Nome_da_Tarefa: this.getStringValue(rowData[1]) || '',
            N_vel: this.getNumberValue(rowData[2]) || 0,
            Resumo_pai: this.getStringValue(rowData[3]) || null,
            Marco: this.getStringValue(rowData[4]) || null,
            Data_In_cio: this.processDate(rowData[5]) || '',
            Data_T_rmino: this.processDate(rowData[6]) || '',
            Porcentagem_Conclu_do: this.getNumberValue(rowData[7]) || 0,
            LinhaBase_In_cio: this.processDate(rowData[8]) || '',
            LinhaBase_T_rmino: this.processDate(rowData[9]) || '',
            Predecessoras: this.getStringValue(rowData[10]) || null,
            Sucessoras: this.getStringValue(rowData[11]) || null,
            Anota_es: this.getStringValue(rowData[12]) || null,
            Nomes_dos_Recursos: this.getStringValue(rowData[13]) || null,
            Coordenada: this.getStringValue(rowData[14]) || null,
            Orcamento_R: orcamentoValue, // ⭐ VALOR CORRIGIDO
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
      
      console.log(`✅ Processamento concluído:`)
      console.log(`   📊 Tarefas válidas: ${tarefasAba.length}`)
      console.log(`   💰 Com orçamento > 0: ${valoresOrcamentoEncontrados}`)
      
      if (valoresOrcamentoEncontrados > 0) {
        const valorTotal = tarefasAba
          .filter(t => t.Orcamento_R && t.Orcamento_R > 0)
          .reduce((acc, t) => acc + (t.Orcamento_R || 0), 0)
        console.log(`   💰 Valor total da aba: R$ ${valorTotal.toLocaleString()}`)
      }
    }
    
    return {
      todasTarefas,
      obrasPorAba,
      ultimaAtualizacao: new Date().toISOString()
    }
  }
  
  // 💰 CONVERSÃO ROBUSTA DE VALORES MONETÁRIOS
  private static conversaoRobustaMoeda(value: any): number | null {
    if (value === null || value === undefined || value === '') {
      return null
    }
    
    // Se já é um número válido
    if (typeof value === 'number' && !isNaN(value) && value > 0) {
      return value
    }
    
    // Se é string, fazer limpeza progressiva
    if (typeof value === 'string') {
      let cleanValue = value
        .replace(/[R$\s]/g, '')           // Remove R$, espaços
        .replace(/\./g, '')               // Remove pontos (separadores de milhares)
        .replace(',', '.')                // Troca vírgula por ponto decimal
        .trim()
      
      // Tentar conversão
      let num = Number(cleanValue)
      if (!isNaN(num) && num > 0) {
        return num
      }
      
      // Tentar sem remover pontos (caso seja decimal americano)
      cleanValue = value
        .replace(/[R$\s]/g, '')
        .trim()
      
      num = Number(cleanValue)
      if (!isNaN(num) && num > 0) {
        return num
      }
    }
    
    // Última tentativa: conversão direta
    const directNum = Number(value)
    if (!isNaN(directNum) && directNum > 0) {
      return directNum
    }
    
    return null
  }
  
  // 💰 PROCESSAR BASEINVESTIMENTO2025.XLSX
  private static async processarBaseInvestimento(caminhoArquivo: string): Promise<BaseInvestimentoData[]> {
    try {
      console.log('\n💰 === PROCESSANDO BASEINVESTIMENTO2025.XLSX ===')
      
      const response = await fetch(caminhoArquivo)
      if (!response.ok) {
        console.log('⚠️ BaseInvestimento2025.xlsx não encontrado - continuando sem dados de investimento')
        return []
      }
      
      const arrayBuffer = await response.arrayBuffer()
      const workbook = XLSX.read(arrayBuffer, { type: 'array', cellDates: true })
      
      const firstSheet = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[firstSheet]
      
      // Converter usando método robusto
      const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1')
      const totalRows = range.e.r + 1
      
      console.log(`📊 BaseInvestimento: ${totalRows} linhas`)
      
      const investimentos: BaseInvestimentoData[] = []
      
      for (let row = 1; row < totalRows; row++) {
        try {
          const rowData: any[] = []
          for (let col = 0; col <= 3; col++) { // Só precisamos de 4 colunas
            const cellAddr = XLSX.utils.encode_cell({ r: row, c: col })
            const cell = worksheet[cellAddr]
            rowData[col] = cell ? cell.v : null
          }
          
          const investimento: BaseInvestimentoData = {
            ID_Projeto: this.getStringValue(rowData[0]) || '',
            ProgramaOrcamentario: this.getStringValue(rowData[1]) || '',
            Descricao: this.getStringValue(rowData[2]) || '',
            ValorAprovado: this.conversaoRobustaMoeda(rowData[3]) || 0
          }
          
          if (investimento.ID_Projeto && investimento.ID_Projeto.trim() !== '') {
            investimentos.push(investimento)
          }
          
        } catch (error) {
          console.log(`⚠️ Erro linha ${row + 1} BaseInvestimento:`, error)
        }
      }
      
      console.log(`✅ BaseInvestimento processado: ${investimentos.length} registros`)
      
      // Mostrar alguns exemplos
      console.log('💰 Exemplos de investimentos:')
      investimentos.slice(0, 3).forEach((inv, i) => {
        console.log(`   ${i + 1}. ${inv.ID_Projeto} | ${inv.ProgramaOrcamentario} | R$ ${inv.ValorAprovado.toLocaleString()}`)
      })
      
      return investimentos
      
    } catch (error) {
      console.error('❌ Erro ao processar BaseInvestimento:', error)
      return []
    }
  }
  
  // 🔧 UTILITÁRIOS ROBUSTOS
  private static getStringValue(value: any): string | null {
    if (value === null || value === undefined || value === '') {
      return null
    }
    return String(value).trim()
  }
  
  private static getNumberValue(value: any): number {
    if (value === null || value === undefined || value === '') {
      return 0
    }
    
    const num = Number(value)
    return isNaN(num) ? 0 : num
  }
  
  private static processDate(value: any): string | number {
    if (value === null || value === undefined || value === '') {
      return ''
    }
    
    if (value instanceof Date) {
      return value.getTime()
    }
    
    if (typeof value === 'number' && value > 0) {
      return value
    }
    
    if (typeof value === 'string') {
      const date = new Date(value)
      if (!isNaN(date.getTime())) {
        return date.getTime()
      }
    }
    
    return ''
  }
}