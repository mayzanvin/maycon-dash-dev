// src/utils/excelProcessor.ts - ACESSO DIRETO SEM FILE API
import * as XLSX from 'xlsx'
import { DashboardData, BaseObraData, ExcelData, ObraMetrics } from '@/types/obra'

export class ExcelProcessor {
  
  static async processBaseObras(caminhoArquivo: string): Promise<DashboardData> {
    console.log('🔄 Tentando acessar arquivo diretamente...')
    console.log('📁 Caminho:', caminhoArquivo)
    
    let workbook: XLSX.WorkBook | null = null
    let metodoUsado = ''
    
    // ✅ MÉTODO 1: Fetch com diferentes variações de caminho
    try {
      console.log('🔍 Tentativa 1: Fetch direto...')
      workbook = await this.lerViaFetchDireto(caminhoArquivo)
      metodoUsado = 'Fetch Direto'
    } catch (error1) {
      console.warn('❌ Método 1 falhou:', error1)
      
      // ✅ MÉTODO 2: APIs Node.js/Electron (ambiente desktop)
      try {
        console.log('🔍 Tentativa 2: APIs do sistema...')
        workbook = await this.lerViaSistema(caminhoArquivo)
        metodoUsado = 'APIs Sistema'
      } catch (error2) {
        console.warn('❌ Método 2 falhou:', error2)
        
        // ✅ MÉTODO 3: Proxy local (se estiver configurado)
        try {
          console.log('🔍 Tentativa 3: Proxy local...')
          workbook = await this.lerViaProxy(caminhoArquivo)
          metodoUsado = 'Proxy Local'
        } catch (error3) {
          console.warn('❌ Método 3 falhou:', error3)
          
          console.error('❌ Todos os métodos diretos falharam:', { error1, error2, error3 })
          
          throw new Error(`Não foi possível acessar automaticamente o BaseObras.xlsx.

🔧 SOLUÇÕES DISPONÍVEIS:

1. 🖥️ ELECTRON APP: Use a versão desktop para acesso total
2. 🌐 SERVIDOR LOCAL: Execute um servidor web local
3. 📁 COPY TO PUBLIC: Copie o arquivo para a pasta public/
4. 🔗 ENDPOINT API: Configure um endpoint que serve o arquivo

PROBLEMA: Navegadores bloqueiam acesso direto a arquivos locais por segurança.

DETALHES TÉCNICOS:
- Fetch: ${error1}
- Sistema: ${error2}  
- Proxy: ${error3}`)
        }
      }
    }
    
    if (!workbook) {
      throw new Error('Nenhum método conseguiu carregar o workbook')
    }
    
    console.log(`✅ Arquivo carregado via ${metodoUsado}!`)
    return this.processarWorkbook(workbook)
  }
  
  // MÉTODO 1: Fetch direto com múltiplas variações
  private static async lerViaFetchDireto(caminhoArquivo: string): Promise<XLSX.WorkBook> {
    // Converter caminho Windows para diferentes formatos
    const caminhoOriginal = caminhoArquivo
    const caminhoUnix = caminhoArquivo.replace(/\\/g, '/')
    const caminhoEncoded = encodeURI(caminhoUnix)
    
    const tentativas = [
      // Protocolo file://
      `file:///${caminhoUnix}`,
      `file://${caminhoUnix}`,
      // HTTP local (se servidor estiver rodando)
      `/files/${caminhoUnix.split('/').pop()}`,
      `http://localhost:3000/files/${caminhoUnix.split('/').pop()}`,
      `http://localhost:5173/files/${caminhoUnix.split('/').pop()}`,
      // Caminho direto
      caminhoOriginal,
      caminhoUnix,
      caminhoEncoded,
      // Public folder (Vite)
      `/public/BaseObras.xlsx`,
      `/BaseObras.xlsx`,
      `./BaseObras.xlsx`
    ]
    
    for (const [index, url] of tentativas.entries()) {
      try {
        console.log(`🔍 Fetch tentativa ${index + 1}: ${url}`)
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel'
          }
        })
        
        if (response.ok) {
          const arrayBuffer = await response.arrayBuffer()
          console.log(`✅ Sucesso com: ${url}`)
          return XLSX.read(arrayBuffer, { type: 'array' })
        } else {
          console.warn(`❌ HTTP ${response.status} para: ${url}`)
        }
        
      } catch (error) {
        console.warn(`❌ Erro fetch ${index + 1}:`, error)
      }
    }
    
    throw new Error('Todas as tentativas de fetch falharam')
  }
  
  // MÉTODO 2: APIs do sistema (Node.js/Electron)
  private static async lerViaSistema(caminhoArquivo: string): Promise<XLSX.WorkBook> {
    // Tentar Electron primeiro
    if (typeof window !== 'undefined' && (window as any).electronAPI) {
      try {
        console.log('🔍 Tentando via Electron...')
        const electronAPI = (window as any).electronAPI
        const result = await electronAPI.readFile(caminhoArquivo)
        
        if (result.success) {
          return XLSX.read(result.data, { type: 'buffer' })
        } else {
          throw new Error(result.error)
        }
      } catch (error) {
        console.warn('❌ Electron falhou:', error)
      }
    }
    
    // Tentar Node.js APIs
    if (typeof require !== 'undefined') {
      try {
        console.log('🔍 Tentando via Node.js...')
        const fs = require('fs')
        const path = require('path')
        
        const caminhoResolvido = path.resolve(caminhoArquivo)
        
        if (fs.existsSync(caminhoResolvido)) {
          const buffer = fs.readFileSync(caminhoResolvido)
          return XLSX.read(buffer, { type: 'buffer' })
        } else {
          throw new Error(`Arquivo não encontrado: ${caminhoResolvido}`)
        }
      } catch (error) {
        console.warn('❌ Node.js falhou:', error)
      }
    }
    
    throw new Error('APIs do sistema não disponíveis (não é Electron nem Node.js)')
  }
  
  // MÉTODO 3: Proxy local (para desenvolvimento)
  private static async lerViaProxy(caminhoArquivo: string): Promise<XLSX.WorkBook> {
    const endpoints = [
      // Endpoints comuns de desenvolvimento
      `http://localhost:3001/api/file?path=${encodeURIComponent(caminhoArquivo)}`,
      `http://localhost:8080/files/${encodeURIComponent(caminhoArquivo)}`,
      `/api/excel?file=${encodeURIComponent(caminhoArquivo)}`,
      `/proxy/file?path=${encodeURIComponent(caminhoArquivo)}`
    ]
    
    for (const endpoint of endpoints) {
      try {
        console.log(`🔍 Tentando proxy: ${endpoint}`)
        
        const response = await fetch(endpoint)
        
        if (response.ok) {
          const arrayBuffer = await response.arrayBuffer()
          return XLSX.read(arrayBuffer, { type: 'array' })
        }
        
      } catch (error) {
        console.warn(`❌ Proxy falhou: ${endpoint}`, error)
      }
    }
    
    throw new Error('Nenhum proxy local respondeu')
  }
  
  // Processar workbook carregado (igual ao anterior)
  private static async processarWorkbook(workbook: XLSX.WorkBook): Promise<DashboardData> {
    try {
      console.log('📋 Abas encontradas:', workbook.SheetNames)
      
      const abasValidas = this.detectarAbasValidas(workbook.SheetNames)
      console.log('🎯 Abas válidas detectadas:', abasValidas.map(a => a.nome))

      const sheets: ExcelData = {}
      const sheetNames: string[] = []

      for (const infoAba of abasValidas) {
        try {
          console.log(`📊 Processando: ${infoAba.nome}`)
          
          const dadosProcessados = this.processarAbaDinamica(workbook, infoAba.nome)
          
          if (dadosProcessados.length > 0) {
            sheets[infoAba.nome] = dadosProcessados
            sheetNames.push(infoAba.nome)
            console.log(`✅ ${infoAba.nome}: ${dadosProcessados.length} tarefas processadas`)
          } else {
            console.warn(`⚠️ ${infoAba.nome}: Nenhuma tarefa encontrada`)
          }
          
        } catch (error) {
          console.warn(`⚠️ Erro ao processar ${infoAba.nome}:`, error)
        }
      }

      const metrics = this.calcularMetricas(sheets)
      
      console.log('📊 Resumo do processamento:', {
        abasProcessadas: sheetNames.length,
        totalTarefas: Object.values(sheets).reduce((sum, aba) => sum + aba.length, 0),
        metrics
      })

      return {
        sheets,
        metrics,
        sheetNames
      }

    } catch (error) {
      console.error('❌ Erro crítico no processamento:', error)
      throw new Error(`Falha ao processar Excel: ${error}`)
    }
  }
  
  // Métodos auxiliares (iguais ao anterior)
  private static detectarAbasValidas(nomesDasAbas: string[]): Array<{nome: string, tipo: 'fiscalizacao' | 'execucao'}> {
    const abasValidas: Array<{nome: string, tipo: 'fiscalizacao' | 'execucao'}> = []
    
    for (const nomeAba of nomesDasAbas) {
      if (nomeAba === 'Planilha1' || nomeAba === 'Sheet1' || nomeAba === 'Plan1') {
        continue
      }
      
      let tipo: 'fiscalizacao' | 'execucao' | null = null
      
      if (nomeAba.endsWith(' - F')) {
        tipo = 'fiscalizacao'
      } else if (nomeAba.endsWith(' - E')) {
        tipo = 'execucao'
      } else if (nomeAba.toLowerCase().includes('fiscaliz')) {
        tipo = 'fiscalizacao'
      } else if (nomeAba.toLowerCase().includes('execu')) {
        tipo = 'execucao'
      } else if (/[A-Z]{3,4}_RRE-\d{3}-\d{6}-\d-CR/i.test(nomeAba)) {
        tipo = 'fiscalizacao'
      }
      
      if (tipo) {
        abasValidas.push({ nome: nomeAba, tipo })
        console.log(`✅ Aba detectada: ${nomeAba} (${tipo})`)
      } else {
        console.warn(`❓ Aba não reconhecida: ${nomeAba}`)
      }
    }
    
    return abasValidas
  }

  private static processarAbaDinamica(workbook: XLSX.WorkBook, nomeAba: string): BaseObraData[] {
    const worksheet = workbook.Sheets[nomeAba]
    const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet)
    
    if (jsonData.length === 0) {
      console.warn(`⚠️ Aba ${nomeAba} está vazia`)
      return []
    }
    
    const primeiraLinha = jsonData[0]
    const colunas = Object.keys(primeiraLinha)
    console.log(`🔍 Colunas detectadas em ${nomeAba}:`, colunas)
    
    const mapeamento = this.mapearColunas(colunas)
    console.log(`🗺️ Mapeamento para ${nomeAba}:`, mapeamento)
    
    const dadosProcessados: BaseObraData[] = []
    
    for (const linha of jsonData) {
      const nomeTarefa = linha[mapeamento.nomeTarefa]
      if (!nomeTarefa || String(nomeTarefa).trim() === '') {
        continue
      }
      
      try {
        const dadosLinha: BaseObraData = {
          EDT: linha[mapeamento.edt] || '',
          Nome_da_Tarefa: String(nomeTarefa).trim(),
          N_vel: Number(linha[mapeamento.nivel] || 0),
          Resumo__pai_: String(linha[mapeamento.resumoPai] || '').trim(),
          Data_In_cio: this.processarData(linha[mapeamento.dataInicio]),
          Data_T_rmino: this.processarData(linha[mapeamento.dataTermino]),
          __Conclu_do: Number(linha[mapeamento.percentual] || 0),
          LinhaBase_In_cio: this.processarData(linha[mapeamento.linhaBaseInicio]) || 'ND',
          LinhaBase_T_rmino: this.processarData(linha[mapeamento.linhaBaseTermino]) || 'ND'
        }
        
        dadosProcessados.push(dadosLinha)
        
      } catch (error) {
        console.warn(`⚠️ Erro ao processar linha em ${nomeAba}:`, error, linha)
      }
    }
    
    return dadosProcessados
  }

  private static mapearColunas(nomesColunas: string[]): {[key: string]: string} {
    const mapeamento: {[key: string]: string} = {
      edt: '',
      nomeTarefa: '',
      nivel: '',
      resumoPai: '',
      dataInicio: '',
      dataTermino: '',
      percentual: '',
      linhaBaseInicio: '',
      linhaBaseTermino: ''
    }
    
    for (const nomeColuna of nomesColunas) {
      const normalizado = nomeColuna.toLowerCase().replace(/[^a-zA-Z]/g, '')
      
      if (/^edt|^wbs|^eap/.test(normalizado)) {
        mapeamento.edt = nomeColuna
      }
      else if (/nomedatarefa|taskname|tarefa/.test(normalizado)) {
        mapeamento.nomeTarefa = nomeColuna
      }
      else if (/nivel|level|outline/.test(normalizado)) {
        mapeamento.nivel = nomeColuna
      }
      else if (/resumopai|summary|parent/.test(normalizado)) {
        mapeamento.resumoPai = nomeColuna
      }
      else if (/datainicio|start|begin/.test(normalizado)) {
        mapeamento.dataInicio = nomeColuna
      }
      else if (/datatermino|finish|end/.test(normalizado)) {
        mapeamento.dataTermino = nomeColuna
      }
      else if (/concluido|complete|progress/.test(normalizado)) {
        mapeamento.percentual = nomeColuna
      }
      else if (/linhabaseinicio|baselinestart/.test(normalizado)) {
        mapeamento.linhaBaseInicio = nomeColuna
      }
      else if (/linhabasetermino|baselinefinish/.test(normalizado)) {
        mapeamento.linhaBaseTermino = nomeColuna
      }
    }
    
    return mapeamento
  }

  private static processarData(valor: any): number {
    if (typeof valor === 'number' && valor > 1 && valor < 100000) {
      return valor
    }
    
    if (valor instanceof Date) {
      return Math.floor(valor.getTime() / 86400000) + 25569
    }
    
    if (typeof valor === 'string' && valor.trim() !== '' && valor !== 'ND') {
      const parsed = parseFloat(valor)
      if (!isNaN(parsed) && parsed > 1 && parsed < 100000) {
        return parsed
      }
    }
    
    return 0
  }

  private static calcularMetricas(sheets: ExcelData): ObraMetrics {
    const abasCount = Object.keys(sheets).length
    let totalTarefas = 0
    let tarefasConcluidas = 0
    
    Object.values(sheets).forEach(aba => {
      totalTarefas += aba.length
      tarefasConcluidas += aba.filter(tarefa => tarefa.__Conclu_do >= 100).length
    })
    
    const percentualGeral = totalTarefas > 0 ? (tarefasConcluidas / totalTarefas) * 100 : 0
    
    return {
      totalObras: Math.max(1, Math.ceil(abasCount / 2)),
      obrasConcluidas: Math.floor(percentualGeral / 100 * Math.ceil(abasCount / 2)),
      obrasEmAndamento: Math.ceil(abasCount / 2) - Math.floor(percentualGeral / 100 * Math.ceil(abasCount / 2)),
      obrasPendentes: 0,
      valorTotal: 0,
      valorGasto: 0
    }
  }
}