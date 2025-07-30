import { BaseObraData } from '@/types/obra'

interface MetricsCardsProps {
  data: BaseObraData[]
  selectedSheet: string
}

const MetricsCards: React.FC<MetricsCardsProps> = ({ data, selectedSheet }) => {
  const totalTasks = data.length
  const completedTasks = data.filter(task => (task.__Conclu_do || 0) === 100).length
  const inProgressTasks = data.filter(task => (task.__Conclu_do || 0) > 0 && (task.__Conclu_do || 0) < 100).length
  const pendingTasks = data.filter(task => (task.__Conclu_do || 0) === 0).length

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  const cardStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e2e8f0',
    transition: 'all 0.3s ease',
    cursor: 'default'
  }

  const cardHoverStyle = {
    ...cardStyle,
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)'
  }

  const sectionTitleStyle = {
    fontSize: '24px',
    fontWeight: '600',
    marginBottom: '20px',
    color: '#1a365d',
    borderBottom: '3px solid #FF6B35',
    paddingBottom: '8px',
    display: 'inline-block'
  }

  const metricsHeaderStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '16px'
  }

  const iconWrapperStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    flexShrink: 0
  }

  const metricTitleStyle = {
    color: '#374151',
    fontSize: '16px',
    fontWeight: '600',
    margin: 0,
    letterSpacing: '0.3px'
  }

  const metricValueStyle = {
    fontSize: '32px',
    fontWeight: '700',
    marginBottom: '8px',
    lineHeight: '1.1'
  }

  const metricSubtitleStyle = {
    fontSize: '13px',
    color: '#6b7280',
    fontWeight: '500'
  }

  return (
    <div style={{ marginBottom: '40px' }}>
      <h2 style={sectionTitleStyle}>
        Métricas Gerais - {selectedSheet === 'all' ? 'Todas as Obras' : selectedSheet}
      </h2>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
        gap: '24px' 
      }}>
        {/* Total de Tarefas */}
        <div 
          style={cardStyle}
          onMouseEnter={(e) => {
            Object.assign(e.currentTarget.style, cardHoverStyle)
          }}
          onMouseLeave={(e) => {
            Object.assign(e.currentTarget.style, cardStyle)
          }}
        >
          <div style={metricsHeaderStyle}>
            <div style={{
              ...iconWrapperStyle,
              backgroundColor: '#eff6ff',
              border: '2px solid #3b82f6'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.5">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <path d="M8 12h8M8 8h8M8 16h6"/>
              </svg>
            </div>
            <h3 style={metricTitleStyle}>Total de Tarefas</h3>
          </div>
          <div style={{
            ...metricValueStyle,
            color: '#3b82f6'
          }}>
            {totalTasks}
          </div>
          <div style={metricSubtitleStyle}>
            Tarefas cadastradas no sistema
          </div>
        </div>

        {/* Concluídas */}
        <div 
          style={cardStyle}
          onMouseEnter={(e) => {
            Object.assign(e.currentTarget.style, cardHoverStyle)
          }}
          onMouseLeave={(e) => {
            Object.assign(e.currentTarget.style, cardStyle)
          }}
        >
          <div style={metricsHeaderStyle}>
            <div style={{
              ...iconWrapperStyle,
              backgroundColor: '#f0fdf4',
              border: '2px solid #10b981'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10"/>
                <path d="m9 12 2 2 4-4"/>
              </svg>
            </div>
            <h3 style={metricTitleStyle}>Concluídas</h3>
          </div>
          <div style={{
            ...metricValueStyle,
            color: '#10b981'
          }}>
            {completedTasks}
          </div>
          <div style={metricSubtitleStyle}>
            {completionRate}% do total concluído
          </div>
        </div>

        {/* Em Andamento */}
        <div 
          style={cardStyle}
          onMouseEnter={(e) => {
            Object.assign(e.currentTarget.style, cardHoverStyle)
          }}
          onMouseLeave={(e) => {
            Object.assign(e.currentTarget.style, cardStyle)
          }}
        >
          <div style={metricsHeaderStyle}>
            <div style={{
              ...iconWrapperStyle,
              backgroundColor: '#fefce8',
              border: '2px solid #f59e0b'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 2v10l4 4"/>
              </svg>
            </div>
            <h3 style={metricTitleStyle}>Em Andamento</h3>
          </div>
          <div style={{
            ...metricValueStyle,
            color: '#f59e0b'
          }}>
            {inProgressTasks}
          </div>
          <div style={metricSubtitleStyle}>
            Tarefas com progresso parcial
          </div>
        </div>

        {/* Pendentes */}
        <div 
          style={cardStyle}
          onMouseEnter={(e) => {
            Object.assign(e.currentTarget.style, cardHoverStyle)
          }}
          onMouseLeave={(e) => {
            Object.assign(e.currentTarget.style, cardStyle)
          }}
        >
          <div style={metricsHeaderStyle}>
            <div style={{
              ...iconWrapperStyle,
              backgroundColor: '#fef2f2',
              border: '2px solid #ef4444'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 8v4M12 16h.01"/>
              </svg>
            </div>
            <h3 style={metricTitleStyle}>Pendentes</h3>
          </div>
          <div style={{
            ...metricValueStyle,
            color: '#ef4444'
          }}>
            {pendingTasks}
          </div>
          <div style={metricSubtitleStyle}>
            Aguardando início das atividades
          </div>
        </div>
      </div>
    </div>
  )
}

export default MetricsCards