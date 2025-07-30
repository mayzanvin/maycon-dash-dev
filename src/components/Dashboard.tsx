console.log("🔥 VERSÃO NOVA CARREGADA - FUNDO BRANCO!")
import { useState, useEffect } from 'react'
import { DashboardData } from '@/types/obra'
import MetricsCards from './MetricsCards'
import ProjectsList from './ProjectsList'
import ChartsSection from './ChartsSection'
import SheetSelector from './SheetSelector'

interface DashboardProps {
  data: DashboardData
}

const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  const [selectedSheet, setSelectedSheet] = useState<string>('all')
  const [currentTime, setCurrentTime] = useState<string>('')

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
      setCurrentTime(`Última atualização: ${timestamp}`)
    }

    updateTimestamp()
    const interval = setInterval(updateTimestamp, 60000)
    return () => clearInterval(interval)
  }, [])

  const getFilteredData = () => {
    if (selectedSheet === 'all') {
      return Object.values(data.sheets).flat()
    }
    return data.sheets[selectedSheet] || []
  }

  const filteredData = getFilteredData()

  const containerStyle = {
    minHeight: '100vh',
    backgroundColor: '#ffffff',
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  }

  const headerStyle = {
    background: 'linear-gradient(135deg, #1a365d 0%, #2c5282 50%, #3182ce 100%)',
    color: 'white',
    padding: '40px 30px',
    borderRadius: '12px',
    marginBottom: '30px',
    position: 'relative' as const,
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
  }

  const decorativeElementStyle = {
    position: 'absolute' as const,
    top: '-30%',
    right: '-10%',
    width: '300px',
    height: '300px',
    background: 'rgba(255, 107, 53, 0.1)',
    borderRadius: '50%',
    filter: 'blur(100px)'
  }

  const titleStyle = {
    fontSize: '36px',
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: '8px',
    letterSpacing: '0.5px',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
  }

  const subtitleStyle = {
    color: '#e2e8f0',
    fontSize: '18px',
    marginBottom: '20px',
    fontWeight: '400'
  }

  const timestampContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: '8px 16px',
    borderRadius: '20px',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)'
  }

  const timestampStyle = {
    color: '#FF6B35',
    fontSize: '14px',
    fontWeight: '600'
  }

  const contentWrapperStyle = {
    maxWidth: '1400px',
    margin: '0 auto'
  }

  return (
    <div style={containerStyle}>
      <div style={contentWrapperStyle}>
        <header style={headerStyle}>
          <div style={decorativeElementStyle}></div>
          
          <div style={{ position: 'relative', zIndex: 2 }}>
            <h1 style={titleStyle}>
              Controle de Obras
            </h1>
            <p style={subtitleStyle}>
              Visualização unificada: Fiscalização (F) + Execução (E) com avanço físico real
            </p>
            
            <div style={timestampContainerStyle}>
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="#FF6B35" 
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12,6 12,12 16,14"/>
              </svg>
              <span style={timestampStyle}>{currentTime}</span>
            </div>
          </div>
        </header>

        <SheetSelector
          sheets={data.sheetNames}
          selectedSheet={selectedSheet}
          onSheetChange={setSelectedSheet}
        />

        <MetricsCards 
          data={filteredData}
          selectedSheet={selectedSheet}
        />

        <ChartsSection data={filteredData} />

        <ProjectsList 
          data={filteredData}
          sheetName={selectedSheet === 'all' ? 'Todas as Obras' : selectedSheet}
        />
      </div>
    </div>
  )
}

export default Dashboard