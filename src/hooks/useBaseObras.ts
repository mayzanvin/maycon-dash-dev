// src/hooks/useBaseObras.ts - SEM DADOS MOCK - SÓ DADOS REAIS
import { useState, useEffect, useCallback } from 'react'
import { DashboardData } from '@/types/obra'
import { DashboardUnificadoType } from '@/types/obra-unificada'
import { ExcelProcessor } from '@/utils/excelProcessor'
import { DataAdapter } from '@/utils/dataAdapter'

interface UseBaseObrasReturn {
  data: DashboardUnificadoType | null
  loading: boolean
  error: string | null
  ultimaAtualizacao: string
  refresh: () => void
}

export const useBaseObras = (): UseBaseObrasReturn => {
  const [data, setData] = useState<DashboardUnificadoType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [ultimaAtualizacao, setUltimaAtualizacao] = useState<string>('')

  // Caminho do arquivo BaseObras.xlsx no OneDrive
  const CAMINHO_BASE_OBRAS = 'C:/Users/mzvinga/OneDrive - RORAIMA ENERGIA/SUBESTAÇÕES OBRAS/COORDENAÇÃO/CRONOGRAMAS/BaseObras.xlsx'

  const carregarDados = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      setData(null) // ✅ Limpar dados anteriores

      console.log('🔄 Tentando carregar BaseObras.xlsx...')
      console.log('📁 Caminho:', CAMINHO_BASE_OBRAS)
      
      // ✅ TENTAR CARREGAR DADOS REAIS - SEM FALLBACK PARA MOCK
      const dadosBrutos: DashboardData = await ExcelProcessor.processBaseObras(CAMINHO_BASE_OBRAS)
      console.log('✅ BaseObras.xlsx carregado com sucesso!')
      
      // Verificar se há dados válidos
      if (!dadosBrutos.sheets || Object.keys(dadosBrutos.sheets).length === 0) {
        throw new Error('Arquivo Excel não contém abas válidas com dados')
      }
      
      // Converter para estrutura unificada
      const dadosUnificados = DataAdapter.convertToUnifiedStructure(dadosBrutos)
      
      // Verificar se a conversão gerou obras válidas
      if (!dadosUnificados || Object.keys(dadosUnificados).length === 0) {
        throw new Error('Não foi possível processar as obras do arquivo Excel')
      }
      
      console.log('✅ Dados convertidos para estrutura unificada!')
      console.log('📊 Obras encontradas:', Object.keys(dadosUnificados))
      
      setData(dadosUnificados)
      
      // Atualizar timestamp de sucesso
      const agora = new Date()
      const timestamp = agora.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'America/Boa_Vista'
      })
      setUltimaAtualizacao(`Última atualização: ${timestamp}`)

      console.log('📊 Dashboard carregado:', {
        obras: Object.keys(dadosUnificados).length,
        totalTarefas: Object.values(dadosUnificados)
          .reduce((sum, obra) => sum + obra.metricas.totalTarefas, 0)
      })

    } catch (err) {
      // ✅ SEM FALLBACK - MOSTRAR ERRO REAL
      const errorMessage = err instanceof Error ? err.message : String(err)
      console.error('❌ Erro ao carregar BaseObras.xlsx:', errorMessage)
      
      setError(errorMessage)
      setData(null) // ✅ Garantir que não há dados inválidos
      setUltimaAtualizacao('Falha no carregamento')
      
    } finally {
      setLoading(false)
    }
  }, [CAMINHO_BASE_OBRAS])

  // Carregamento inicial
  useEffect(() => {
    carregarDados()
  }, [carregarDados])

  // Auto-refresh a cada 5 minutos
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('🔄 Auto-refresh BaseObras.xlsx...')
      carregarDados()
    }, 5 * 60 * 1000) // 5 minutos

    return () => clearInterval(interval)
  }, [carregarDados])

  // Função para refresh manual
  const refresh = useCallback(() => {
    console.log('🔄 Refresh manual solicitado...')
    carregarDados()
  }, [carregarDados])

  return {
    data, // ✅ Só retorna dados REAIS ou null
    loading,
    error,
    ultimaAtualizacao,
    refresh
  }
}