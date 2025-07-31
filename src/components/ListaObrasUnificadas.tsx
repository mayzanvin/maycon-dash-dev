import { ObraUnificada } from '@/types/obra-unificada'
import { Building2, Users, Wrench, Target, TrendingUp } from 'lucide-react'

interface ListaObrasUnificadasProps {
  obras: ObraUnificada[]
  showAll: boolean
  onObraClick: (obra: ObraUnificada) => void
}

const ListaObrasUnificadas: React.FC<ListaObrasUnificadasProps> = ({ obras, showAll, onObraClick }) => {
  // Cores da Roraima Energia
  const coresRoraima = {
    azul: '#0EA5E9',
    verde: '#10B981',
    laranja: '#FF6B35',
    vermelho: '#EF4444',
    amarelo: '#F59E0B',
    preto: '#000000',
    cinza: '#374151',
    cinzaClaro: '#6B7280'
  }

  if (!obras.length) {
    return (
      <div style={{
        backgroundColor: '#ffffff',
        border: '2px solid #e2e8f0',
        borderRadius: '12px',
        padding: '40px',
        textAlign: 'center',
        color: coresRoraima.cinza,
        fontSize: '16px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
      }}>
        ⚠️ Nenhuma obra encontrada para os filtros selecionados
      </div>
    )
  }

  const getCorProgresso = (progresso: number) => {
    if (progresso >= 80) return coresRoraima.verde
    if (progresso >= 50) return coresRoraima.amarelo
    return coresRoraima.vermelho
  }

  const getStatusText = (progresso: number) => {
    if (progresso >= 80) return 'Avançado'
    if (progresso >= 50) return 'Em Andamento'
    if (progresso > 0) return 'Iniciado'
    return 'Não Iniciado'
  }

  return (
    <div style={{
      backgroundColor: '#ffffff',
      padding: '20px',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e2e8f0',
      marginBottom: '30px',
      fontFamily: 'Inter, sans-serif'
    }}>
      <h2 style={{ 
        fontSize: '24px', 
        marginBottom: '20px', 
        color: coresRoraima.preto,
        fontWeight: '600',
        textAlign: 'center',
        borderBottom: `3px solid ${coresRoraima.laranja}`,
        paddingBottom: '8px',
        display: 'inline-block',
        width: '100%'
      }}>
        📋 RESUMO DAS OBRAS {showAll ? `(${obras.length} OBRAS)` : '(OBRA SELECIONADA)'}
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
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              padding: '24px',
              border: '2px solid #e2e8f0',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              position: 'relative'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)'
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.15)'
              e.currentTarget.style.borderColor = coresRoraima.laranja
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)'
              e.currentTarget.style.borderColor = '#e2e8f0'
            }}
          >
            {/* Borda superior colorida */}
            <div style={{
              position: 'absolute',
              top: '0',
              left: '0',
              right: '0',
              height: '4px',
              background: `linear-gradient(90deg, ${coresRoraima.azul}, ${coresRoraima.laranja})`,
              borderRadius: '12px 12px 0 0'
            }} />

            {/* Header da obra */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '16px',
              marginTop: '8px'
            }}>
              <div style={{ flex: 1 }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  color: coresRoraima.preto,
                  marginBottom: '4px',
                  lineHeight: '1.4',
                  wordWrap: 'break-word'
                }}>
                  {obra.nome}
                </h3>
                <p style={{
                  fontSize: '12px',
                  color: coresRoraima.cinza,
                  fontFamily: 'monospace',
                  backgroundColor: '#f8fafc',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  display: 'inline-block',
                  border: '1px solid #e2e8f0'
                }}>
                  {obra.codigo}
                </p>
              </div>
              
              <div style={{
                backgroundColor: getCorProgresso(obra.metricas.avancooFisico),
                color: '#ffffff',
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: '600',
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
                backgroundColor: '#eff6ff',
                border: `1px solid ${coresRoraima.azul}`,
                borderRadius: '8px',
                padding: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                  <TrendingUp style={{ 
                    width: '16px', 
                    height: '16px', 
                    color: coresRoraima.azul,
                    marginRight: '6px'
                  }} />
                  <span style={{ fontSize: '12px', color: coresRoraima.cinza }}>Progresso Geral</span>
                </div>
                <div style={{ 
                  fontSize: '24px', 
                  fontWeight: 'bold', 
                  color: coresRoraima.azul
                }}>
                  {obra.metricas.progressoGeral}%
                </div>
                <div style={{
                  width: '100%',
                  height: '4px',
                  backgroundColor: '#dbeafe',
                  borderRadius: '2px',
                  marginTop: '6px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${obra.metricas.progressoGeral}%`,
                    height: '100%',
                    backgroundColor: coresRoraima.azul,
                    borderRadius: '2px',
                    transition: 'width 0.5s ease'
                  }} />
                </div>
              </div>

              {/* Avanço Físico */}
              <div style={{
                backgroundColor: '#f0fdf4',
                border: `1px solid ${coresRoraima.verde}`,
                borderRadius: '8px',
                padding: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                  <Target style={{ 
                    width: '16px', 
                    height: '16px', 
                    color: coresRoraima.verde,
                    marginRight: '6px'
                  }} />
                  <span style={{ fontSize: '12px', color: coresRoraima.cinza }}>Avanço Físico</span>
                </div>
                <div style={{ 
                  fontSize: '24px', 
                  fontWeight: 'bold', 
                  color: coresRoraima.verde
                }}>
                  {obra.metricas.avancooFisico}%
                </div>
                <div style={{
                  width: '100%',
                  height: '4px',
                  backgroundColor: '#dcfce7',
                  borderRadius: '2px',
                  marginTop: '6px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${obra.metricas.avancooFisico}%`,
                    height: '100%',
                    backgroundColor: coresRoraima.verde,
                    borderRadius: '2px',
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
                  <Building2 style={{ width: '14px', height: '14px', color: coresRoraima.cinza, marginRight: '4px' }} />
                  <span style={{ fontSize: '11px', color: coresRoraima.cinza }}>Total</span>
                </div>
                <div style={{ fontSize: '16px', fontWeight: 'bold', color: coresRoraima.preto }}>
                  {obra.metricas.totalTarefas}
                </div>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '4px' }}>
                  <Users style={{ width: '14px', height: '14px', color: coresRoraima.cinza, marginRight: '4px' }} />
                  <span style={{ fontSize: '11px', color: coresRoraima.cinza }}>Concluídas</span>
                </div>
                <div style={{ fontSize: '16px', fontWeight: 'bold', color: coresRoraima.verde }}>
                  {obra.metricas.tarefasConcluidas}
                </div>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '4px' }}>
                  <Wrench style={{ width: '14px', height: '14px', color: coresRoraima.cinza, marginRight: '4px' }} />
                  <span style={{ fontSize: '11px', color: coresRoraima.cinza }}>Marcos</span>
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
              backgroundColor: '#fff7ed',
              border: `1px solid ${coresRoraima.laranja}`,
              borderRadius: '6px',
              fontSize: '12px',
              color: coresRoraima.laranja,
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