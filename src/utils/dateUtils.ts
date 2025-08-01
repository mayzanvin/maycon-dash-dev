// src/utils/dateUtils.ts

/**
 * Converte data do Excel (número serial) para Date JavaScript
 * Excel usa 1900-01-01 como base (número serial 1)
 * JavaScript usa 1970-01-01 como base
 */
export const excelDateToJSDate = (excelDate: number): Date => {
  // Excel considera 1900 como ano bissexto (erro conhecido)
  // Compensação: 25569 = dias entre 1900-01-01 e 1970-01-01
  const jsDate = new Date((excelDate - 25569) * 86400 * 1000)
  return jsDate
}

/**
 * Converte Date JavaScript para número serial do Excel
 */
export const jsDateToExcelDate = (jsDate: Date): number => {
  const msPerDay = 86400 * 1000
  const excelDate = Math.floor(jsDate.getTime() / msPerDay) + 25569
  return excelDate
}

/**
 * Formata data para exibição no formato brasileiro
 */
export const formatDateForDisplay = (excelDate: number): string => {
  if (!excelDate || excelDate <= 0) return 'Não definida'
  
  try {
    const jsDate = excelDateToJSDate(excelDate)
    return jsDate.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  } catch (error) {
    console.warn('Erro ao formatar data:', excelDate, error)
    return 'Data inválida'
  }
}

/**
 * Formata data e hora para timestamp completo
 */
export const formatDateTimeForDisplay = (excelDate: number): string => {
  if (!excelDate || excelDate <= 0) return 'Não definida'
  
  try {
    const jsDate = excelDateToJSDate(excelDate)
    return jsDate.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'America/Boa_Vista'
    })
  } catch (error) {
    console.warn('Erro ao formatar data/hora:', excelDate, error)
    return 'Data inválida'
  }
}

/**
 * Calcula diferença em dias entre duas datas Excel
 */
export const calcularDiferenca = (dataFim: number, dataInicio: number): number => {
  if (!dataFim || !dataInicio || dataFim <= 0 || dataInicio <= 0) return 0
  return Math.round(dataFim - dataInicio)
}

/**
 * Verifica se uma data está no futuro
 */
export const isDataFutura = (excelDate: number): boolean => {
  if (!excelDate || excelDate <= 0) return false
  
  const hoje = new Date()
  const excelHoje = jsDateToExcelDate(hoje)
  return excelDate > excelHoje
}

/**
 * Verifica se uma data está no passado
 */
export const isDataPassada = (excelDate: number): boolean => {
  if (!excelDate || excelDate <= 0) return false
  
  const hoje = new Date()
  const excelHoje = jsDateToExcelDate(hoje)
  return excelDate < excelHoje
}

/**
 * Verifica se uma data é hoje
 */
export const isDataHoje = (excelDate: number): boolean => {
  if (!excelDate || excelDate <= 0) return false
  
  const hoje = new Date()
  const excelHoje = jsDateToExcelDate(hoje)
  return Math.abs(excelDate - excelHoje) < 1 // Menos que 1 dia de diferença
}

/**
 * Obtém data atual no formato Excel
 */
export const getDataAtualExcel = (): number => {
  return jsDateToExcelDate(new Date())
}

/**
 * Formata timestamp do arquivo para exibição
 */
export const formatFileTimestamp = (timestamp: Date | string): string => {
  try {
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp
    
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'America/Boa_Vista'
    })
  } catch (error) {
    console.warn('Erro ao formatar timestamp:', timestamp, error)
    return 'Timestamp inválido'
  }
}

/**
 * Calcula status de atraso baseado em datas
 */
export const calcularStatusAtraso = (
  dataTerminoReal: number, 
  dataTerminoPrevista: number
): {
  status: 'no-prazo' | 'atrasada' | 'adiantada'
  diasDiferenca: number
  texto: string
} => {
  if (!dataTerminoReal || !dataTerminoPrevista) {
    return {
      status: 'no-prazo',
      diasDiferenca: 0,
      texto: 'Datas não definidas'
    }
  }

  const diferenca = calcularDiferenca(dataTerminoReal, dataTerminoPrevista)
  
  if (diferenca > 0) {
    return {
      status: 'atrasada',
      diasDiferenca: diferenca,
      texto: `${diferenca} dias de atraso`
    }
  } else if (diferenca < 0) {
    return {
      status: 'adiantada',
      diasDiferenca: Math.abs(diferenca),
      texto: `${Math.abs(diferenca)} dias adiantada`
    }
  } else {
    return {
      status: 'no-prazo',
      diasDiferenca: 0,
      texto: 'No prazo'
    }
  }
}

/**
 * Gera range de datas para gráficos
 */
export const gerarRangeDatas = (
  dataInicio: number,
  dataFim: number,
  intervaloDias: number = 7
): number[] => {
  const range: number[] = []
  
  if (!dataInicio || !dataFim || dataInicio >= dataFim) return range
  
  for (let data = dataInicio; data <= dataFim; data += intervaloDias) {
    range.push(data)
  }
  
  // Garantir que a data final está incluída
  if (range[range.length - 1] !== dataFim) {
    range.push(dataFim)
  }
  
  return range
}

/**
 * Converte string de data brasileira para Excel
 */
export const parseDataBrasileira = (dataBr: string): number => {
  try {
    // Formatos aceitos: DD/MM/YYYY, DD-MM-YYYY, DD.MM.YYYY
    const limpa = dataBr.replace(/[-\.]/g, '/')
    const partes = limpa.split('/')
    
    if (partes.length === 3) {
      const dia = parseInt(partes[0])
      const mes = parseInt(partes[1]) - 1 // JavaScript usa 0-11 para meses
      const ano = parseInt(partes[2])
      
      const data = new Date(ano, mes, dia)
      
      if (!isNaN(data.getTime())) {
        return jsDateToExcelDate(data)
      }
    }
    
    return 0
  } catch (error) {
    console.warn('Erro ao parsear data brasileira:', dataBr, error)
    return 0
  }
}

/**
 * Valida se uma data Excel é válida
 */
export const isDataExcelValida = (excelDate: number): boolean => {
  // Excel dates válidas estão entre 1 (1900-01-01) e ~2958465 (9999-12-31)
  return typeof excelDate === 'number' && 
         excelDate > 0 && 
         excelDate < 3000000 &&
         !isNaN(excelDate)
}