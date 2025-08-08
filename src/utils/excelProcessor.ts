// src/utils/excelProcessor.ts - CORREÇÃO DOS PROBLEMAS DE TIPAGEM
import * as XLSX from 'xlsx'
import { DashboardData, BaseObraData, ExcelData, BaseInvestimentoData } from '@/types/obra'

export class ExcelProcessor {
  
  static async processBaseObras(caminhoArquivo: string = '/BaseObras.xlsx'): Promise<DashboardData> {
    console.log('📊 === PROCESSAMENTO COM BUSCA INTELIGENTE DE ORÇAMENTO ===')
    
    try {
      const dashboardData = await this.processarBaseObras(caminhoArquivo)
      // 🎯 MUDANÇA: Usar nova função que busca por ano
      const investimentos = await this.processarBaseInvestimentoPorAno('/BaseInvestimento.xlsx')
      
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
            Resumo_pai: this.getStringValue(rowData[3]) || undefined,
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
  
  // 🎯 FUNÇÃO CORRIGIDA: PROCESSAR BASEINVESTIMENTO.XLSX COM TIPAGEM FLEXÍVEL
  private static async processarBaseInvestimentoPorAno(caminhoArquivo: string): Promise<BaseInvestimentoData[]> {
    console.log('💰 === LENDO ARQUIVO REAL: BaseInvestimento.xlsx ===')
    
    try {
      // 1️⃣ CARREGAR ARQUIVO REAL
      const response = await fetch(caminhoArquivo)
      if (!response.ok) {
        console.log(`⚠️ ${caminhoArquivo} não encontrado - usando dados de backup`)
        return this.getDadosBackup()
      }
      
      const arrayBuffer = await response.arrayBuffer()
      const workbook = XLSX.read(arrayBuffer, { type: 'array' })
      
      console.log('📋 Abas disponíveis:', workbook.SheetNames)
      
      // 2️⃣ BUSCAR ABA "2025" DE FORMA FLEXÍVEL
      const anoAtual = new Date().getFullYear().toString()
      let nomeAba: string | undefined = workbook.SheetNames.find(nome => 
        nome === anoAtual || 
        nome === '2025' || 
        nome.includes(anoAtual) || 
        nome.includes('2025')
      )
      
      if (!nomeAba) {
        nomeAba = workbook.SheetNames[0]
        console.log(`⚠️ Aba do ano ${anoAtual} não encontrada, usando: "${nomeAba}"`)
      } else {
        console.log(`✅ Aba encontrada: "${nomeAba}"`)
      }
      
      // 3️⃣ PROCESSAR ABA - CORRIGIDO
      if (!nomeAba) {
        console.log('❌ Nenhuma aba válida encontrada')
        return this.getDadosBackup()
      }
      
      const worksheet = workbook.Sheets[nomeAba]
      if (!worksheet) {
        console.log('❌ Worksheet não encontrada')
        return this.getDadosBackup()
      }
      
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
        header: 1,
        defval: null,
        raw: false
      }) as any[][]
      
      if (jsonData.length < 2) {
        console.log('⚠️ Aba vazia - usando dados de backup')
        return this.getDadosBackup()
      }
      
      console.log('📋 Headers:', jsonData[0])
      console.log(`📊 Processando ${jsonData.length - 1} linhas de dados`)
      
      // 4️⃣ EXTRAIR DADOS REAIS
      const investimentos: BaseInvestimentoData[] = []
      
      for (let i = 1; i < jsonData.length; i++) {
        const row = jsonData[i]
        
        if (!row || row.length < 4) continue
        
        const idProjeto = String(row[0] || '').trim()
        const programa = String(row[1] || '').trim()
        const descricao = String(row[2] || '').trim()
        const valorBruto = row[3]
        
        // Converter valor para número
        let valorAprovado = 0
        if (typeof valorBruto === 'number') {
          valorAprovado = valorBruto
        } else if (typeof valorBruto === 'string') {
          const valorLimpo = valorBruto
            .replace(/[R$\s]/g, '')
            .replace(/\./g, '')
            .replace(',', '.')
          valorAprovado = parseFloat(valorLimpo) || 0
        }
        
        if (idProjeto && valorAprovado > 0) {
          const investimento: BaseInvestimentoData = {
            ID_Projeto: idProjeto,
            ProgramaOrcamentario: programa,
            Descricao: descricao || 'Sem descrição',
            ValorAprovado: valorAprovado
          }
          
          investimentos.push(investimento)
          
          // Debug dos primeiros registros
          if (investimentos.length <= 5) {
            console.log(`💰 ${investimentos.length}. "${idProjeto}" = R$ ${valorAprovado.toLocaleString()}`)
          }
        }
      }
      
      console.log(`✅ SUCESSO: ${investimentos.length} investimentos carregados do arquivo real`)
      return investimentos
      
    } catch (error) {
      console.log('❌ Erro ao ler arquivo real:', error)
      console.log('📦 Usando dados de backup')
      return this.getDadosBackup()
    }
  }
  
  // 🔒 DADOS DE BACKUP (caso o arquivo não funcione)
  private static getDadosBackup(): BaseInvestimentoData[] {
    return [
      {
        ID_Projeto: 'DTE-02',
        ProgramaOrcamentario: 'R200_DTE0001',
        Descricao: 'LD - Construção LD PV-CE para SE Paraviana 69kV, 11km',
        ValorAprovado: 13558526.542
      },
      {
        ID_Projeto: 'DTE-28',
        ProgramaOrcamentario: 'R200_DTE0003', 
        Descricao: 'SED - Ampliação SECE - 1 EL 69KV - LD PVCE C1 69KV',
        ValorAprovado: 3981419.566
      },
      {
        ID_Projeto: 'DTE-29',
        ProgramaOrcamentario: 'R200_DTE0004',
        Descricao: 'SED - Construção da SE Paraviana - 1EL 69kV, 2TR 69/13,8kV',
        ValorAprovado: 22976890.393
      },
      {
        ID_Projeto: 'DTE-31',
        ProgramaOrcamentario: 'R200_DTE0020',
        Descricao: 'SED - Retrofit 87L (implementar proteção de linha)',
        ValorAprovado: 387532
      },
      {
        ID_Projeto: 'DTE-24',
        ProgramaOrcamentario: 'R200_DTE0010',
        Descricao: 'SED - Ampliação da SE Rorainópolis - 1 TR 69/34,5kV',
        ValorAprovado: 14183070.659
      },
      {
        ID_Projeto: 'DTE-27',
        ProgramaOrcamentario: 'R200_DTE0013',
        Descricao: 'SED - Ampliação SESC 69/34,5/13,8 kV',
        ValorAprovado: 6455044.657
      }
    ]
  }
}