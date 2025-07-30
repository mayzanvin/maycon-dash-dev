import { useState, useEffect } from 'react'
import { DashboardUnificado as DashboardUnificadoType } from '@/types/obra-unificada'
import DashboardUnificado from '@/components/DashboardUnificado'
import obrasUnificadasData from '@/data/obras-unificadas.json'

function App() {
  const [data, setData] = useState<DashboardUnificadoType | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        // Carregar dados unificados diretamente
        const unifiedData = obrasUnificadasData as DashboardUnificadoType
        setData(unifiedData)
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px'
      }}>
        Carregando dados...
      </div>
    )
  }

  if (!data) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px',
        color: 'red'
      }}>
        Erro ao carregar dados
      </div>
    )
  }

  return <DashboardUnificado data={data} />
}

export default App