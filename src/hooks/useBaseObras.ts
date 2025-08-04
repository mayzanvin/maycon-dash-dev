// src/hooks/useBaseObras.ts - DEBUG DETALHADO PARA IDENTIFICAR PROBLEMA
import { useState, useEffect, useCallback } from 'react'
import { DashboardData } from '@/types/obra'
import { DashboardUnificadoType } from '@/types/obra-unificada'
import { ExcelProcessor } from '@/utils/excelProcessor'
import { DataAdapter } from '@/utils/dataAdapter'

interface UseBaseObrasReturn {
  data: DashboardUnificadoType | null
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useBaseObras(): UseBaseObrasReturn {
  const [data, setData] = useState<DashboardUnificadoType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const CAMINHO_BASE_OBRAS = '/BaseObras.xlsx'

  const carregarDados = useCallback(async () => {
    console.log('🔄 === INICIANDO DEBUG DETALHADO ===')
    setLoading(true)
    setError(null)

    try {
      // ETAPA 1: Verificar se arquivo existe
      console.log('📂 ETAPA 1: Verificando arquivo...')
      console.log('📁 Caminho:', CAMINHO_BASE_OBRAS)
      
      const response = await fetch(CAMINHO_BASE_OBRAS)
      console.log('📡 Status da resposta:', response.status)
      console.log('📡 Response OK:', response.ok)
      console.log('📡 Content-Type:', response.headers.get('content-type'))
      console.log('📡 Content-Length:', response.headers.get('content-length'))

      if (!response.ok) {
        throw new Error(`❌ ARQUIVO NÃO ENCONTRADO!
        
Status: ${response.status}
Caminho testado: ${CAMINHO_BASE_OBRAS}

SOLUÇÕES:
1. Verificar se o arquivo está em: maycon-dash-dev/public/BaseObras.xlsx
2. Reiniciar servidor: npm run dev
3. Verificar permissões do arquivo
4. Verificar se o arquivo não está corrompido`)
      }

      console.log('✅ ETAPA 1 CONCLUÍDA: Arquivo encontrado!')

      // ETAPA 2: Processar Excel
      console.log('📊 ETAPA 2: Processando Excel...')
      const dashboardData: DashboardData = await ExcelProcessor.processBaseObras(CAMINHO_BASE_OBRAS)
      
      console.log('📋 Resultados do ExcelProcessor:')
      console.log(`   - Total de tarefas: ${dashboardData.todasTarefas.length}`)
      console.log(`   - Abas processadas: ${Object.keys(dashboardData.obrasPorAba).length}`)
      console.log(`   - Nomes das abas:`, Object.keys(dashboardData.obrasPorAba))

      if (dashboardData.todasTarefas.length === 0) {
        throw new Error(`❌ NENHUMA TAREFA ENCONTRADA!
        
O Excel foi lido mas não contém dados válidos.

VERIFICAR:
1. Se o arquivo tem dados nas abas
2. Se as colunas estão no formato correto
3. Se não há linhas vazias no início`)
      }

      console.log('✅ ETAPA 2 CONCLUÍDA: Excel processado!')

      // ETAPA 3: Converter para Dashboard Unificado
      console.log('🔄 ETAPA 3: Convertendo para Dashboard Unificado...')
      const dadosUnificados: DashboardUnificadoType = DataAdapter.convertToUnificado(dashboardData)
      
      console.log('📋 Resultados do DataAdapter:')
      console.log(`   - Obras unificadas: ${dadosUnificados.obras.length}`)
      console.log(`   - Métricas gerais:`, dadosUnificados.metricas)

      if (dadosUnificados.obras.length === 0) {
        throw new Error(`❌ NENHUMA OBRA UNIFICADA CRIADA!
        
O DataAdapter não conseguiu agrupar as obras F+E.

VERIFICAR:
1. Se existem abas com sufixo _F e _E
2. Se as abas têm dados válidos
3. Se os nomes das abas seguem o padrão OBRA_F/OBRA_E`)
      }

      console.log('✅ ETAPA 3 CONCLUÍDA: Obras unificadas criadas!')

      // ETAPA 4: Mostrar detalhes das obras
      console.log('📊 ETAPA 4: Detalhes das obras criadas:')
      dadosUnificados.obras.forEach((obra, index) => {
        console.log(`   ${index + 1}. ${obra.codigo}: ${obra.nome}`)
        console.log(`      - Status: ${obra.status}`)
        console.log(`      - Avanço Físico: ${obra.avancaoFisico}%`)
        console.log(`      - Energização: ${obra.temEnergizacao ? 'SIM' : 'NÃO'}`)
        console.log(`      - Fiscalização: ${obra.fiscalizacao.tarefasConcluidas}/${obra.fiscalizacao.totalTarefas}`)
        console.log(`      - Execução: ${obra.execucao.tarefasConcluidas}/${obra.execucao.totalTarefas}`)
      })

      setData(dadosUnificados)
      console.log('🎯 === SUCCESS: DADOS CARREGADOS COM SUCESSO! ===')

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido'
      console.error('❌ === ERRO DURANTE O CARREGAMENTO ===')
      console.error(errorMessage)
      setError(errorMessage)
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [CAMINHO_BASE_OBRAS])

  useEffect(() => {
    carregarDados()
  }, [carregarDados])

  const refetch = useCallback(() => {
    console.log('🔄 === RECARGA MANUAL SOLICITADA ===')
    carregarDados()
  }, [carregarDados])

  return {
    data,
    loading,
    error,
    refetch
  }
}