// src/components/ModalDetalhesObra.tsx - VERSÃO CORRIGIDA
import { useEffect } from 'react'
import { ObraUnificada } from '@/types/obra-unificada'
import { X, Calendar, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react'
import CurvaTendencia from './CurvaTendencia'

interface ModalDetalhesObraProps {
  obra: ObraUnificada | null
  onClose: () => void
}

const ModalDetalhesObra: React.FC<ModalDetalhesObraProps> = ({ obra, onClose }) => {
  // Fechar modal com ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    
    if (obra) {
      document.addEventListener('keydown', handleEsc)
      document.body.style.overflow = 'hidden' // Prevenir scroll
    }
    
    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = 'unset'
    }
  }, [obra, onClose])

  if (!obra) return null

  const calcularDatasExtremas = () => {
    const todasTarefas = [...obra.fiscalizacao.tarefas, ...obra.execucao.tarefas]
    
    const datasInicio = todasTarefas
      .map(t => t['Data Início'])
      .filter((d): d is number => typeof d === 'number' && d > 0)
    
    const datasTermino = todasTarefas
      .map(t => t['Data Término'])
      .filter((d): d is number => typeof d === 'number' && d > 0)
    
    const datasBaseInicio = todasTarefas
      .map(t => t['LinhaBase Início'])
      .filter((d): d is number => typeof d === 'number' && d > 0)
    
    const datasBaseTermino = todasTarefas
      .map(t => t['LinhaBase Término'])
      .filter((d): d is number => typeof d === 'number' && d > 0)
    
    const todasDatas = [...datasInicio, ...datasTermino, ...datasBaseInicio, ...datasBaseTermino]
    
    return {
      dataInicio: datasInicio.length > 0 ? Math.min(...datasInicio) : 0,
      dataTermino: datasTermino.length > 0 ? Math.max(...datasTermino) : 0,
      dataInicioBase: datasBaseInicio.length > 0 ? Math.min(...datasBaseInicio) : 0,
      dataTerminoBase: datasBaseTermino.length > 0 ? Math.max(...datasBaseTermino) : 0,
      duracaoTotal: todasDatas.length > 0 ? Math.max(...todasDatas) - Math.min(...todasDatas) : 0
    }
  }

  const formatarData = (excelDate: number | undefined): string => {
    if (!excelDate || excelDate <= 0) return 'Não definida'
    
    try {
      const date = new Date((excelDate - 25569) * 86400 * 1000)
      return date.toLocaleDateString('pt-BR')
    } catch (error) {
      console.warn('Erro ao formatar data:', excelDate, error)
      return 'Data inválida'
    }
  }

  const { dataInicio, dataTermino, dataInicioBase, dataTerminoBase } = calcularDatasExtremas()
  
  const diasAtraso = dataTermino && dataTerminoBase ? dataTermino - dataTerminoBase : 0
  const statusAtraso = diasAtraso > 0 ? 'Atrasada' : diasAtraso < 0 ? 'Adiantada' : 'No prazo'
  const corStatus = diasAtraso > 0 ? '#ff4444' : diasAtraso < 0 ? '#00ff88' : '#00d4ff'

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'radial-gradient(circle at center, rgba(10, 14, 26, 0.95) 0%, rgba(0, 0, 0, 0.98) 100%)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px',
      animation: 'fadeIn 0.3s ease'
    }}
    onClick={onClose}
    >
      <div style={{
        background: 'linear-gradient(135deg, #0a0e1a 0%, #1a1f2e 50%, #0a0e1a 100%)',
        borderRadius: '20px',
        maxWidth: '1000px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
        border: '2px solid #FF6B35',
        boxShadow: `
          0 0 50px rgba(255, 107, 53, 0.4),
          inset 0 1px 0 rgba(255, 255, 255, 0.1)
        `,
        position: 'relative'
      }}
      onClick={(e) => e.stopPropagation()}
      >
        {/* Borda animada */}
        <div style={{
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          height: '3px',
          background: 'linear-gradient(90deg, transparent, #FF6B35, #00d4ff, #FF6B35, transparent)',
          borderRadius: '20px 20px 0 0',
          animation: 'borderFlow 3s ease-in-out infinite'
        }} />

        {/* Header do Modal */}
        <div style={{
          padding: '32px 32px 24px',
          borderBottom: '1px solid rgba(255, 107, 53, 0.3)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          background: 'linear-gradient(135deg, rgba(255, 107, 53, 0.1) 0%, transparent 100%)'
        }}>
          <div style={{ flex: 1 }}>
            <h2 style={{
              fontSize: '28px',
              fontWeight: '700',
              color: '#ffffff',
              marginBottom: '8px',
              textShadow: '0 0 20px rgba(255, 255, 255, 0.3)',
              lineHeight: '1.3'
            }}>
              {obra.nome}
            </h2>
            <div style={{
              display: 'inline-block',
              background: 'rgba(0, 212, 255, 0.2)',
              border: '1px solid rgba(0, 212, 255, 0.5)',
              borderRadius: '6px',
              padding: '4px 12px',
              fontSize: '14px',
              fontFamily: 'monospace',
              color: '#00d4ff',
              fontWeight: '600'
            }}>
              {obra.codigo}
            </div>
          </div>
          
          <button
            onClick={onClose}
            style={{
              background: 'linear-gradient(135deg, #ff4444 0%, #cc3333 100%)',
              border: 'none',
              cursor: 'pointer',
              padding: '12px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(255, 68, 68, 0.5)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)'
              e.currentTarget.style.boxShadow = '0 0 25px rgba(255, 68, 68, 0.8)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)'
              e.currentTarget.style.boxShadow = '0 0 15px rgba(255, 68, 68, 0.5)'
            }}
          >
            <X style={{ width: '20px', height: '20px', color: '#ffffff' }} />
          </button>
        </div>

        {/* Status da Obra */}
        <div style={{
          padding: '32px',
          borderBottom: '1px solid rgba(255, 107, 53, 0.2)'
        }}>
          <h3 style={{ 
            fontSize: '20px', 
            fontWeight: '600', 
            marginBottom: '24px', 
            color: '#00d4ff',
            textShadow: '0 0 15px rgba(0, 212, 255, 0.5)'
          }}>
            ⚡ STATUS GERAL DA OBRA
          </h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '20px',
            marginBottom: '24px'
          }}>
            {/* Status do Cronograma */}
            <div style={{
              padding: '20px',
              background: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '12px',
              border: `2px solid ${corStatus}`,
              boxShadow: `0 0 20px ${corStatus}33`,
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: '0',
                left: '0',
                right: '0',
                height: '2px',
                background: `linear-gradient(90deg, transparent, ${corStatus}, transparent)`,
                animation: 'borderGlow 2s ease-in-out infinite alternate'
              }} />
              
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                {statusAtraso === 'Atrasada' ? (
                  <AlertTriangle style={{ 
                    width: '24px', 
                    height: '24px', 
                    color: corStatus,
                    filter: `drop-shadow(0 0 8px ${corStatus})`
                  }} />
                ) : (
                  <CheckCircle style={{ 
                    width: '24px', 
                    height: '24px', 
                    color: corStatus,
                    filter: `drop-shadow(0 0 8px ${corStatus})`
                  }} />
                )}
                <span style={{ marginLeft: '12px', fontWeight: '600', color: '#ffffff', fontSize: '14px' }}>
                  Status do Cronograma
                </span>
              </div>
              <div style={{ 
                fontSize: '24px', 
                fontWeight: 'bold', 
                color: corStatus,
                textShadow: `0 0 15px ${corStatus}`
              }}>
                {statusAtraso}
              </div>
              {diasAtraso !== 0 && (
                <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '6px' }}>
                  {Math.abs(diasAtraso)} dias {diasAtraso > 0 ? 'de atraso' : 'adiantada'}
                </div>
              )}
            </div>

            {/* Progresso Geral */}
            <div style={{
              padding: '20px',
              background: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '12px',
              border: '2px solid #3b82f6',
              boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: '0',
                left: '0',
                right: '0',
                height: '2px',
                background: 'linear-gradient(90deg, transparent, #3b82f6, transparent)',
                animation: 'borderGlow 2s ease-in-out infinite alternate'
              }} />
              
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                <TrendingUp style={{ 
                  width: '24px', 
                  height: '24px', 
                  color: '#3b82f6',
                  filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.6))'
                }} />
                <span style={{ marginLeft: '12px', fontWeight: '600', color: '#ffffff', fontSize: '14px' }}>
                  Progresso Geral
                </span>
              </div>
              <div style={{ 
                fontSize: '24px', 
                fontWeight: 'bold', 
                color: '#3b82f6',
                textShadow: '0 0 15px rgba(59, 130, 246, 0.8)'
              }}>
                {obra.metricas.progressoGeral}%
              </div>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '6px' }}>
                {obra.metricas.tarefasConcluidas}/{obra.metricas.totalTarefas} tarefas
              </div>
            </div>

            {/* Avanço Físico */}
            {obra.metricas.totalMarcos > 0 && (
              <div style={{
                padding: '20px',
                background: 'rgba(0, 0, 0, 0.3)',
                borderRadius: '12px',
                border: '2px solid #00ff88',
                boxShadow: '0 0 20px rgba(0, 255, 136, 0.3)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '0',
                  left: '0',
                  right: '0',
                  height: '2px',
                  background: 'linear-gradient(90deg, transparent, #00ff88, transparent)',
                  animation: 'borderGlow 2s ease-in-out infinite alternate'
                }} />
                
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                  <Calendar style={{ 
                    width: '24px', 
                    height: '24px', 
                    color: '#00ff88',
                    filter: 'drop-shadow(0 0 8px rgba(0, 255, 136, 0.6))'
                  }} />
                  <span style={{ marginLeft: '12px', fontWeight: '600', color: '#ffffff', fontSize: '14px' }}>
                    Avanço Físico
                  </span>
                </div>
                <div style={{ 
                  fontSize: '24px', 
                  fontWeight: 'bold', 
                  color: '#00ff88',
                  textShadow: '0 0 15px rgba(0, 255, 136, 0.8)'
                }}>
                  {obra.metricas.avancooFisico}%
                </div>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '6px' }}>
                  {obra.metricas.marcosConcluidos}/{obra.metricas.totalMarcos} marcos
                </div>
              </div>
            )}
          </div>

          {/* Informações de Datas */}
          <div style={{
            padding: '20px',
            background: 'rgba(255, 107, 53, 0.1)',
            border: '1px solid rgba(255, 107, 53, 0.3)',
            borderRadius: '12px'
          }}>
            <h4 style={{ 
              fontSize: '16px', 
              fontWeight: '600', 
              marginBottom: '16px', 
              color: '#FF6B35',
              display: 'flex',
              alignItems: 'center'
            }}>
              📅 Cronograma da Obra
            </h4>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '16px',
              fontSize: '13px'
            }}>
              <div style={{
                background: 'rgba(0, 0, 0, 0.3)',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 107, 53, 0.3)'
              }}>
                <div style={{ color: '#94a3b8', marginBottom: '4px', fontSize: '11px' }}>Início Previsto:</div>
                <div style={{ fontWeight: '600', color: '#ffffff' }}>{formatarData(dataInicioBase)}</div>
              </div>
              <div style={{
                background: 'rgba(0, 0, 0, 0.3)',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 107, 53, 0.3)'
              }}>
                <div style={{ color: '#94a3b8', marginBottom: '4px', fontSize: '11px' }}>Início Real:</div>
                <div style={{ fontWeight: '600', color: '#ffffff' }}>{formatarData(dataInicio)}</div>
              </div>
              <div style={{
                background: 'rgba(0, 0, 0, 0.3)',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 107, 53, 0.3)'
              }}>
                <div style={{ color: '#94a3b8', marginBottom: '4px', fontSize: '11px' }}>Término Previsto:</div>
                <div style={{ fontWeight: '600', color: '#ffffff' }}>{formatarData(dataTerminoBase)}</div>
              </div>
              <div style={{
                background: 'rgba(0, 0, 0, 0.3)',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 107, 53, 0.3)'
              }}>
                <div style={{ color: '#94a3b8', marginBottom: '4px', fontSize: '11px' }}>Término Real:</div>
                <div style={{ fontWeight: '600', color: '#ffffff' }}>{formatarData(dataTermino)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Curva de Tendência */}
        <div style={{ padding: '32px' }}>
          <h3 style={{ 
            fontSize: '20px', 
            fontWeight: '600', 
            marginBottom: '20px', 
            color: '#00d4ff',
            textShadow: '0 0 15px rgba(0, 212, 255, 0.5)'
          }}>
            📈 Curva de Tendência - Realizado vs Previsto
          </h3>
          
          <div style={{
            background: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 107, 53, 0.3)',
            padding: '20px'
          }}>
            <CurvaTendencia obra={obra} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ModalDetalhesObra