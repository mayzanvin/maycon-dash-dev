// src/utils/excelProcessor.ts - MAPEAMENTO CORRETO PARA OS CABEÇALHOS REAIS
import * as XLSX from 'xlsx'
import { DashboardData, BaseObraData, ExcelData } from '@/types/obra'

export class ExcelProcessor {
  
  static async processBaseObras(caminhoArquivo: string): Promise<DashboardData> {
    console.log('📊 Iniciando processamento do BaseObras.xlsx...')
    console.log('📁 Caminho:', caminhoArquivo)
    
    try {
      // 1. BUSCAR ARQUIVO
      console.log('🔍 Buscando arquivo...')
      const response = await fetch(caminhoArquivo)
      
      if (!response.ok) {
        throw new Error(`Arquivo não encontrado: ${response.status} - ${response.statusText}`)
      }
      
      console.log('✅ Arquivo encontrado, processando...')
      
      // 2. LER ARQUIVO EXCEL
      const arrayBuffer = await response.arrayBuffer()
      const workbook = XLSX.read(arrayBuffer, { type: 'array', cellDates: true })
      
      console.log('📋 Abas disponíveis:', workbook.SheetNames)
      
      if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
        throw new Error('Nenhuma aba encontrada no arquivo Excel')
      }
      
      // 3. PROCESSAR CADA ABA
      const obrasPorAba: ExcelData = {}
      const todasTarefas: BaseObraData[] = []
      
      for (const sheetName of workbook.SheetNames) {
        console.log(`📄 Processando aba: ${sheetName}`)
        
        // Pular aba "Planilha1" se for vazia
        if (sheetName === 'Planilha1') {
          console.log(`⚠️ Pulando aba Planilha1...`)
          continue
        }
        
        try {
          const worksheet = workbook.Sheets[sheetName]
          if (!worksheet) {
            console.log(`⚠️ Aba ${sheetName} está vazia, pulando...`)
            continue
          }
          
          // ✅ USAR CABEÇALHOS REAIS DO EXCEL
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
            header: 1,
            defval: '',
            blankrows: false,
            raw: false // Para converter datas automaticamente
          })
          
          if (!jsonData || jsonData.length < 2) {
            console.log(`⚠️ Aba ${sheetName} não tem dados suficientes, pulando...`)
            continue
          }
          
          // Primeira linha são os headers REAIS
          const headers = jsonData[0] as string[]
          const rows = jsonData.slice(1) as any[][]
          
          console.log(`📊 Headers REAIS da aba ${sheetName}:`, headers)
          console.log(`📊 Total de linhas: ${rows.length}`)
          
          // ✅ MAPEAR CORRETAMENTE PARA BaseObraData
          const tarefasAba: BaseObraData[] = []
          
          rows.forEach((row, index) => {
            if (!row || row.length === 0) return
            
            try {
              // ✅ MAPEAR USANDO OS CABEÇALHOS REAIS
              const tarefa: BaseObraData = {
                EDT: this.getValue(row[0]) || `${sheetName}_${index}`,
                Nome_da_Tarefa: this.getValue(row[1]) || '', // "Nome da Tarefa"
                N_vel: this.getNumberValue(row[2]) || 0,      // "Nível"
                Resumo_pai: this.getValue(row[3]) || '',      // "Resumo (pai)" - NOME REAL DA OBRA!
                Data_In_cio: this.processDate(row[5]) || '',   // "Data Início"
                Data_T_rmino: this.processDate(row[6]) || '',  // "Data Término"
                Porcentagem_Conclu_do: this.getNumberValue(row[7]) || 0, // "% Concluído"
                LinhaBase_In_cio: this.processDate(row[8]) || '', // "LinhaBase Início"
                LinhaBase_T_rmino: this.processDate(row[9]) || '', // "LinhaBase Término"
                
                // ✅ COLUNAS ADICIONAIS (posições corretas)
                Predecessoras: this.getValue(row[10]) || null,    // "Predecessoras"
                Sucessoras: this.getValue(row[11]) || null,       // "Sucessoras"
                Marco: this.getValue(row[4]) || null,             // "Marco" (posição 4!)
                Anota_es: this.getValue(row[12]) || null,         // "Anotações"
                Nomes_dos_Recursos: this.getValue(row[13]) || null, // "Nomes dos Recursos"
                Coordenada: this.getValue(row[14]) || null,       // "Coordenada"
                _aba: sheetName
              }
              
              // Só adicionar se tem nome da tarefa
              if (tarefa.Nome_da_Tarefa && tarefa.Nome_da_Tarefa.trim() !== '') {
                tarefasAba.push(tarefa)
                todasTarefas.push(tarefa)
              }
              
            } catch (error) {
              console.log(`⚠️ Erro ao processar linha ${index + 2} da aba ${sheetName}:`, error)
            }
          })
          
          obrasPorAba[sheetName] = tarefasAba
          console.log(`✅ Aba ${sheetName} processada: ${tarefasAba.length} tarefas válidas`)
          
          // ✅ DEBUG: Mostrar primeira tarefa para verificar mapeamento
          if (tarefasAba.length > 0) {
            const primeira = tarefasAba[0]
            console.log(`📝 Primeira tarefa da aba ${sheetName}:`)
            console.log(`   Nome: ${primeira.Nome_da_Tarefa}`)
            console.log(`   Resumo (pai): ${primeira.Resumo_pai}`)
            console.log(`   Nível: ${primeira.N_vel}`)
            console.log(`   % Concluído: ${primeira.Porcentagem_Conclu_do}`)
            console.log(`   Marco: ${primeira.Marco}`)
          }
          
        } catch (error) {
          console.error(`❌ Erro ao processar aba ${sheetName}:`, error)
        }
      }
      
      console.log(`🎯 Processamento concluído!`)
      console.log(`📊 Total de tarefas: ${todasTarefas.length}`)
      console.log(`📋 Abas processadas: ${Object.keys(obrasPorAba).length}`)
      
      if (todasTarefas.length === 0) {
        throw new Error('Nenhuma tarefa válida encontrada no arquivo Excel')
      }
      
      return {
        todasTarefas,
        obrasPorAba,
        ultimaAtualizacao: new Date().toISOString()
      }
      
    } catch (error) {
      console.error('❌ Erro no processamento:', error)
      throw new Error(`Falha ao processar Excel: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
    }
  }
  
  // 🔧 UTILITÁRIOS PARA PROCESSAR VALORES
  private static getValue(value: any): string | null {
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
  
  // ✅ PROCESSAR DATAS CORRETAMENTE
  private static processDate(value: any): string | number {
    if (value === null || value === undefined || value === '') {
      return ''
    }
    
    // Se já é uma data JavaScript (XLSX converteu)
    if (value instanceof Date) {
      return value.getTime()
    }
    
    // Se é um número (data serial do Excel)
    if (typeof value === 'number' && value > 0) {
      return value
    }
    
    // Se é string, tentar converter
    if (typeof value === 'string') {
      const date = new Date(value)
      if (!isNaN(date.getTime())) {
        return date.getTime()
      }
    }
    
    return ''
  }
}