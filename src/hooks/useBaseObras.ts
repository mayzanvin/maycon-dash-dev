// src/hooks/useBaseObras.ts - SEM VARIÁVEIS NÃO UTILIZADAS
import { useState, useEffect, useCallback } from 'react'
import { DashboardData } from '@/types/obra'
import { DashboardUnificadoType } from '@/types/obra-unificada'
import { ExcelProcessor } from '@/utils/excelProcessor'
import { DataAdapter } from '@/utils/dataAdapter'

interface UseBaseObrasReturn {
  data: DashboardUnificadoType | null
  loading: boolean
  error: string | null
  refreshData: () => Promise<void>
}

export function useBaseObras(): UseBaseObrasReturn {
  const [data, setData] = useState<DashboardUnificadoType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Caminho do arquivo BaseObras.xlsx
  const CAMINHO_BASE_OBRAS = '/BaseObras.xlsx'
  
  const carregarDados = useCallback(async () => {
    console.log('🔄 Iniciando carregamento dos dados...')
    setLoading(true)
    setError(null)
    
    try {
      // 1. Processar Excel
      console.log('📋 Processando BaseObras.xlsx...')
      const dashboardData: DashboardData = await ExcelProcessor.processBaseObras(CAMINHO_BASE_OBRAS)
      
      // 2. Converter para estrutura unificada
      console.log('🔄 Convertendo para dashboard unificado...')
      const dashboardUnificado = DataAdapter.convertToDashboardUnificado(dashboardData)
      
      // 3. Logs informativos - ✅ USAR codigo para evitar warning
      console.log('✅ Dados carregados com sucesso!')
      console.log(`📊 Total de obras: ${Object.keys(dashboardUnificado).length}`)
      
      Object.entries(dashboardUnificado).forEach(([codigo, obra]) => {
        console.log(`   • ${obra.nome} (${codigo})`)
        console.log(`     Energização: ${obra.temEnergizacao ? 'SIM' : 'NÃO'}`)
      })
      
      setData(dashboardUnificado)
      setError(null)
      
    } catch (err) {
      console.error('❌ Erro ao carregar dados:', err)
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido'
      setError(`Erro ao carregar BaseObras.xlsx: ${errorMessage}`)
      setData(null)
      
    } finally {
      setLoading(false)
    }
  }, [CAMINHO_BASE_OBRAS])
  
  // Carregar dados na inicialização
  useEffect(() => {
    carregarDados()
  }, [carregarDados])
  
  return {
    data,
    loading,
    error,
    refreshData: carregarDados
  }
}