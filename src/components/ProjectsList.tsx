import { useState } from 'react'
import { BaseObraData } from '@/types/obra'
import { ChevronDown, ChevronUp, Search } from 'lucide-react'

interface ProjectsListProps {
  data: BaseObraData[]
  sheetName: string
}

const ProjectsList: React.FC<ProjectsListProps> = ({ data, sheetName }) => {
  const [sortField, setSortField] = useState<keyof BaseObraData>('__Conclu_do')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 50

  const filteredData = data.filter(item =>
    item.Nome_da_Tarefa?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.Resumo__pai_?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const sortedData = [...filteredData].sort((a, b) => {
    const aVal = a[sortField] || 0
    const bVal = b[sortField] || 0
    
    if (sortDirection === 'asc') {
      return aVal > bVal ? 1 : -1
    } else {
      return aVal < bVal ? 1 : -1
    }
  })

  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const totalPages = Math.ceil(sortedData.length / itemsPerPage)

  const handleSort = (field: keyof BaseObraData) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
    setCurrentPage(1)
  }

  const getProgressColor = (progress: number) => {
    if (progress === 100) return '#10b981'
    if (progress > 0) return '#f59e0b'
    return '#ef4444'
  }

  const formatDate = (dateValue: number | string) => {
    if (!dateValue) return '-'
    
    if (typeof dateValue === 'number') {
      // Converter número Excel para data
      const date = new Date((dateValue - 25569) * 86400 * 1000)
      return date.toLocaleDateString('pt-BR')
    }
    
    return dateValue.toString()
  }

  return (
    <div style={{ marginBottom: '30px' }}>
      <h2 style={{ fontSize: '20px', marginBottom: '15px', color: '#333' }}>
        Lista de Tarefas - {sheetName}
      </h2>

      {/* Busca */}
      <div style={{ marginBottom: '15px', position: 'relative' }}>
        <Search 
          style={{ 
            position: 'absolute', 
            left: '10px', 
            top: '50%', 
            transform: 'translateY(-50%)',
            color: '#666',
            width: '16px',
            height: '16px'
          }} 
        />
        <input
          type="text"
          placeholder="Buscar por nome da tarefa ou projeto..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value)
            setCurrentPage(1)
          }}
          style={{
            width: '100%',
            padding: '8px 12px 8px 35px',
            borderRadius: '6px',
            border: '1px solid #ccc',
            fontSize: '14px'
          }}
        />
      </div>

      {/* Informações */}
      <div style={{ marginBottom: '15px', color: '#666', fontSize: '14px' }}>
        Mostrando {paginatedData.length} de {sortedData.length} tarefas
        {searchTerm && ` (filtrado de ${data.length} total)`}
      </div>

      {/* Tabela */}
      <div style={{ 
        backgroundColor: 'white',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        border: '1px solid #e0e0e0'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{ ...headerStyle, cursor: 'pointer' }} onClick={() => handleSort('EDT')}>
                  EDT {sortField === 'EDT' && (sortDirection === 'asc' ? <ChevronUp style={iconStyle} /> : <ChevronDown style={iconStyle} />)}
                </th>
                <th style={{ ...headerStyle, cursor: 'pointer' }} onClick={() => handleSort('Nome_da_Tarefa')}>
                  Nome da Tarefa {sortField === 'Nome_da_Tarefa' && (sortDirection === 'asc' ? <ChevronUp style={iconStyle} /> : <ChevronDown style={iconStyle} />)}
                </th>
                <th style={{ ...headerStyle, cursor: 'pointer' }} onClick={() => handleSort('N_vel')}>
                  Nível {sortField === 'N_vel' && (sortDirection === 'asc' ? <ChevronUp style={iconStyle} /> : <ChevronDown style={iconStyle} />)}
                </th>
                <th style={{ ...headerStyle, cursor: 'pointer' }} onClick={() => handleSort('__Conclu_do')}>
                  % Concluído {sortField === '__Conclu_do' && (sortDirection === 'asc' ? <ChevronUp style={iconStyle} /> : <ChevronDown style={iconStyle} />)}
                </th>
                <th style={headerStyle}>Data Início</th>
                <th style={headerStyle}>Data Término</th>
                <th style={headerStyle}>Projeto</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item, index) => (
                <tr key={index} style={{ 
                  borderBottom: '1px solid #e0e0e0'
                }}>
                  <td style={cellStyle}>{item.EDT}</td>
                  <td style={{ ...cellStyle, maxWidth: '300px' }}>
                    <div 
                      style={{ 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis', 
                        whiteSpace: 'nowrap'
                      }}
                      title={item.Nome_da_Tarefa}
                    >
                      {item.Nome_da_Tarefa}
                    </div>
                  </td>
                  <td style={cellStyle}>{item.N_vel}</td>
                  <td style={cellStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{
                        width: '40px',
                        height: '6px',
                        backgroundColor: '#e0e0e0',
                        borderRadius: '3px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${item.__Conclu_do || 0}%`,
                          height: '100%',
                          backgroundColor: getProgressColor(item.__Conclu_do || 0),
                          borderRadius: '3px'
                        }} />
                      </div>
                      <span style={{ 
                        fontSize: '12px', 
                        fontWeight: '600',
                        color: getProgressColor(item.__Conclu_do || 0)
                      }}>
                        {item.__Conclu_do || 0}%
                      </span>
                    </div>
                  </td>
                  <td style={cellStyle}>{formatDate(item.Data_In_cio)}</td>
                  <td style={cellStyle}>{formatDate(item.Data_T_rmino)}</td>
                  <td style={{ ...cellStyle, maxWidth: '200px' }}>
                    <div 
                      style={{ 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis', 
                        whiteSpace: 'nowrap'
                      }}
                      title={item.Resumo__pai_}
                    >
                      {item.Resumo__pai_}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginação */}
        {totalPages > 1 && (
          <div style={{ 
            padding: '15px', 
            borderTop: '1px solid #e0e0e0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{ fontSize: '14px', color: '#666' }}>
              Página {currentPage} de {totalPages}
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                style={{
                  padding: '6px 12px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  backgroundColor: currentPage === 1 ? '#f5f5f5' : 'white',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                }}
              >
                Anterior
              </button>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                style={{
                  padding: '6px 12px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  backgroundColor: currentPage === totalPages ? '#f5f5f5' : 'white',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
                }}
              >
                Próxima
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const headerStyle = {
  padding: '12px',
  textAlign: 'left' as const,
  fontWeight: '600',
  fontSize: '14px',
  color: '#333',
  borderBottom: '1px solid #e0e0e0',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px'
}

const cellStyle = {
  padding: '12px',
  fontSize: '14px',
  color: '#333',
  borderBottom: '1px solid #f0f0f0'
}

const iconStyle = {
  width: '14px',
  height: '14px'
}

export default ProjectsList