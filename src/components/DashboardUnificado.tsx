import { useState } from 'react'
console.log ("🔥 DASHBOARD UNIFICADO CARREGADO!")
import { DashboardUnificado as DashboardUnificadoType, MetricasGerais, ObraUnificada } from '@/types/obra-unificada'
import MetricasObras from './MetricasObras'
import ListaObrasUnificadas from './ListaObrasUnificadas'
import GraficosUnificados from './GraficosUnificados'
import ModalDetalhesObra from './ModalDetalhesObra'

interface DashboardUnificadoProps {
  data: DashboardUnificadoType
  dataUltimaAtualizacao?: string
}

const DashboardUnificado: React.FC<DashboardUnificadoProps> = ({ data, dataUltimaAtualizacao }) => {
  const [selectedProject, setSelectedProject] = useState<string>('all')
  const [obraSelecionadaModal, setObraSelecionadaModal] = useState<ObraUnificada | null>(null)

  // Cores da Roraima Energia
  const coresRoraima = {
    laranja: '#FF6B35',
    azul: '#0EA5E9',
    azulEscuro: '#0369A1',
    cinzaTexto: '#374151',
    cinzaClaro: '#F3F4F6',
    branco: '#FFFFFF',
    preto: '#000000'
  }

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
      backgroundColor: coresRoraima.branco,
      padding: '0',
      margin: '0',
      width: '100vw',
      boxSizing: 'border-box',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Importar fonte Inter */}
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      
      {/* Container principal */}
      <div style={{ 
        maxWidth: '100%', 
        margin: '0',
        padding: '20px',
        boxSizing: 'border-box'
      }}>
        
        {/* Header corporativo */}
        <header style={{ 
          marginBottom: '40px',
          textAlign: 'center',
          position: 'relative',
          padding: '40px 20px',
          backgroundColor: coresRoraima.branco,
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e2e8f0'
        }}>
          
          {/* Badge SDAT unificado com contorno azul */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '24px',
            position: 'relative',
            zIndex: 2
          }}>
            <div style={{
              border: `2px solid ${coresRoraima.azul}`,
              backgroundColor: 'transparent',
              color: coresRoraima.azul,
              padding: '12px 32px',
              borderRadius: '25px',
              fontSize: '14px',
              fontWeight: '600',
              letterSpacing: '0.5px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: `0 0 0 1px ${coresRoraima.azul}20`,
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={coresRoraima.azul} strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12,6 12,12 16,14"/>
              </svg>
              RORAIMA ENERGIA - SDAT: {dataUltimaAtualizacao || 'Aguardando dados do arquivo'}
            </div>
          </div>
          
          {/* Separador com cores Roraima */}
          <div style={{
            height: '2px',
            background: `linear-gradient(90deg, transparent, ${coresRoraima.azul}, ${coresRoraima.laranja}, ${coresRoraima.azul}, transparent)`,
            marginBottom: '24px',
            maxWidth: '500px',
            margin: '0 auto 24px',
            borderRadius: '1px'
          }} />
          
          {/* Hierarquia do título */}
          <div>
            {/* Subtítulo discreto */}
            <div style={{
              color: coresRoraima.cinzaTexto,
              fontSize: '16px',
              fontWeight: '500',
              letterSpacing: '2px',
              marginBottom: '8px',
              textTransform: 'uppercase',
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
            }}>
              Dashboard
            </div>
            
            {/* Título principal PRETO */}
            <h1 style={{ 
              fontSize: 'clamp(32px, 5vw, 56px)', 
              fontWeight: '800', 
              color: coresRoraima.preto,
              marginBottom: '16px',
              letterSpacing: '1.5px',
              lineHeight: '1.1',
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
            }}>
              CONTROLE DE OBRAS
            </h1>
            
            {/* Descrição funcional */}
            <p style={{ 
              color: coresRoraima.cinzaTexto, 
              fontSize: '15px',
              fontWeight: '500',
              background: coresRoraima.cinzaClaro,
              padding: '10px 20px',
              borderRadius: '25px',
              display: 'inline-block',
              border: '1px solid #e5e7eb',
              maxWidth: '600px',
              lineHeight: '1.4',
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
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
            background: coresRoraima.branco,
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            minWidth: '400px'
          }}>
            <label style={{ 
              display: 'flex', 
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginBottom: '12px', 
              fontWeight: '600', 
              color: coresRoraima.preto,
              fontSize: '16px',
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
            }}>
              <svg 
                width="18" 
                height="18" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke={coresRoraima.preto} 
                strokeWidth="2.5"
              >
                <rect x="3" y="3" width="7" height="9"/>
                <rect x="13" y="3" width="7" height="5"/>
                <rect x="13" y="12" width="7" height="9"/>
                <rect x="3" y="16" width="7" height="5"/>
              </svg>
              Filtrar por Obra:
            </label>
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '8px',
                border: '2px solid #e2e8f0',
                background: coresRoraima.branco,
                color: coresRoraima.cinzaTexto,
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                outline: 'none',
                transition: 'all 0.3s ease',
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = coresRoraima.laranja
                e.target.style.boxShadow = `0 0 0 3px rgba(255, 107, 53, 0.1)`
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e2e8f0'
                e.target.style.boxShadow = 'none'
              }}
            >
              <option value="all">Todas as Obras</option>
              {obras.map((obra) => (
                <option key={obra.codigo} value={obra.codigo}>
                  {obra.nome}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Seção de Métricas com TÍTULO RESTAURADO */}
        <div style={{ 
          marginBottom: '40px',
          backgroundColor: coresRoraima.branco,
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '700',
            marginBottom: '20px',
            color: coresRoraima.preto,
            borderBottom: `3px solid ${coresRoraima.laranja}`,
            paddingBottom: '8px',
            display: 'block',
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
            textAlign: 'center',
            width: '100%',
            textTransform: 'uppercase',
            letterSpacing: '1.5px'
          }}>
            📊 MÉTRICAS GERAIS - TODAS AS OBRAS
          </h2>
          
          <MetricasObras metricas={metricas} />
        </div>

        {/* Seção de Análise Visual com TÍTULO RESTAURADO */}
        <div style={{ 
          marginBottom: '40px',
          backgroundColor: coresRoraima.branco,
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '700',
            marginBottom: '20px',
            color: coresRoraima.preto,
            borderBottom: `3px solid ${coresRoraima.azul}`,
            paddingBottom: '8px',
            display: 'block',
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
            textAlign: 'center',
            width: '100%',
            textTransform: 'uppercase',
            letterSpacing: '1.5px'
          }}>
            📈 ANÁLISE VISUAL
          </h2>
          
          <GraficosUnificados 
            obras={filteredObras} 
            onObraClick={handleObraClick} 
          />
        </div>

        {/* Lista de Obras */}
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