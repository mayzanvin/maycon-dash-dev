// src/App.tsx - SEM DADOS MOCK - SÓ DADOS REAIS
import { useState } from 'react'
import { RefreshCw, CheckCircle, Loader2, FileX, Wifi } from 'lucide-react'
import { useBaseObras } from '@/hooks/useBaseObras'
import DashboardUnificado from '@/components/DashboardUnificado'

function App() {
  const { data, loading, error, ultimaAtualizacao, refresh } = useBaseObras()
  const [refreshing, setRefreshing] = useState(false)

  console.log('🔥 APP CARREGADO - SOMENTE DADOS REAIS')

  const handleRefresh = async () => {
    setRefreshing(true)
    refresh()
    // Feedback visual
    setTimeout(() => setRefreshing(false), 1500)
  }

  // Tela de Loading
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '50px',
          borderRadius: '16px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
          textAlign: 'center',
          maxWidth: '450px',
          border: '1px solid #e2e8f0'
        }}>
          <Loader2 size={56} style={{ 
            color: '#0EA5E9', 
            marginBottom: '24px',
            animation: 'spin 1s linear infinite'
          }} />
          <h2 style={{ 
            margin: '0 0 12px 0', 
            color: '#1e293b',
            fontSize: '22px',
            fontWeight: '700'
          }}>
            Carregando BaseObras.xlsx
          </h2>
          <p style={{ 
            margin: '0 0 16px 0', 
            color: '#64748b',
            fontSize: '15px',
            lineHeight: '1.6'
          }}>
            Conectando ao OneDrive e processando dados reais...
          </p>
          <div style={{
            backgroundColor: '#f8fafc',
            padding: '12px',
            borderRadius: '8px',
            fontSize: '12px',
            fontFamily: 'monospace',
            color: '#64748b',
            wordBreak: 'break-all'
          }}>
            C:\Users\mzvinga\OneDrive - RORAIMA ENERGIA\SUBESTAÇÕES OBRAS\COORDENAÇÃO\CRONOGRAMAS\...
          </div>
        </div>
      </div>
    )
  }

  // ✅ TELA DE ERRO PROFISSIONAL - SEM DADOS INCORRETOS
  if (!data || error) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
        padding: '20px',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '50px',
          borderRadius: '16px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
          textAlign: 'center',
          maxWidth: '600px',
          border: '1px solid #fecaca'
        }}>
          <div style={{ marginBottom: '24px' }}>
            <FileX size={64} style={{ 
              color: '#ef4444', 
              marginBottom: '16px'
            }} />
          </div>
          
          <h2 style={{ 
            margin: '0 0 16px 0', 
            color: '#1e293b',
            fontSize: '24px',
            fontWeight: '700'
          }}>
            Não foi possível carregar o BaseObras.xlsx
          </h2>
          
          <p style={{ 
            margin: '0 0 24px 0', 
            color: '#64748b',
            fontSize: '16px',
            lineHeight: '1.6'
          }}>
            Para garantir a precisão dos dados, o dashboard só funciona com informações reais do arquivo Excel.
          </p>

          {error && (
            <div style={{ 
              margin: '0 0 32px 0', 
              padding: '16px',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '12px',
              textAlign: 'left'
            }}>
              <h4 style={{ 
                margin: '0 0 8px 0',
                color: '#dc2626',
                fontSize: '14px',
                fontWeight: '600'
              }}>
                Erro técnico:
              </h4>
              <p style={{ 
                margin: 0,
                color: '#7f1d1d',
                fontSize: '13px',
                fontFamily: 'monospace'
              }}>
                {error}
              </p>
            </div>
          )}

          <div style={{ 
            marginBottom: '32px', 
            textAlign: 'left',
            backgroundColor: '#f8fafc',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid #e2e8f0'
          }}>
            <h4 style={{
              margin: '0 0 12px 0',
              color: '#1e293b',
              fontSize: '16px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Wifi size={16} />
              Possíveis soluções:
            </h4>
            <ul style={{ 
              margin: 0, 
              paddingLeft: '20px',
              color: '#64748b',
              fontSize: '14px',
              lineHeight: '1.6'
            }}>
              <li style={{ marginBottom: '8px' }}>
                <strong>Verificar OneDrive:</strong> Confirme se o arquivo BaseObras.xlsx existe no caminho correto
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>Sincronização:</strong> Aguarde a sincronização completa do OneDrive
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>Permissões:</strong> Execute a aplicação como administrador se necessário
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>Electron:</strong> Use a versão desktop para acesso completo aos arquivos
              </li>
              <li>
                <strong>Formato do arquivo:</strong> Verifique se o arquivo não está corrompido
              </li>
            </ul>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '14px 24px',
                backgroundColor: refreshing ? '#f1f5f9' : '#0EA5E9',
                color: refreshing ? '#64748b' : 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: refreshing ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {refreshing ? (
                <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
              ) : (
                <RefreshCw size={18} />
              )}
              {refreshing ? 'Tentando conectar...' : 'Tentar Novamente'}
            </button>
          </div>

          <p style={{
            marginTop: '24px',
            fontSize: '12px',
            color: '#9ca3af',
            fontStyle: 'italic'
          }}>
            Dashboard de Obras - Roraima Energia
          </p>
        </div>
      </div>
    )
  }

  // ✅ INTERFACE PRINCIPAL - SÓ COM DADOS REAIS VÁLIDOS
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header com Status da Integração */}
      <header style={{
        backgroundColor: 'white',
        padding: '12px 24px',
        borderBottom: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: '1400px',
          margin: '0 auto'
        }}>
          <div>
            <h1 style={{
              margin: '0 0 4px 0',
              fontSize: '20px',
              fontWeight: '700',
              color: '#1e293b'
            }}>
              Dashboard de Obras - Roraima Energia
            </h1>
            <p style={{
              margin: 0,
              fontSize: '13px',
              color: '#64748b'
            }}>
              Dados reais do BaseObras.xlsx • {Object.keys(data).length} obras carregadas
            </p>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Indicador de Status - Sempre verde quando há dados reais */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              color: '#059669'
            }}>
              <CheckCircle size={14} />
              <span>Dados Reais</span>
            </div>

            {/* Timestamp */}
            <span style={{
              fontSize: '11px',
              color: '#64748b',
              fontFamily: 'monospace'
            }}>
              {ultimaAtualizacao}
            </span>

            {/* Botão Refresh */}
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                backgroundColor: refreshing ? '#f1f5f9' : '#0EA5E9',
                color: refreshing ? '#64748b' : 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: '500',
                cursor: refreshing ? 'not-allowed' : 'pointer'
              }}
            >
              {refreshing ? (
                <Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} />
              ) : (
                <RefreshCw size={12} />
              )}
              Atualizar
            </button>
          </div>
        </div>
      </header>

      {/* ✅ DASHBOARD ORIGINAL - SÓ COM DADOS REAIS */}
      <main>
        <DashboardUnificado 
          data={data} 
          dataUltimaAtualizacao={ultimaAtualizacao}
        />
      </main>

      {/* CSS para animações */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default App