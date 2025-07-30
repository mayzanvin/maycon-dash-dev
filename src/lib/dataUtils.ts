import { BaseObraData, ExcelData } from '@/types/obra'

export const convertRawDataToBaseObraData = (rawData: any): BaseObraData[] => {
  if (!Array.isArray(rawData)) return []
  
  return rawData.map((item: any): BaseObraData => ({
    EDT: item.EDT || item.edt || '',
    Nome_da_Tarefa: item['Nome da Tarefa'] || item.Nome_da_Tarefa || '',
    N_vel: item['Nível'] || item.N_vel || 1,
    Resumo__pai_: item['Resumo (pai)'] || item.Resumo__pai_ || '',
    Data_In_cio: item['Data Início'] || item.Data_In_cio || 0,
    Data_T_rmino: item['Data Término'] || item.Data_T_rmino || 0,
    __Conclu_do: item['% Concluído'] || item.__Conclu_do || 0,
    LinhaBase_In_cio: item['LinhaBase Início'] || item.LinhaBase_In_cio || 0,
    LinhaBase_T_rmino: item['LinhaBase Término'] || item.LinhaBase_T_rmino || 0
  }))
}

export const convertExcelDataToTypedData = (rawData: any): ExcelData => {
  const result: ExcelData = {}
  
  if (typeof rawData === 'object' && rawData !== null) {
    Object.entries(rawData).forEach(([sheetName, sheetData]) => {
      result[sheetName] = convertRawDataToBaseObraData(sheetData)
    })
  }
  
  return result
}