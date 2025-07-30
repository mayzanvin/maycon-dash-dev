import { MetricasGerais } from '@/types/obra-unificada'
import { Building2, TrendingUp, Target, CheckCircle2 } from 'lucide-react'

interface MetricasObrasProps {
  metricas: MetricasGerais
  selectedProject: string
}

const MetricasObras: React.FC<MetricasObrasProps> = ({ metricas, selectedProject }) => {
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

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
      gap: '20px',
      padding: '0'
    }}>
      
      {/* Total de Obras */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '24px',
        border: '2px solid #e2e8f0',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s ease',
        cursor: 'default'
      }}
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
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '16px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            backgroundColor: '#eff6ff',
            border: `2px solid ${coresRoraima.azul}`
          }}>
            <Building2 style={{ 
              width: '20px', 
              height: '20px', 
              color: coresRoraima.azul
            }} />
          </div>
          <h3 style={{
            color: coresRoraima.preto,
            fontSize: '16px',
            fontWeight: '600',
            margin: 0,
            letterSpacing: '0.3px'
          }}>
            Total de Obras
          </h3>
        </div>
        
        <div style={{ 
          fontSize: '32px', 
          fontWeight: '700', 
          color: coresRoraima.azul,
          marginBottom: '8px',
          lineHeight: '1.1'
        }}>
          {metricas.totalObras}
        </div>
        
        <div style={{ 
          fontSize: '13px', 
          color: coresRoraima.cinzaClaro,
          fontWeight: '500'
        }}>
          {metricas.obrasComExecucao} com dados de execução
        </div>
      </div>

      {/* Progresso Geral Médio */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '24px',
        border: '2px solid #e2e8f0',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s ease',
        cursor: 'default'
      }}
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
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '16px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            backgroundColor: '#eff6ff',
            border: `2px solid ${coresRoraima.azul}`
          }}>
            <TrendingUp style={{ 
              width: '20px', 
              height: '20px', 
              color: coresRoraima.azul
            }} />
          </div>
          <h3 style={{
            color: coresRoraima.preto,
            fontSize: '16px',
            fontWeight: '600',
            margin: 0,
            letterSpacing: '0.3px'
          }}>
            Progresso Geral Médio
          </h3>
        </div>
        
        <div style={{ 
          fontSize: '32px', 
          fontWeight: '700', 
          color: coresRoraima.azul,
          marginBottom: '8px',
          lineHeight: '1.1'
        }}>
          {metricas.mediaaProgressoGeral}%
        </div>
        
        <div style={{ 
          fontSize: '13px', 
          color: coresRoraima.cinzaClaro,
          fontWeight: '500'
        }}>
          Média de todas as tarefas
        </div>
      </div>

      {/* Avanço Físico Médio */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '24px',
        border: '2px solid #e2e8f0',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s ease',
        cursor: 'default'
      }}
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
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '16px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            backgroundColor: '#f0fdf4',
            border: `2px solid ${coresRoraima.verde}`
          }}>
            <Target style={{ 
              width: '20px', 
              height: '20px', 
              color: coresRoraima.verde
            }} />
          </div>
          <h3 style={{
            color: coresRoraima.preto,
            fontSize: '16px',
            fontWeight: '600',
            margin: 0,
            letterSpacing: '0.3px'
          }}>
            Avanço Físico Médio
          </h3>
        </div>
        
        <div style={{ 
          fontSize: '32px', 
          fontWeight: '700', 
          color: coresRoraima.verde,
          marginBottom: '8px',
          lineHeight: '1.1'
        }}>
          {metricas.mediaAvancaoFisico}%
        </div>
        
        <div style={{ 
          fontSize: '13px', 
          color: coresRoraima.cinzaClaro,
          fontWeight: '500'
        }}>
          Baseado em marcos físicos
        </div>
      </div>

      {/* Marcos Físicos */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '24px',
        border: '2px solid #e2e8f0',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s ease',
        cursor: 'default'
      }}
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
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '16px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            backgroundColor: '#faf5ff',
            border: `2px solid ${coresRoraima.roxo}`
          }}>
            <CheckCircle2 style={{ 
              width: '20px', 
              height: '20px', 
              color: coresRoraima.roxo
            }} />
          </div>
          <h3 style={{
            color: coresRoraima.preto,
            fontSize: '16px',
            fontWeight: '600',
            margin: 0,
            letterSpacing: '0.3px'
          }}>
            Marcos Físicos
          </h3>
        </div>
        
        <div style={{ 
          fontSize: '32px', 
          fontWeight: '700', 
          color: coresRoraima.roxo,
          marginBottom: '8px',
          lineHeight: '1.1'
        }}>
          {metricas.marcosFisicosConcluidos}/{metricas.totalMarcosFisicos}
        </div>
        
        <div style={{ 
          fontSize: '13px', 
          color: coresRoraima.cinzaClaro,
          fontWeight: '500'
        }}>
          {avancaoFisicoPercentual}% concluídos
        </div>
      </div>
    </div>
  )
}

export default MetricasObras