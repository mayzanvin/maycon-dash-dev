import { BaseObraData } from '@/types/obra'
import { BarChart3, CheckCircle, Clock, AlertCircle } from 'lucide-react'

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
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    border: '1px solid #e0e0e0'
  }

  const iconStyle = {
    width: '24px',
    height: '24px'
  }

  return (
    <div style={{ marginBottom: '30px' }}>
      <h2 style={{ fontSize: '20px', marginBottom: '15px', color: '#333' }}>
        Métricas - {selectedSheet === 'all' ? 'Todas as Obras' : selectedSheet}
      </h2>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '20px' 
      }}>
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <BarChart3 style={{ ...iconStyle, color: '#3b82f6' }} />
            <span style={{ marginLeft: '8px', fontWeight: '600', color: '#333' }}>
              Total de Tarefas
            </span>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#3b82f6' }}>
            {totalTasks}
          </div>
        </div>

        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <CheckCircle style={{ ...iconStyle, color: '#10b981' }} />
            <span style={{ marginLeft: '8px', fontWeight: '600', color: '#333' }}>
              Concluídas
            </span>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#10b981' }}>
            {completedTasks}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {completionRate}% do total
          </div>
        </div>

        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <Clock style={{ ...iconStyle, color: '#f59e0b' }} />
            <span style={{ marginLeft: '8px', fontWeight: '600', color: '#333' }}>
              Em Andamento
            </span>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#f59e0b' }}>
            {inProgressTasks}
          </div>
        </div>

        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <AlertCircle style={{ ...iconStyle, color: '#ef4444' }} />
            <span style={{ marginLeft: '8px', fontWeight: '600', color: '#333' }}>
              Pendentes
            </span>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#ef4444' }}>
            {pendingTasks}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MetricsCards