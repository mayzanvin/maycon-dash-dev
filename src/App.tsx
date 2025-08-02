// src/App.tsx - SEM WARNINGS
import { useState } from 'react'
import { RefreshCw, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'
import { useBaseObras } from '@/hooks/useBaseObras'
import DashboardUnificado from '@/components/DashboardUnificado'

function App() {
  const { data, loading, error, refreshData } = useBaseObras()
  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      await refreshData()
    } finally {
      setRefreshing(false)
    }
  }

  // ✅ USAR variáveis para evitar warnings
  const isDataLoaded = data !== null
  const hasError = error !== null

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Header Estratégico */}
      <header style={{
        backgroundColor: '#1e40af',
        color: 'white',
        padding: '12px 24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <div>
            <h1 style={{
              margin: 0,
              fontSize: '18px',
              fontWeight: '600'
            }}>
              🔵 Dashboard Estratégico - Roraima Energia
            </h1>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginTop: '4px'
            }}>
              {/* Status do Sistema */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px'
              }}>
                {hasError ? (
                  <>
                    <AlertCircle size={12} style={{ color: '#fbbf24' }} />
                    <span style={{ color: '#fbbf24' }}>Erro de Carregamento</span>
                  </>
                ) : (
                  <>
                    <CheckCircle size={12} style={{ color: '#10b981' }} />
                    <span style={{ color: '#10b981' }}>
                      {isDataLoaded ? 'Dados Reais' : 'Carregando'}
                    </span>
                  </>
                )}
              </div>

              {/* Fonte dos Dados */}
              <div style={{
                fontSize: '11px',
                color: '#9ca3af',
                fontFamily: 'monospace'
              }}>
                /BaseObras.xlsx
              </div>

              {/* Contadores */}
              {isDataLoaded && (
                <div style={{
                  fontSize: '11px',
                  color: '#9ca3af'
                }}>
                  {Object.keys(data).length} obras carregadas
                </div>
              )}
            </div>
          </div>

          {/* Botão de Refresh */}
          <button
            onClick={handleRefresh}
            disabled={refreshing || loading}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              backgroundColor: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '6px',
              color: 'white',
              fontSize: '12px',
              cursor: refreshing ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {refreshing ? (
              <Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} />
            ) : (
              <RefreshCw size={12} />
            )}
            {refreshing ? 'Atualizando...' : 'Atualizar'}
          </button>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main style={{ padding: '24px' }}>
        {loading ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            gap: '16px'
          }}>
            <Loader2 size={32} style={{ 
              color: '#1e40af',
              animation: 'spin 1s linear infinite' 
            }} />
            <div style={{
              textAlign: 'center',
              color: '#64748b'
            }}>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>
                Carregando Dashboard Estratégico
              </h3>
              <p style={{ 
                margin: 0,
                fontSize: '14px',
                fontFamily: 'monospace'
              }}>
                Processando BaseObras.xlsx...
              </p>
            </div>
          </div>
        ) : hasError ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '40vh',
            gap: '16px',
            textAlign: 'center'
          }}>
            <AlertCircle size={48} style={{ color: '#ef4444' }} />
            <div>
              <h3 style={{ 
                margin: '0 0 8px 0', 
                fontSize: '18px',
                color: '#ef4444'
              }}>
                Erro ao Carregar BaseObras.xlsx
              </h3>
              <p style={{ 
                margin: '0 0 16px 0',
                fontSize: '14px',
                color: '#64748b',
                maxWidth: '500px'
              }}>
                {error}
              </p>
              <div style={{
                padding: '12px',
                backgroundColor: '#fef3c7',
                border: '1px solid #f59e0b',
                borderRadius: '6px',
                fontSize: '12px',
                color: '#92400e'
              }}>
                ⚠️ Verifique se o arquivo BaseObras.xlsx está na pasta public/
              </div>
            </div>
          </div>
        ) : null}

        {/* Dashboard Principal */}
        {isDataLoaded && !hasError && (
          <DashboardUnificado data={data} />
        )}
      </main>
    </div>
  )
}

export default App