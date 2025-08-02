// src/components/DashboardUnificado.tsx - CORRIGIDO PARA ELIMINAR ERROS
import { useState } from 'react'
import { DashboardUnificadoType, MetricasGerais, ObraUnificada } from '@/types/obra-unificada'
import MetricasObras from './MetricasObras'
import ListaObrasUnificadas from './ListaObrasUnificadas'
import GraficosUnificados from './GraficosUnificados'
import ModalDetalhesObra from './ModalDetalhesObra'

interface DashboardUnificadoProps {
  data: DashboardUnificadoType
  selectedSheet?: string
}

const DashboardUnificado: React.FC<DashboardUnificadoProps> = ({ data }) => {
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

  // ✅ CORRIGIDO: Nomes padronizados
  const metricas: MetricasGerais = {
    totalObras: obras.length,
    obrasComExecucao: obrasComExecucao.length,
    mediaProgressoGeral: obras.length > 0 
      ? Math.round(obras.reduce((sum, obra) => sum + obra.metricas.progressoGeral, 0) / obras.length)
      : 0,
    mediaAvancaoFisico: obrasComExecucao.length > 0
      ? Math.round(obrasComExecucao.reduce((sum, obra) => sum + obra.metricas.avanceFisico, 0) / obrasComExecucao.length)
      : 0,
    totalMarcosFisicos: obras.reduce((sum, obra) => sum + obra.metricas.totalMarcos, 0),
    marcosFisicosConcluidos: obras.reduce((sum, obra) => sum + obra.metricas.marcosConcluidos, 0)
  }

  const getFilteredData = () => {
    return obras
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
          
          {/* Badge SDAT unificado */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '24px'
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
              gap: '8px'
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={coresRoraima.azul} strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <path d="M9 9h6M9 13h6M9 17h3"/>
              </svg>
              CONTROLE DE OBRAS
            </div>
          </div>

          {/* Título principal */}
          <h1 style={{
            fontSize: '48px',
            fontWeight: '800',
            background: `linear-gradient(135deg, ${coresRoraima.azul} 0%, ${coresRoraima.azulEscuro} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '12px',
            lineHeight: '1.1',
            letterSpacing: '-1px'
          }}>
            Controle de Obras
          </h1>
          
          {/* Subtítulo */}
          <p style={{
            fontSize: '18px',
            color: coresRoraima.cinzaTexto,
            marginBottom: '0',
            fontWeight: '500',
            lineHeight: '1.4'
          }}>
            Visualização unificada: Fiscalização (F) + Execução (E) com avanço físico real
          </p>
        </header>

        {/* Seção de Métricas */}
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
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            textAlign: 'center',
            width: '100%',
            textTransform: 'uppercase',
            letterSpacing: '1.5px'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={coresRoraima.laranja} strokeWidth="2.5">
              <path d="M3 3v18h18"/>
              <path d="M7 16l4-4 4 4 6-6"/>
              <circle cx="11" cy="11" r="2"/>
            </svg>
            MÉTRICAS GERAIS - TODAS AS OBRAS
          </h2>
          
          <MetricasObras metricas={metricas} />
        </div>

        {/* Seção de Análise Visual */}
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
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            textAlign: 'center',
            width: '100%',
            textTransform: 'uppercase',
            letterSpacing: '1.5px'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={coresRoraima.azul} strokeWidth="2.5">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <rect x="7" y="7" width="3" height="9"/>
              <rect x="14" y="7" width="3" height="5"/>
            </svg>
            ANÁLISE VISUAL
          </h2>
          
          {/* ✅ CORRIGIDO: Passando array de obras em vez de data */}
          <GraficosUnificados 
            obras={filteredObras} 
            onObraClick={handleObraClick} 
          />
        </div>

        <ListaObrasUnificadas 
          obras={filteredObras}
          showAll={true}
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