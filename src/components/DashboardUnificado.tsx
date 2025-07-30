import { useState, useEffect } from 'react'
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
  const [currentTime, setCurrentTime] = useState<string>('')

  // Cores da Roraima Energia
  const coresRoraima = {
    laranja: '#FF6B35',      // Laranja principal
    azul: '#0EA5E9',         // Azul principal  
    azulEscuro: '#0369A1',   // Azul mais escuro
    cinzaTexto: '#374151',   // Cinza para textos
    cinzaClaro: '#F3F4F6',   // Cinza muito claro para fundos
    branco: '#FFFFFF',       // Branco puro
    preto: '#000000'         // Preto para títulos
  }

  // Função para atualizar timestamp em tempo real
  useEffect(() => {
    const updateTimestamp = () => {
      const now = new Date()
      const options: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'America/Boa_Vista'
      }
      const timestamp = now.toLocaleString('pt-BR', options)
      setCurrentTime(`Sistema: ${timestamp}`)
    }

    updateTimestamp()
    const interval = setInterval(updateTimestamp, 60000)
    return () => clearInterval(interval)
  }, [])

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
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Container principal */}
      <div style={{ 
        maxWidth: '100%', 
        margin: '0',
        padding: '20px',
        boxSizing: 'border-box'
      }}>
        
        {/* Header corporativo harmonizado */}
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
          
          {/* Linha superior: Badge + Timestamps - CORES RORAIMA */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '24px',
            position: 'relative',
            zIndex: 2,
            flexWrap: 'wrap'
          }}>
            {/* Badge da empresa - AZUL RORAIMA */}
            <div style={{
              background: `linear-gradient(135deg, ${coresRoraima.azul} 0%, ${coresRoraima.azulEscuro} 100%)`,
              color: coresRoraima.branco,
              padding: '10px 24px',
              borderRadius: '25px',
              fontSize: '13px',
              fontWeight: '700',
              letterSpacing: '1.2px',
              boxShadow: `0 2px 8px rgba(14, 165, 233, 0.3)`
            }}>
              RORAIMA ENERGIA
            </div>
            
            {/* Data da Planilha - AZUL RORAIMA */}
            {dataUltimaAtualizacao && (
              <div style={{
                background: '#eff6ff',
                border: `1px solid ${coresRoraima.azul}`,
                color: coresRoraima.azul,
                padding: '6px 12px',
                borderRadius: '15px',
                fontSize: '11px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={coresRoraima.azul} strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                Dados carregados: {dataUltimaAtualizacao}
              </div>
            )}

            {/* Timestamp Sistema - LARANJA RORAIMA */}
            <div style={{
              background: '#fff7ed',
              border: `1px solid ${coresRoraima.laranja}`,
              color: coresRoraima.laranja,
              padding: '6px 12px',
              borderRadius: '15px',
              fontSize: '11px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={coresRoraima.laranja} strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12,6 12,12 16,14"/>
              </svg>
              {currentTime}
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
          
          {/* Hierarquia do título - PRETO */}
          <div>
            {/* Subtítulo discreto */}
            <div style={{
              color: coresRoraima.cinzaTexto,
              fontSize: '16px',
              fontWeight: '500',
              letterSpacing: '2px',
              marginBottom: '8px',
              textTransform: 'uppercase'
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
              lineHeight: '1.1'
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
              lineHeight: '1.4'
            }}>
              Visualização unificada: Fiscalização (F) + Execução (E) com avanço físico real
            </p>
          </div>
        </header>

        {/* Seletor de Projeto - FUNDO BRANCO, TÍTULO PRETO */}
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
              color: coresRoraima.preto, // TÍTULO PRETO
              fontSize: '16px'
            }}>
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke={coresRoraima.preto} 
                strokeWidth="2"
              >
                <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46"/>
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
                transition: 'all 0.3s ease'
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

        {/* Seção de Métricas - TÍTULO PRETO */}
        <div style={{ 
          marginBottom: '40px',
          backgroundColor: coresRoraima.branco,
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '600',
            marginBottom: '20px',
            color: coresRoraima.preto, // TÍTULO PRETO
            borderBottom: `3px solid ${coresRoraima.laranja}`,
            paddingBottom: '8px',
            display: 'inline-block'
          }}>
            ⚡ MÉTRICAS GERAIS - TODAS AS OBRAS
          </h2>
          
          <MetricasObras metricas={metricas} selectedProject={selectedProject} />
        </div>

        {/* Seção de Análise Visual - TÍTULO PRETO */}
        <div style={{ 
          marginBottom: '40px',
          backgroundColor: coresRoraima.branco,
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '600',
            marginBottom: '20px',
            color: coresRoraima.preto, // TÍTULO PRETO
            borderBottom: `3px solid ${coresRoraima.azul}`,
            paddingBottom: '8px',
            display: 'inline-block'
          }}>
            📊 ANÁLISE VISUAL
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