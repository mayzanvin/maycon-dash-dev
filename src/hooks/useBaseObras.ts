// src/hooks/useBaseObras.ts - ATUALIZAÇÃO COM DEBUG DE INVESTIMENTOS
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
    console.log('🔄 === INICIANDO CARREGAMENTO COM BUSCA DE INVESTIMENTOS POR ANO ===')
    const anoCorrente = new Date().getFullYear()
    console.log(`📅 Ano de referência: ${anoCorrente}`)
    
    setLoading(true)
    setError(null)

    try {
      // ETAPA 1: Verificar se arquivos existem
      console.log('📂 ETAPA 1: Verificando arquivos necessários...')
      console.log('📁 BaseObras.xlsx:', CAMINHO_BASE_OBRAS)
      console.log('📁 BaseInvestimento.xlsx: /BaseInvestimento.xlsx')
      
      const responseObras = await fetch(CAMINHO_BASE_OBRAS)
      const responseInvestimentos = await fetch('/BaseInvestimento.xlsx')
      
      console.log('📡 Status BaseObras.xlsx:', responseObras.status)
      console.log('📡 Status BaseInvestimento.xlsx:', responseInvestimentos.status)

      if (!responseObras.ok) {
        throw new Error(`❌ BASEOBRAS.XLSX NÃO ENCONTRADO!
        
Status: ${responseObras.status}
Caminho: ${CAMINHO_BASE_OBRAS}

SOLUÇÕES:
1. Verificar se BaseObras.xlsx está em: maycon-dash-dev/public/
2. Reiniciar servidor: npm run dev
3. Verificar permissões do arquivo`)
      }

      if (!responseInvestimentos.ok) {
        console.log(`⚠️ BASEINVESTIMENTO.XLSX NÃO ENCONTRADO!`)
        console.log(`   Status: ${responseInvestimentos.status}`)
        console.log(`   IMPACTO: Orçamentos aprovados aparecerão em branco`)
        console.log(`   SOLUÇÃO: Adicionar BaseInvestimento.xlsx na pasta public/`)
      }

      console.log('✅ ETAPA 1 CONCLUÍDA: Verificação de arquivos finalizada!')

      // ETAPA 2: Processar Excel (com nova lógica de ano)
      console.log('📊 ETAPA 2: Processando Excel com busca inteligente por ano...')
      const dashboardData: DashboardData = await ExcelProcessor.processBaseObras(CAMINHO_BASE_OBRAS)
      
      console.log('📋 Resultados do ExcelProcessor:')
      console.log(`   - Total de tarefas: ${dashboardData.todasTarefas.length}`)
      console.log(`   - Abas processadas: ${Object.keys(dashboardData.obrasPorAba).length}`)
      console.log(`   - Investimentos carregados: ${dashboardData.investimentos?.length || 0}`)
      console.log(`   - Nomes das abas:`, Object.keys(dashboardData.obrasPorAba))

      // Debug detalhado dos investimentos
      if (dashboardData.investimentos && dashboardData.investimentos.length > 0) {
        console.log('💰 === INVESTIMENTOS CARREGADOS ===')
        dashboardData.investimentos.slice(0, 5).forEach((inv, index) => {
          console.log(`   ${index + 1}. ID: "${inv.ID_Projeto}"`)
          console.log(`      Descrição: "${inv.Descricao}"`)
          console.log(`      Valor: R$ ${inv.ValorAprovado.toLocaleString()}`)
        })
        if (dashboardData.investimentos.length > 5) {
          console.log(`   ... e mais ${dashboardData.investimentos.length - 5} investimentos`)
        }
      } else {
        console.log('⚠️ NENHUM INVESTIMENTO CARREGADO!')
        console.log('   Possíveis causas:')
        console.log('   1. BaseInvestimento.xlsx não existe')
        console.log('   2. Aba do ano 2025 não foi encontrada')
        console.log('   3. Estrutura de colunas diferente do esperado')
        console.log('   4. Dados vazios na planilha')
      }

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

      // Debug financeiro por obra
      console.log('💰 === RESULTADOS FINANCEIROS POR OBRA ===')
      dadosUnificados.obras.forEach((obra, index) => {
        console.log(`   ${index + 1}. ${obra.codigo}`)
        console.log(`      Orçamento Total: R$ ${obra.dadosFinanceiros.orcamentoTotal.toLocaleString()}`)
        console.log(`      Orçamento Aprovado: R$ ${obra.dadosFinanceiros.orcamentoAprovado.toLocaleString()}`)
        console.log(`      Valor Realizado: R$ ${obra.dadosFinanceiros.valorRealizado.toLocaleString()}`)
        console.log(`      Correlação Encontrada: ${obra.dadosFinanceiros.corelacionEncontrada ? '✅ SIM' : '❌ NÃO'}`)
      })

      if (dadosUnificados.obras.length === 0) {
        throw new Error(`❌ NENHUMA OBRA UNIFICADA CRIADA!
        
O DataAdapter não conseguiu agrupar as obras F+E.

VERIFICAR:
1. Se existem abas com sufixo _F e _E
2. Se as abas têm dados válidos
3. Se os nomes das abas seguem o padrão OBRA_F/OBRA_E`)
      }

      console.log('✅ ETAPA 3 CONCLUÍDA: Obras unificadas criadas!')

      // ETAPA 4: Relatório final
      console.log('📊 ETAPA 4: Relatório final do carregamento:')
      console.log(`\n🎯 === RESUMO EXECUTIVO ===`)
      console.log(`   📊 Obras processadas: ${dadosUnificados.obras.length}`)
      console.log(`   📈 Progresso médio: ${dadosUnificados.metricas.progressoMedio}%`)
      console.log(`   ⚡ Obras com execução: ${dadosUnificados.metricas.obrasComExecucao}`)
      console.log(`   💰 Orçamento total: R$ ${dadosUnificados.metricas.orcamentoTotalPortfolio.toLocaleString()}`)
      console.log(`   💰 Valor realizado: R$ ${dadosUnificados.metricas.valorRealizadoPortfolio.toLocaleString()}`)
      console.log(`   📊 Eficiência média: ${dadosUnificados.metricas.eficienciaMediaPortfolio}%`)
      
      // Verificar se há problemas de orçamento aprovado
      const obrasComOrcamentoZero = dadosUnificados.obras.filter(o => 
        o.dadosFinanceiros.orcamentoAprovado === 0
      )
      
      if (obrasComOrcamentoZero.length > 0) {
        console.log(`\n⚠️ === ALERTAS FINANCEIROS ===`)
        console.log(`   ${obrasComOrcamentoZero.length} obras sem orçamento aprovado:`)
        obrasComOrcamentoZero.forEach(obra => {
          console.log(`   - ${obra.codigo}`)
        })
        console.log(`\n   SOLUÇÕES:`)
        console.log(`   1. Verificar se BaseInvestimento.xlsx está correto`)
        console.log(`   2. Confirmar estrutura de colunas da aba ${anoCorrente}`)
        console.log(`   3. Verificar correlação entre códigos de obra e investimento`)
      }

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