// src/utils/excelProcessor.ts - MÍNIMA MODIFICAÇÃO: APENAS ADICIONAR AS 5 COLUNAS
import * as XLSX from 'xlsx'
import { DashboardData, BaseObraData, ExcelData, ObraMetrics } from '@/types/obra'

export class ExcelProcessor {
  
  static async processBaseObras(caminhoArquivo: string): Promise<DashboardData> {
    console.log('🔄 Carregando BaseObras.xlsx...')
    console.log('📁 Caminho:', caminhoArquivo)
    
    try {
      const response = await fetch(caminhoArquivo)
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`)
      }
      
      const arrayBuffer = await response.arrayBuffer()
      const workbook = XLSX.read(arrayBuffer, { 
        cellStyles: true,
        cellDates: true 
      })
      
      console.log('📋 Abas encontradas:', workbook.SheetNames)
      
      const sheets: ExcelData = {}
      const sheetNames: string[] = []
      
      for (const sheetName of workbook.SheetNames) {
        if (sheetName === 'Planilha1') continue // Pular aba vazia
        
        console.log(`📊 Processando: ${sheetName}`)
        
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
        
        if (jsonData.length < 2) {
          console.log(`⚠️ Aba ${sheetName} vazia ou sem dados`)
          continue
        }
        
        const headers = jsonData[0] as string[]
        const dataRows = jsonData.slice(1)
        
        console.log(`📝 Colunas detectadas (${headers.length}):`, headers)
        
        // Mapear índices das colunas (incluindo as 5 novas)
        const colIndexes = this.mapearColunas(headers)
        
        // Processar dados com TODAS as colunas
        const processedData: BaseObraData[] = []
        
        for (let i = 0; i < dataRows.length; i++) {
          const row = dataRows[i] as any[]
          
          if (!row || row.length === 0) continue
          
          const tarefa: BaseObraData = {
            EDT: row[colIndexes.edt] || '',
            Nome_da_Tarefa: row[colIndexes.nomeTarefa] || '',
            N_vel: parseInt(row[colIndexes.nivel]) || 0,
            Resumo__pai_: row[colIndexes.resumoPai] || '',
            Marco: row[colIndexes.marco] || undefined,
            Data_In_cio: this.converterData(row[colIndexes.dataInicio]),
            Data_T_rmino: this.converterData(row[colIndexes.dataTermino]),
            __Conclu_do: parseFloat(row[colIndexes.percentual]) || 0,
            LinhaBase_In_cio: this.converterData(row[colIndexes.linhaBaseInicio]),
            LinhaBase_T_rmino: this.converterData(row[colIndexes.linhaBaseTermino]),
            // ✅ ADICIONANDO AS 5 COLUNAS IMPORTANTES
            Predecessoras: row[colIndexes.predecessoras] || undefined,
            Sucessoras: row[colIndexes.sucessoras] || undefined,
            Anotacoes: row[colIndexes.anotacoes] || undefined,
            Nomes_dos_Recursos: row[colIndexes.nomesRecursos] || undefined,
            Coordenada: row[colIndexes.coordenada] || undefined
          }
          
          // Apenas adicionar se tem nome da tarefa
          if (tarefa.Nome_da_Tarefa && tarefa.Nome_da_Tarefa.trim().length > 0) {
            processedData.push(tarefa)
          }
        }
        
        sheets[sheetName] = processedData
        sheetNames.push(sheetName)
        
        console.log(`✅ ${sheetName}: ${processedData.length} tarefas processadas`)
        
        // 🔍 Debug: Verificar energização e coordenadas
        const temEnergizacao = processedData.some(t => 
          t.Nome_da_Tarefa.toLowerCase().includes('energização') ||
          t.Nome_da_Tarefa.toLowerCase().includes('energizacao')
        )
        
        const coordenadas = processedData.filter(t => t.Coordenada && t.Coordenada.toString().trim().length > 0)
        const recursos = processedData.filter(t => t.Nomes_dos_Recursos && t.Nomes_dos_Recursos.toString().trim().length > 0)
        
        console.log(`   ⚡ Energização: ${temEnergizacao ? 'SIM' : 'NÃO'}`)
        console.log(`   📍 Coordenadas: ${coordenadas.length} tarefas`)
        console.log(`   👥 Recursos: ${recursos.length} tarefas`)
      }
      
      // Calcular métricas básicas
      const metrics: ObraMetrics = {
        totalObras: Object.keys(sheets).length,
        obrasConcluidas: 0,
        obrasEmAndamento: Object.keys(sheets).length,
        obrasPendentes: 0,
        valorTotal: 0,
        valorGasto: 0
      }
      
      console.log('✅ Processamento concluído!')
      console.log(`📊 Total: ${metrics.totalObras} obras processadas`)
      
      return {
        sheets,
        metrics,
        sheetNames,
        lastUpdated: new Date().toISOString()  // ✅ CORRIGIDO: Propriedade que faltava
      }
      
    } catch (error) {
      console.error('❌ Erro ao processar BaseObras.xlsx:', error)
      throw error
    }
  }
  
  private static mapearColunas(headers: string[]): { [key: string]: number } {
    const map: { [key: string]: number } = {}
    
    headers.forEach((header, index) => {
      const h = header.toString().toLowerCase().trim()
      
      if (h === 'edt') map.edt = index
      else if (h.includes('nome') && h.includes('tarefa')) map.nomeTarefa = index
      else if (h.includes('nível') || h.includes('nivel')) map.nivel = index
      else if (h.includes('resumo') && h.includes('pai')) map.resumoPai = index
      else if (h === 'marco') map.marco = index
      else if (h.includes('data') && h.includes('início')) map.dataInicio = index
      else if (h.includes('data') && h.includes('término')) map.dataTermino = index
      else if (h.includes('concluído')) map.percentual = index
      else if (h.includes('linhabase') && h.includes('início')) map.linhaBaseInicio = index
      else if (h.includes('linhabase') && h.includes('término')) map.linhaBaseTermino = index
      // ✅ MAPEAMENTO DAS 5 NOVAS COLUNAS
      else if (h === 'predecessoras') map.predecessoras = index
      else if (h === 'sucessoras') map.sucessoras = index
      else if (h === 'anotações' || h === 'anotacoes') map.anotacoes = index
      else if (h.includes('nomes') && h.includes('recursos')) map.nomesRecursos = index
      else if (h === 'coordenada') map.coordenada = index
    })
    
    console.log('🗺️ Mapeamento de colunas:', map)
    return map
  }
  
  private static converterData(valor: any): number {
    if (!valor) return 0
    if (typeof valor === 'number') return valor
    if (valor instanceof Date) return valor.getTime()
    
    // Tentar converter string para data
    if (typeof valor === 'string') {
      const data = new Date(valor)
      return isNaN(data.getTime()) ? 0 : data.getTime()
    }
    
    return 0
  }
}