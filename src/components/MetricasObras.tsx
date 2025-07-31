// Adicione esta linha no início do return do MetricasObras.tsx
<div style={{ color: 'red', fontSize: '20px', textAlign: 'center' }}>🔥 TESTE - MetricasObras.tsx carregado!</div>
import { MetricasGerais } from '@/types/obra-unificada'

interface MetricasObrasProps {
  metricas: MetricasGerais
}

const MetricasObras: React.FC<MetricasObrasProps> = ({ metricas }) => {
  const avancaoFisicoPercentual = metricas.totalMarcosFisicos > 0 
    ? Math.round((metricas.marcosFisicosConcluidos / metricas.totalMarcosFisicos) * 100)
    : 0

  // Cores da Roraima Energia
  const coresRoraima = {
    azul: '#0EA5E9',
    laranja: '#FF6B35',
    verde: '#10B981',
    roxo: '#8B5CF6',
    preto: '#000000',
    cinza: '#374151',
    cinzaClaro: '#6B7280'
  }

  const cardStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '24px',
    border: '2px solid #e2e8f0',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
    cursor: 'default',
    textAlign: 'center' as const,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center'
  }

  const iconContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '48px',
    height: '48px',
    borderRadius: '8px',
    marginBottom: '16px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
  }

  const titleStyle = {
    color: coresRoraima.preto,
    fontSize: '16px',
    fontWeight: '600',
    margin: '0 0 16px 0',
    letterSpacing: '0.3px',
    fontFamily: 'Inter, sans-serif',
    textAlign: 'center' as const,
    width: '100%'
  }

  const valueStyle = {
    fontSize: '32px',
    fontWeight: '700',
    marginBottom: '8px',
    lineHeight: '1.1',
    fontFamily: 'Inter, sans-serif'
  }

  const descriptionStyle = {
    fontSize: '13px',
    color: coresRoraima.cinzaClaro,
    fontWeight: '500',
    fontFamily: 'Inter, sans-serif',
    textAlign: 'center' as const
  }

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
      gap: '20px',
      padding: '0',
      fontFamily: 'Inter, sans-serif'
    }}>
      
      {/* Total de Obras */}
      <div style={cardStyle}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.15)'
        e.currentTarget.style.borderColor = coresRoraima.azul
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)'
        e.currentTarget.style.borderColor = '#e2e8f0'
      }}>
        <div style={{
          ...iconContainerStyle,
          backgroundColor: '#f8fafc',
          border: `2px solid ${coresRoraima.azul}`
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={coresRoraima.azul} strokeWidth="2">
            <path d="M3 21h18"/>
            <path d="M5 21V7l8-4v18"/>
            <path d="M19 21V11l-6-4"/>
          </svg>
        </div>
        
        <h3 style={titleStyle}>
          Total de Obras
        </h3>
        
        <div style={{ 
          ...valueStyle,
          color: coresRoraima.azul
        }}>
          {metricas.totalObras}
        </div>
        
        <div style={descriptionStyle}>
          {metricas.obrasComExecucao} com dados de execução
        </div>
      </div>

      {/* Progresso Geral Médio */}
      <div style={cardStyle}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.15)'
        e.currentTarget.style.borderColor = coresRoraima.azul
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)'
        e.currentTarget.style.borderColor = '#e2e8f0'
      }}>
        <div style={{
          ...iconContainerStyle,
          backgroundColor: '#f8fafc',
          border: `2px solid ${coresRoraima.azul}`
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={coresRoraima.azul} strokeWidth="2">
            <path d="M3 3v18h18"/>
            <path d="M7 16l4-4 4 4 6-6"/>
          </svg>
        </div>
        
        <h3 style={titleStyle}>
          Progresso Geral Médio
        </h3>
        
        <div style={{ 
          ...valueStyle,
          color: coresRoraima.azul
        }}>
          {metricas.mediaaProgressoGeral}%
        </div>
        
        <div style={descriptionStyle}>
          Média de todas as tarefas
        </div>
      </div>

      {/* Avanço Físico Médio */}
      <div style={cardStyle}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.15)'
        e.currentTarget.style.borderColor = coresRoraima.verde
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)'
        e.currentTarget.style.borderColor = '#e2e8f0'
      }}>
        <div style={{
          ...iconContainerStyle,
          backgroundColor: '#f0fdf4',
          border: `2px solid ${coresRoraima.verde}`
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={coresRoraima.verde} strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 6v6l4 4"/>
          </svg>
        </div>
        
        <h3 style={titleStyle}>
          Avanço Físico Médio
        </h3>
        
        <div style={{ 
          ...valueStyle,
          color: coresRoraima.verde
        }}>
          {metricas.mediaAvancaoFisico}%
        </div>
        
        <div style={descriptionStyle}>
          Baseado em marcos físicos
        </div>
      </div>

      {/* Marcos Físicos */}
      <div style={cardStyle}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.15)'
        e.currentTarget.style.borderColor = coresRoraima.roxo
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)'
        e.currentTarget.style.borderColor = '#e2e8f0'
      }}>
        <div style={{
          ...iconContainerStyle,
          backgroundColor: '#faf5ff',
          border: `2px solid ${coresRoraima.roxo}`
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={coresRoraima.roxo} strokeWidth="2">
            <path d="M9 12l2 2 4-4"/>
            <circle cx="12" cy="12" r="10"/>
          </svg>
        </div>
        
        <h3 style={titleStyle}>
          Marcos Físicos
        </h3>
        
        <div style={{ 
          ...valueStyle,
          color: coresRoraima.roxo
        }}>
          {metricas.marcosFisicosConcluidos}/{metricas.totalMarcosFisicos}
        </div>
        
        <div style={descriptionStyle}>
          {avancaoFisicoPercentual}% concluídos
        </div>
      </div>
    </div>
  )
}

export default MetricasObras