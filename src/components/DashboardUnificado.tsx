import { useState } from 'react'
import { DashboardUnificado as DashboardUnificadoType, MetricasGerais, ObraUnificada } from '@/types/obra-unificada'
import MetricasObras from './MetricasObras'
import ListaObrasUnificadas from './ListaObrasUnificadas'
import GraficosUnificados from './GraficosUnificados'
import ModalDetalhesObra from './ModalDetalhesObra'

interface DashboardUnificadoProps {
  data: DashboardUnificadoType
  dataUltimaAtualizacao?: string // Nova prop para data da planilha
}

const DashboardUnificado: React.FC<DashboardUnificadoProps> = ({ data, dataUltimaAtualizacao }) => {
  const [selectedProject, setSelectedProject] = useState<string>('all')
  const [obraSelecionadaModal, setObraSelecionadaModal] = useState<ObraUnificada | null>(null)

  // Calcular métricas gerais
  const obras = Object.values(data)
  const obrasComExecucao = obras.filter(obra => obra.execucao.totalTarefas > 0)

  const metricas: MetricasGerais = {
    totalObras: obras.length,
    obrasComExecucao: obrasComExecucao.length,
    mediaaProgressoGeral: obras.length > 0 
      ? Math.round(obras.reduce((sum, obra) => sum + obra.metricas.progressoGeral, 0) / obras.length)
      : 0,
    mediaAvancaoFisico: obrasComExecucao.length > 0
      ? Math.round(obrasComExecucao.reduce((sum, obra) => sum + obra.metricas.avancooFisico, 0) / obrasComExecucao.length)
      : 0,
    totalMarcosFisicos: obras.reduce((sum, obra) => sum + obra.metricas.totalMarcos, 0),
    marcosFisicosConcluidos: obras.reduce((sum, obra) => sum + obra.metricas.marcosConcluidos, 0)
  }

  const getFilteredData = () => {
    if (selectedProject === 'all') {
      return obras
    }
    const obra = data[selectedProject]
    return obra ? [obra] : []
  }

  const filteredObras = getFilteredData()

  const handleObraClick = (obra: ObraUnificada) => {
    setObraSelecionadaModal(obra)
  }

  const handleCloseModal = () => {
    setObraSelecionadaModal(null)
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0e1a 0%, #1a1f2e 25%, #0f1629 50%, #1a1f2e 75%, #0a0e1a 100%)',
      padding: '0',
      margin: '0',
      width: '100vw',
      boxSizing: 'border-box'
    }}>
      {/* Container principal */}
      <div style={{ 
        maxWidth: '100%', 
        margin: '0',
        padding: '20px',
        boxSizing: 'border-box'
      }}>
        
        {/* Header corporativo melhorado */}
        <header style={{ 
          marginBottom: '40px',
          textAlign: 'center',
          position: 'relative',
          padding: '32px 20px'
        }}>
          {/* Background effect sutil */}
          <div style={{
            position: 'absolute',
            top: '0',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '60%',
            height: '100%',
            background: 'radial-gradient(ellipse at center, rgba(255, 107, 53, 0.05) 0%, transparent 70%)',
            borderRadius: '50px',
            filter: 'blur(40px)'
          }} />
          
          {/* Linha superior: Badge + Data de atualização */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '24px',
            marginBottom: '20px',
            position: 'relative',
            zIndex: 2
          }}>
            {/* Badge da empresa */}
            <div style={{
              background: 'linear-gradient(135deg, #FF6B35 0%, #ff8c42 100%)',
              color: '#000000',
              padding: '10px 24px',
              borderRadius: '25px',
              fontSize: '13px',
              fontWeight: '700',
              letterSpacing: '1.2px',
              boxShadow: '0 0 15px rgba(255, 107, 53, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              RORAIMA ENERGIA
            </div>
            
            {/* Data da última atualização */}
            <div style={{
              background: 'rgba(0, 212, 255, 0.1)',
              border: '1px solid rgba(0, 212, 255, 0.3)',
              color: '#00d4ff',
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              Última atualização: {dataUltimaAtualizacao || 'Dados carregados'}
            </div>
          </div>
          
          {/* Separador elegante */}
          <div style={{
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(0, 212, 255, 0.6), rgba(255, 107, 53, 0.6), rgba(0, 212, 255, 0.6), transparent)',
            marginBottom: '24px',
            maxWidth: '500px',
            margin: '0 auto 24px',
            position: 'relative',
            zIndex: 2
          }} />
          
          {/* Hierarquia do título melhorada */}
          <div style={{ position: 'relative', zIndex: 2 }}>
            {/* Subtítulo discreto */}
            <div style={{
              color: '#94a3b8',
              fontSize: '16px',
              fontWeight: '500',
              letterSpacing: '2px',
              marginBottom: '8px',
              textTransform: 'uppercase'
            }}>
              Dashboard
            </div>
            
            {/* Título principal mais impactante */}
            <h1 style={{ 
              fontSize: 'clamp(32px, 5vw, 56px)', 
              fontWeight: '800', 
              color: '#ffffff',
              marginBottom: '16px',
              textShadow: '0 0 20px rgba(0, 212, 255, 0.2)',
              letterSpacing: '1.5px',
              lineHeight: '1.1'
            }}>
              CONTROLE DE OBRAS
            </h1>
            
            {/* Descrição funcional */}
            <p style={{ 
              color: '#94a3b8', 
              fontSize: '15px',
              fontWeight: '500',
              background: 'rgba(0, 0, 0, 0.2)',
              padding: '10px 20px',
              borderRadius: '25px',
              display: 'inline-block',
              border: '1px solid rgba(255, 107, 53, 0.2)',
              maxWidth: '600px',
              lineHeight: '1.4'
            }}>
              Visualização unificada: Fiscalização (F) + Execução (E) com avanço físico real
            </p>
          </div>
        </header>

        {/* Seletor de Projeto */}
        <div style={{ 
          marginBottom: '30px',
          display: 'flex',
          justifyContent: 'center'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #0a0e1a 0%, #1a1f2e 100%)',
            padding: '20px',
            borderRadius: '12px',
            border: '2px solid #FF6B35',
            boxShadow: '0 0 20px rgba(255, 107, 53, 0.3)',
            minWidth: '400px'
          }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '12px', 
              fontWeight: '600', 
              color: '#ffffff',
              fontSize: '14px',
              textAlign: 'center'
            }}>
              🔍 Filtrar por Obra:
            </label>
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '8px',
                border: '2px solid #FF6B35',
                background: 'linear-gradient(135deg, #0a0e1a 0%, #1a1f2e 100%)',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.3)',
                outline: 'none',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => {
                e.target.style.boxShadow = '0 0 15px rgba(255, 107, 53, 0.5), inset 0 2px 4px rgba(0, 0, 0, 0.3)'
              }}
              onBlur={(e) => {
                e.target.style.boxShadow = 'inset 0 2px 4px rgba(0, 0, 0, 0.3)'
              }}
            >
              <option value="all" style={{ background: '#1a1f2e', color: '#ffffff' }}>
                Todas as Obras
              </option>
              {obras.map((obra) => (
                <option key={obra.codigo} value={obra.codigo} style={{ background: '#1a1f2e', color: '#ffffff' }}>
                  {obra.nome}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Componentes principais */}
        <MetricasObras metricas={metricas} selectedProject={selectedProject} />
        
        <GraficosUnificados 
          obras={filteredObras} 
          onObraClick={handleObraClick} 
        />
        
        <ListaObrasUnificadas 
          obras={filteredObras}
          showAll={selectedProject === 'all'}
          onObraClick={handleObraClick}
        />

        {/* Modal de Detalhes */}
        <ModalDetalhesObra
          obra={obraSelecionadaModal}
          onClose={handleCloseModal}
        />
      </div>
    </div>
  )
}

export default DashboardUnificado