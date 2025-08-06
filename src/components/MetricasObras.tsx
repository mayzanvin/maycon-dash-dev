import { MetricasGerais } from '@/types/obra-unificada'

interface MetricasObrasProps {
  metricas: MetricasGerais
}

const MetricasObras: React.FC<MetricasObrasProps> = ({ metricas }) => {
  console.log("🔥 MÉTRICAS COM DADOS FINANCEIROS - " + new Date().toLocaleTimeString())
  
  const avancaoFisicoPercentual = metricas.totalMarcosFisicos > 0 
    ? Math.round((metricas.marcosFisicosConcluidos / metricas.totalMarcosFisicos) * 100)
    : 0

  const coresRoraima = {
    azul: '#0EA5E9',
    laranja: '#FF6B35',
    verde: '#10B981',
    roxo: '#8B5CF6',
    dourado: '#F59E0B',
    preto: '#000000',
    cinza: '#374151',
    cinzaClaro: '#6B7280'
  }

  // 💰 FORMATAÇÃO DE VALORES FINANCEIROS
  const formatarMoeda = (valor: number) => {
    if (valor >= 1000000) {
      return `R$ ${(valor / 1000000).toFixed(1)}M`
    } else if (valor >= 1000) {
      return `R$ ${(valor / 1000).toFixed(0)}k`
    }
    return `R$ ${valor.toLocaleString()}`
  }

  // 💰 COR DA EFICIÊNCIA
  const getCorEficiencia = (eficiencia: number) => {
    if (eficiencia <= 120) return coresRoraima.verde    // Eficiente
    if (eficiencia <= 150) return coresRoraima.dourado  // Atenção
    return '#EF4444'                                     // Crítico
  }

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
      gap: '16px',
      padding: '0',
      fontFamily: 'Inter, sans-serif'
    }}>
      
      {/* Card 1 - Total de Obras */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        padding: '16px',
        border: '2px solid #e2e8f0',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        minHeight: '60px',
        transition: 'all 0.2s ease'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '8px',
          backgroundColor: '#eff6ff',
          border: '2px solid ' + coresRoraima.azul,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={coresRoraima.azul} strokeWidth="2.5">
            <path d="M3 21h18"/>
            <path d="M5 21V7l8-4v18"/>
            <path d="M19 21V11l-6-4"/>
          </svg>
        </div>
        
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '2px' }}>
            <h3 style={{
              color: coresRoraima.preto,
              fontSize: '14px',
              fontWeight: '700',
              margin: 0,
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              TOTAL DE OBRAS
            </h3>
            <span style={{ 
              fontSize: '24px', 
              fontWeight: '800', 
              color: coresRoraima.azul
            }}>
              {metricas.totalObras}
            </span>
          </div>
          <div style={{ 
            fontSize: '12px', 
            color: coresRoraima.cinzaClaro,
            fontWeight: '500'
          }}>
            {metricas.obrasComExecucao} com dados de execução
          </div>
        </div>
      </div>

      {/* Card 2 - Progresso Geral */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        padding: '16px',
        border: '2px solid #e2e8f0',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        minHeight: '60px',
        transition: 'all 0.2s ease'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '8px',
          backgroundColor: '#eff6ff',
          border: '2px solid ' + coresRoraima.azul,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={coresRoraima.azul} strokeWidth="2.5">
            <path d="M3 3v18h18"/>
            <path d="M7 16l4-4 4 4 6-6"/>
          </svg>
        </div>
        
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '2px' }}>
            <h3 style={{
              color: coresRoraima.preto,
              fontSize: '14px',
              fontWeight: '700',
              margin: 0,
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              PROGRESSO GERAL
            </h3>
            <span style={{ 
              fontSize: '24px', 
              fontWeight: '800', 
              color: coresRoraima.azul
            }}>
              {metricas.mediaaProgressoGeral}%
            </span>
          </div>
          <div style={{ 
            fontSize: '12px', 
            color: coresRoraima.cinzaClaro,
            fontWeight: '500'
          }}>
            Média de todas as tarefas
          </div>
        </div>
      </div>

      {/* Card 3 - Avanço Físico */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        padding: '16px',
        border: '2px solid #e2e8f0',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        minHeight: '60px',
        transition: 'all 0.2s ease'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '8px',
          backgroundColor: '#f0fdf4',
          border: '2px solid ' + coresRoraima.verde,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={coresRoraima.verde} strokeWidth="2.5">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 6v6l4 4"/>
          </svg>
        </div>
        
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '2px' }}>
            <h3 style={{
              color: coresRoraima.preto,
              fontSize: '14px',
              fontWeight: '700',
              margin: 0,
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              AVANÇO FÍSICO
            </h3>
            <span style={{ 
              fontSize: '24px', 
              fontWeight: '800', 
              color: coresRoraima.verde
            }}>
              {metricas.mediaAvancaoFisico}%
            </span>
          </div>
          <div style={{ 
            fontSize: '12px', 
            color: coresRoraima.cinzaClaro,
            fontWeight: '500'
          }}>
            Baseado em marcos físicos
          </div>
        </div>
      </div>

      {/* 💰 Card 4 - NOVO: Orçamento Total do Portfólio */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        padding: '16px',
        border: '2px solid #e2e8f0',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        minHeight: '60px',
        transition: 'all 0.2s ease'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '8px',
          backgroundColor: '#fef7ed',
          border: '2px solid ' + coresRoraima.laranja,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={coresRoraima.laranja} strokeWidth="2.5">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 2v10l4 3"/>
            <path d="M6 12c0-2.2.9-4.2 2.3-5.7"/>
          </svg>
        </div>
        
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '2px' }}>
            <h3 style={{
              color: coresRoraima.preto,
              fontSize: '14px',
              fontWeight: '700',
              margin: 0,
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              ORÇAMENTO TOTAL
            </h3>
            <span style={{ 
              fontSize: '18px', 
              fontWeight: '800', 
              color: coresRoraima.laranja
            }}>
              {formatarMoeda(metricas.orcamentoTotalPortfolio)}
            </span>
          </div>
          <div style={{ 
            fontSize: '12px', 
            color: coresRoraima.cinzaClaro,
            fontWeight: '500'
          }}>
            Soma de todas as obras
          </div>
        </div>
      </div>

      {/* 💰 Card 5 - NOVO: Valor Realizado */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        padding: '16px',
        border: '2px solid #e2e8f0',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        minHeight: '60px',
        transition: 'all 0.2s ease'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '8px',
          backgroundColor: '#eff6ff',
          border: '2px solid ' + coresRoraima.azul,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={coresRoraima.azul} strokeWidth="2.5">
            <rect x="1" y="3" width="15" height="13"/>
            <path d="M16 8h4a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-4"/>
            <circle cx="9" cy="9" r="2"/>
            <path d="M6 21v-7a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v7"/>
          </svg>
        </div>
        
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '2px' }}>
            <h3 style={{
              color: coresRoraima.preto,
              fontSize: '14px',
              fontWeight: '700',
              margin: 0,
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              VALOR REALIZADO
            </h3>
            <span style={{ 
              fontSize: '18px', 
              fontWeight: '800', 
              color: coresRoraima.azul
            }}>
              {formatarMoeda(metricas.valorRealizadoPortfolio)}
            </span>
          </div>
          <div style={{ 
            fontSize: '12px', 
            color: coresRoraima.cinzaClaro,
            fontWeight: '500'
          }}>
            {metricas.progressoFinanceiroMedio}% do orçamento executado
          </div>
        </div>
      </div>

      {/* 💰 Card 6 - NOVO: Eficiência Média do Portfólio */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        padding: '16px',
        border: '2px solid #e2e8f0',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        minHeight: '60px',
        transition: 'all 0.2s ease',
        background: metricas.eficienciaMediaPortfolio <= 120 ? 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)' : 
                   metricas.eficienciaMediaPortfolio <= 150 ? 'linear-gradient(135deg, #fefce8 0%, #ffffff 100%)' :
                   'linear-gradient(135deg, #fef2f2 0%, #ffffff 100%)'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '8px',
          backgroundColor: getCorEficiencia(metricas.eficienciaMediaPortfolio) === coresRoraima.verde ? '#f0fdf4' :
                           getCorEficiencia(metricas.eficienciaMediaPortfolio) === coresRoraima.dourado ? '#fef3e2' : '#fef2f2',
          border: '2px solid ' + getCorEficiencia(metricas.eficienciaMediaPortfolio),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={getCorEficiencia(metricas.eficienciaMediaPortfolio)} strokeWidth="2.5">
            <path d="M12 2v10l4 3"/>
            <circle cx="12" cy="12" r="10"/>
            <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
            <path d="M9 9h.01"/>
            <path d="M15 9h.01"/>
          </svg>
        </div>
        
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '2px' }}>
            <h3 style={{
              color: coresRoraima.preto,
              fontSize: '14px',
              fontWeight: '700',
              margin: 0,
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              EFICIÊNCIA MÉDIA
            </h3>
            <span style={{ 
              fontSize: '24px', 
              fontWeight: '800', 
              color: getCorEficiencia(metricas.eficienciaMediaPortfolio)
            }}>
              {metricas.eficienciaMediaPortfolio}%
            </span>
          </div>
          <div style={{ 
            fontSize: '12px', 
            color: coresRoraima.cinzaClaro,
            fontWeight: '500'
          }}>
            {metricas.eficienciaMediaPortfolio <= 120 ? 'Portfólio eficiente' :
             metricas.eficienciaMediaPortfolio <= 150 ? 'Atenção nos gastos' : 'Gastos críticos'}
          </div>
        </div>
      </div>

      {/* Card 7 - Marcos Físicos (mantido) */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        padding: '16px',
        border: '2px solid #e2e8f0',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        minHeight: '60px',
        transition: 'all 0.2s ease'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '8px',
          backgroundColor: '#faf5ff',
          border: '2px solid ' + coresRoraima.roxo,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={coresRoraima.roxo} strokeWidth="2.5">
            <path d="M9 12l2 2 4-4"/>
            <circle cx="12" cy="12" r="10"/>
          </svg>
        </div>
        
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '2px' }}>
            <h3 style={{
              color: coresRoraima.preto,
              fontSize: '14px',
              fontWeight: '700',
              margin: 0,
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              MARCOS FÍSICOS
            </h3>
            <span style={{ 
              fontSize: '24px', 
              fontWeight: '800', 
              color: coresRoraima.roxo
            }}>
              {metricas.marcosFisicosConcluidos}/{metricas.totalMarcosFisicos}
            </span>
          </div>
          <div style={{ 
            fontSize: '12px', 
            color: coresRoraima.cinzaClaro,
            fontWeight: '500'
          }}>
            {avancaoFisicoPercentual}% concluídos
          </div>
        </div>
      </div>

      {/* 💰 Card 8 - NOVO: Orçamento Aprovado 2025 */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        padding: '16px',
        border: '2px solid #e2e8f0',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        minHeight: '60px',
        transition: 'all 0.2s ease'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '8px',
          backgroundColor: '#faf5ff',
          border: '2px solid ' + coresRoraima.roxo,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={coresRoraima.roxo} strokeWidth="2.5">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14,2 14,8 20,8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10,9 9,9 8,9"/>
          </svg>
        </div>
        
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '2px' }}>
            <h3 style={{
              color: coresRoraima.preto,
              fontSize: '14px',
              fontWeight: '700',
              margin: 0,
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              APROVADO 2025
            </h3>
            <span style={{ 
              fontSize: '18px', 
              fontWeight: '800', 
              color: coresRoraima.roxo
            }}>
              {formatarMoeda(metricas.orcamentoAprovadoPortfolio)}
            </span>
          </div>
          <div style={{ 
            fontSize: '12px', 
            color: coresRoraima.cinzaClaro,
            fontWeight: '500'
          }}>
            {metricas.orcamentoAprovadoPortfolio > 0 ? 
              `${Math.round((metricas.valorRealizadoPortfolio / metricas.orcamentoAprovadoPortfolio) * 100)}% executado vs aprovado` :
              'Correlação pendente'
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default MetricasObras