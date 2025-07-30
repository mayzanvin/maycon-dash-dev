import { useState } from 'react'
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

  const getFilteredData = () => {
    if (selectedSheet === 'all') {
      return Object.values(data.sheets).flat()
    }
    return data.sheets[selectedSheet] || []
  }

  const filteredData = getFilteredData()

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '30px' }}>
        <h1 style={{ 
          fontSize: '32px', 
          fontWeight: 'bold', 
          color: '#1a1a1a',
          marginBottom: '10px'
        }}>
          Dashboard - Controle de Obras
        </h1>
        <p style={{ color: '#666', fontSize: '16px' }}>
          Acompanhe o progresso e status das obras em tempo real
        </p>
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
  )
}

export default Dashboard