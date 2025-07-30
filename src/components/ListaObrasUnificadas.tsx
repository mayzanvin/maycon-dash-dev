import { ObraUnificada } from '@/types/obra-unificada'
import { Building2, Users, Wrench, Target, TrendingUp } from 'lucide-react'

interface ListaObrasUnificadasProps {
  obras: ObraUnificada[]
  showAll: boolean
  onObraClick: (obra: ObraUnificada) => void
}

const ListaObrasUnificadas: React.FC<ListaObrasUnificadasProps> = ({ obras, showAll, onObraClick }) => {
  if (!obras.length) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, #0a0e1a 0%, #1a1f2e 100%)',
        border: '2px solid #FF6B35',
        borderRadius: '12px',
        padding: '40px',
        textAlign: 'center',
        color: '#94a3b8',
        fontSize: '16px'
      }}>
        ⚠️ Nenhuma obra encontrada para os filtros selecionados
      </div>
    )
  }

  const getCorProgresso = (progresso: number) => {
    if (progresso >= 80) return '#00ff88'
    if (progresso >= 50) return '#f59e0b'
    return '#ff4444'
  }

  const getStatusText = (progresso: number) => {
    if (progresso >= 80) return 'Avançado'
    if (progresso >= 50) return 'Em Andamento'
    if (progresso > 0) return 'Iniciado'
    return 'Não Iniciado'
  }

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
        ◪ RESUMO DAS OBRAS {showAll ? `(${obras.length} OBRAS)` : '(OBRA SELECIONADA)'}
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '20px'
      }}>
        {obras.map((obra) => (
          <div
            key={obra.codigo}
            onClick={() => onObraClick(obra)}
            style={{
              background: 'linear-gradient(135deg, #0a0e1a 0%, #1a1f2e 50%, #0a0e1a 100%)',
              borderRadius: '16px',
              padding: '24px',
              border: '2px solid #FF6B35',
              boxShadow: `
                0 0 20px rgba(255, 107, 53, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.1)
              `,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)'
              e.currentTarget.style.boxShadow = `
                0 0 30px rgba(255, 107, 53, 0.5),
                0 10px 20px rgba(0, 0, 0, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.2)
              `
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = `
                0 0 20px rgba(255, 107, 53, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.1)
              `
            }}
          >
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

            {/* Header da obra */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '16px'
            }}>
              <div style={{ flex: 1 }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  color: '#ffffff',
                  marginBottom: '4px',
                  lineHeight: '1.4',
                  wordWrap: 'break-word'
                }}>
                  {obra.nome}
                </h3>
                <p style={{
                  fontSize: '12px',
                  color: '#94a3b8',
                  fontFamily: 'monospace',
                  background: 'rgba(0, 212, 255, 0.1)',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  display: 'inline-block'
                }}>
                  {obra.codigo}
                </p>
              </div>
              
              <div style={{
                background: `linear-gradient(135deg, ${getCorProgresso(obra.metricas.avancooFisico)} 0%, ${getCorProgresso(obra.metricas.avancooFisico)}88 100%)`,
                color: '#000000',
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: '600',
                boxShadow: `0 0 10px ${getCorProgresso(obra.metricas.avancooFisico)}`,
                minWidth: '70px',
                textAlign: 'center'
              }}>
                {getStatusText(obra.metricas.avancooFisico)}
              </div>
            </div>

            {/* Métricas principais */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
              marginBottom: '20px'
            }}>
              {/* Progresso Geral */}
              <div style={{
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '8px',
                padding: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                  <TrendingUp style={{ 
                    width: '16px', 
                    height: '16px', 
                    color: '#3b82f6',
                    marginRight: '6px'
                  }} />
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>Progresso Geral</span>
                </div>
                <div style={{ 
                  fontSize: '24px', 
                  fontWeight: 'bold', 
                  color: '#3b82f6',
                  textShadow: '0 0 10px rgba(59, 130, 246, 0.5)'
                }}>
                  {obra.metricas.progressoGeral}%
                </div>
                <div style={{
                  width: '100%',
                  height: '4px',
                  background: 'rgba(59, 130, 246, 0.2)',
                  borderRadius: '2px',
                  marginTop: '6px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${obra.metricas.progressoGeral}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #3b82f6 0%, #60a5fa 100%)',
                    borderRadius: '2px',
                    boxShadow: '0 0 8px rgba(59, 130, 246, 0.6)',
                    transition: 'width 0.5s ease'
                  }} />
                </div>
              </div>

              {/* Avanço Físico */}
              <div style={{
                background: 'rgba(0, 255, 136, 0.1)',
                border: '1px solid rgba(0, 255, 136, 0.3)',
                borderRadius: '8px',
                padding: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                  <Target style={{ 
                    width: '16px', 
                    height: '16px', 
                    color: '#00ff88',
                    marginRight: '6px'
                  }} />
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>Avanço Físico</span>
                </div>
                <div style={{ 
                  fontSize: '24px', 
                  fontWeight: 'bold', 
                  color: '#00ff88',
                  textShadow: '0 0 10px rgba(0, 255, 136, 0.5)'
                }}>
                  {obra.metricas.avancooFisico}%
                </div>
                <div style={{
                  width: '100%',
                  height: '4px',
                  background: 'rgba(0, 255, 136, 0.2)',
                  borderRadius: '2px',
                  marginTop: '6px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${obra.metricas.avancooFisico}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #00ff88 0%, #00cc66 100%)',
                    borderRadius: '2px',
                    boxShadow: '0 0 8px rgba(0, 255, 136, 0.6)',
                    transition: 'width 0.5s ease'
                  }} />
                </div>
              </div>
            </div>

            {/* Detalhes das tarefas */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '12px',
              marginBottom: '16px'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '4px' }}>
                  <Building2 style={{ width: '14px', height: '14px', color: '#94a3b8', marginRight: '4px' }} />
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>Total</span>
                </div>
                <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#ffffff' }}>
                  {obra.metricas.totalTarefas}
                </div>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '4px' }}>
                  <Users style={{ width: '14px', height: '14px', color: '#94a3b8', marginRight: '4px' }} />
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>Concluídas</span>
                </div>
                <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#00ff88' }}>
                  {obra.metricas.tarefasConcluidas}
                </div>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '4px' }}>
                  <Wrench style={{ width: '14px', height: '14px', color: '#94a3b8', marginRight: '4px' }} />
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>Marcos</span>
                </div>
                <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#8b5cf6' }}>
                  {obra.metricas.marcosConcluidos}/{obra.metricas.totalMarcos}
                </div>
              </div>
            </div>

            {/* Call to action */}
            <div style={{
              textAlign: 'center',
              padding: '8px',
              background: 'rgba(255, 107, 53, 0.1)',
              border: '1px solid rgba(255, 107, 53, 0.3)',
              borderRadius: '6px',
              fontSize: '12px',
              color: '#FF6B35',
              fontWeight: '600'
            }}>
              🔍 Clique para ver detalhes completos
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ListaObrasUnificadas