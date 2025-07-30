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

  return (
    <div style={{ marginBottom: '30px' }}>
      <h2 style={{ 
        fontSize: '20px', 
        marginBottom: '20px', 
        color: '#00d4ff',
        fontWeight: '700',
        textAlign: 'center',
        textShadow: '0 0 20px rgba(0, 212, 255, 0.5)',
        letterSpacing: '1px'
      }}>
        ⚡ MÉTRICAS GERAIS - {selectedProject === 'all' ? 'TODAS AS OBRAS' : 'OBRA SELECIONADA'}
      </h2>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: '20px',
        padding: '0 10px'
      }}>
        
        {/* Total de Obras - FORÇANDO TEMA CYBER */}
        <div style={{
          background: 'linear-gradient(135deg, #0a0e1a 0%, #1a1f2e 50%, #0a0e1a 100%) !important',
          borderRadius: '12px',
          padding: '24px',
          border: '2px solid #FF6B35',
          boxShadow: `
            0 0 20px rgba(255, 107, 53, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.1)
          `,
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s ease'
        }}>
          {/* Borda animada */}
          <div style={{
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            height: '2px',
            background: 'linear-gradient(90deg, transparent, #FF6B35, transparent)',
            animation: 'borderGlow 2s ease-in-out infinite alternate'
          }} />
          
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
            <Building2 style={{ 
              width: '28px', 
              height: '28px', 
              color: '#00d4ff',
              filter: 'drop-shadow(0 0 8px rgba(0, 212, 255, 0.6))'
            }} />
            <span style={{ 
              marginLeft: '12px', 
              fontWeight: '600', 
              color: '#ffffff !important',
              fontSize: '16px'
            }}>
              Total de Obras
            </span>
          </div>
          
          <div style={{ 
            fontSize: '36px', 
            fontWeight: 'bold', 
            color: '#00d4ff !important',
            textShadow: '0 0 20px rgba(0, 212, 255, 0.8)',
            marginBottom: '8px'
          }}>
            {metricas.totalObras}
          </div>
          
          <div style={{ 
            fontSize: '13px', 
            color: '#94a3b8 !important',
            background: 'rgba(0, 212, 255, 0.1)',
            padding: '4px 8px',
            borderRadius: '4px',
            border: '1px solid rgba(0, 212, 255, 0.3)'
          }}>
            {metricas.obrasComExecucao} com dados de execução
          </div>
        </div>

        {/* Progresso Geral Médio */}
        <div style={{
          background: 'linear-gradient(135deg, #0a0e1a 0%, #1a1f2e 50%, #0a0e1a 100%)',
          borderRadius: '12px',
          padding: '24px',
          border: '2px solid #FF6B35',
          boxShadow: `
            0 0 20px rgba(255, 107, 53, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.1)
          `,
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s ease'
        }}>
          <div style={{
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            height: '2px',
            background: 'linear-gradient(90deg, transparent, #FF6B35, transparent)',
            animation: 'borderGlow 2s ease-in-out infinite alternate'
          }} />
          
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
            <TrendingUp style={{ 
              width: '28px', 
              height: '28px', 
              color: '#3b82f6',
              filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.6))'
            }} />
            <span style={{ 
              marginLeft: '12px', 
              fontWeight: '600', 
              color: '#ffffff',
              fontSize: '16px'
            }}>
              Progresso Geral Médio
            </span>
          </div>
          
          <div style={{ 
            fontSize: '36px', 
            fontWeight: 'bold', 
            color: '#3b82f6',
            textShadow: '0 0 20px rgba(59, 130, 246, 0.8)',
            marginBottom: '8px'
          }}>
            {metricas.mediaaProgressoGeral}%
          </div>
          
          <div style={{ 
            fontSize: '13px', 
            color: '#94a3b8',
            background: 'rgba(59, 130, 246, 0.1)',
            padding: '4px 8px',
            borderRadius: '4px',
            border: '1px solid rgba(59, 130, 246, 0.3)'
          }}>
            Média de todas as tarefas
          </div>
        </div>

        {/* Avanço Físico Médio */}
        <div style={{
          background: 'linear-gradient(135deg, #0a0e1a 0%, #1a1f2e 50%, #0a0e1a 100%)',
          borderRadius: '12px',
          padding: '24px',
          border: '2px solid #FF6B35',
          boxShadow: `
            0 0 20px rgba(255, 107, 53, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.1)
          `,
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s ease'
        }}>
          <div style={{
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            height: '2px',
            background: 'linear-gradient(90deg, transparent, #FF6B35, transparent)',
            animation: 'borderGlow 2s ease-in-out infinite alternate'
          }} />
          
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
            <Target style={{ 
              width: '28px', 
              height: '28px', 
              color: '#00ff88',
              filter: 'drop-shadow(0 0 8px rgba(0, 255, 136, 0.6))'
            }} />
            <span style={{ 
              marginLeft: '12px', 
              fontWeight: '600', 
              color: '#ffffff',
              fontSize: '16px'
            }}>
              Avanço Físico Médio
            </span>
          </div>
          
          <div style={{ 
            fontSize: '36px', 
            fontWeight: 'bold', 
            color: '#00ff88',
            textShadow: '0 0 20px rgba(0, 255, 136, 0.8)',
            marginBottom: '8px'
          }}>
            {metricas.mediaAvancaoFisico}%
          </div>
          
          <div style={{ 
            fontSize: '13px', 
            color: '#94a3b8',
            background: 'rgba(0, 255, 136, 0.1)',
            padding: '4px 8px',
            borderRadius: '4px',
            border: '1px solid rgba(0, 255, 136, 0.3)'
          }}>
            Baseado em marcos físicos
          </div>
        </div>

        {/* Marcos Físicos */}
        <div style={{
          background: 'linear-gradient(135deg, #0a0e1a 0%, #1a1f2e 50%, #0a0e1a 100%)',
          borderRadius: '12px',
          padding: '24px',
          border: '2px solid #FF6B35',
          boxShadow: `
            0 0 20px rgba(255, 107, 53, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.1)
          `,
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s ease'
        }}>
          <div style={{
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            height: '2px',
            background: 'linear-gradient(90deg, transparent, #FF6B35, transparent)',
            animation: 'borderGlow 2s ease-in-out infinite alternate'
          }} />
          
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
            <CheckCircle2 style={{ 
              width: '28px', 
              height: '28px', 
              color: '#8b5cf6',
              filter: 'drop-shadow(0 0 8px rgba(139, 92, 246, 0.6))'
            }} />
            <span style={{ 
              marginLeft: '12px', 
              fontWeight: '600', 
              color: '#ffffff',
              fontSize: '16px'
            }}>
              Marcos Físicos
            </span>
          </div>
          
          <div style={{ 
            fontSize: '36px', 
            fontWeight: 'bold', 
            color: '#8b5cf6',
            textShadow: '0 0 20px rgba(139, 92, 246, 0.8)',
            marginBottom: '8px'
          }}>
            {metricas.marcosFisicosConcluidos}/{metricas.totalMarcosFisicos}
          </div>
          
          <div style={{ 
            fontSize: '13px', 
            color: '#94a3b8',
            background: 'rgba(139, 92, 246, 0.1)',
            padding: '4px 8px',
            borderRadius: '4px',
            border: '1px solid rgba(139, 92, 246, 0.3)'
          }}>
            {avancaoFisicoPercentual}% concluídos
          </div>
        </div>
      </div>
    </div>
  )
}

export default MetricasObras