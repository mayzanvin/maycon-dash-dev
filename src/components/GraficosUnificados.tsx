import { ObraUnificada } from '@/types/obra-unificada'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface GraficosUnificadosProps {
  obras: ObraUnificada[]
  onObraClick: (obra: ObraUnificada) => void
}

const GraficosUnificados: React.FC<GraficosUnificadosProps> = ({ obras, onObraClick }) => {
  
  // Cores da Roraima Energia
  const coresRoraima = {
    azul: '#0EA5E9',
    verde: '#10B981',
    laranja: '#FF6B35',
    roxo: '#8B5CF6',
    vermelho: '#EF4444',
    amarelo: '#F59E0B',
    preto: '#000000',
    cinza: '#374151'
  }

  // Dados para gráfico de barras - Top 5 obras
  const dadosBarras = obras
    .slice(0, 5)
    .map(obra => ({
      nome: obra.nome.length > 15 ? obra.nome.substring(0, 15) + '...' : obra.nome,
      progressoGeral: obra.metricas.progressoGeral,
      avancooFisico: obra.metricas.avancooFisico
    }))

  // Dados para gráfico de pizza - Marcos físicos
  const totalMarcos = obras.reduce((sum, obra) => sum + obra.metricas.totalMarcos, 0)
  const marcosConcluidos = obras.reduce((sum, obra) => sum + obra.metricas.marcosConcluidos, 0)
  const marcosPendentes = totalMarcos - marcosConcluidos

  const dadosPizza = [
    { name: 'Marcos Concluídos', value: marcosConcluidos, cor: coresRoraima.verde },
    { name: 'Marcos Pendentes', value: marcosPendentes, cor: coresRoraima.vermelho }
  ]

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: '#ffffff',
          border: `2px solid ${coresRoraima.laranja}`,
          borderRadius: '8px',
          padding: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          color: coresRoraima.preto
        }}>
          <p style={{ color: coresRoraima.preto, fontWeight: 'bold', marginBottom: '8px' }}>{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color, margin: '4px 0' }}>
              {entry.dataKey === 'progressoGeral' ? 'Progresso Geral' : 'Avanço Físico'}: {entry.value}%
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  // Custom tooltip para pizza
  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0]
      const percentual = totalMarcos > 0 ? ((data.value / totalMarcos) * 100).toFixed(1) : 0
      return (
        <div style={{
          backgroundColor: '#ffffff',
          border: `2px solid ${coresRoraima.laranja}`,
          borderRadius: '8px',
          padding: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          color: coresRoraima.preto
        }}>
          <p style={{ color: data.payload.cor, fontWeight: 'bold', marginBottom: '4px' }}>
            {data.name}
          </p>
          <p style={{ color: coresRoraima.cinza }}>
            {data.value} marcos ({percentual}%)
          </p>
        </div>
      )
    }
    return null
  }

  // Função para renderizar label da pizza
  const renderLabel = (entry: any) => {
    const percent = totalMarcos > 0 ? ((entry.value / totalMarcos) * 100).toFixed(1) : 0
    return String(percent) + '%'
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 400px 1fr',
      gap: '24px',
      alignItems: 'start',
      minHeight: '400px'
    }}>
      
      {/* Gráfico de Barras */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '24px',
        border: '2px solid #e2e8f0',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
      }}>
        <h3 style={{
          color: coresRoraima.preto,
          fontSize: '18px',
          fontWeight: '600',
          marginBottom: '20px',
          textAlign: 'center',
          borderBottom: `2px solid ${coresRoraima.azul}`,
          paddingBottom: '8px'
        }}>
          📊 Progresso das Obras
        </h3>
        
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dadosBarras} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <defs>
              <linearGradient id="progressoGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={coresRoraima.azul} stopOpacity={1}/>
                <stop offset="100%" stopColor={coresRoraima.azul} stopOpacity={0.7}/>
              </linearGradient>
              <linearGradient id="avancooGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={coresRoraima.verde} stopOpacity={1}/>
                <stop offset="100%" stopColor={coresRoraima.verde} stopOpacity={0.7}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#e2e8f0"
              vertical={false}
            />
            <XAxis 
              dataKey="nome" 
              tick={{ fill: coresRoraima.cinza, fontSize: 11 }}
              axisLine={{ stroke: coresRoraima.laranja }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              tick={{ fill: coresRoraima.cinza, fontSize: 12 }}
              axisLine={{ stroke: coresRoraima.laranja }}
              domain={[0, 100]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ color: coresRoraima.preto }}
              iconType="rect"
            />
            <Bar 
              dataKey="progressoGeral" 
              fill="url(#progressoGrad)"
              name="Progresso Geral"
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="avancooFisico" 
              fill="url(#avancooGrad)"
              name="Avanço Físico"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Mapa de Roraima */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '24px',
        border: '2px solid #e2e8f0',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '400px'
      }}>
        <h3 style={{
          color: coresRoraima.preto,
          fontSize: '18px',
          fontWeight: '600',
          marginBottom: '20px',
          textAlign: 'center',
          borderBottom: `2px solid ${coresRoraima.azul}`,
          paddingBottom: '8px'
        }}>
          🗺️ Roraima - Localização das Obras
        </h3>
        
        <svg width="300" height="280" viewBox="0 0 300 280" style={{ 
          background: '#f8fafc',
          borderRadius: '8px',
          border: '1px solid #e2e8f0'
        }}>
          {/* Contorno de Roraima simplificado */}
          <path
            d="M50 50 L250 60 L240 180 L200 220 L150 240 L100 220 L60 180 Z"
            fill="rgba(14, 165, 233, 0.1)"
            stroke={coresRoraima.azul}
            strokeWidth="2"
          />
          
          {/* Grid sutil de fundo */}
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e2e8f0" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* Pontos das obras */}
          {obras.slice(0, 6).map((obra, idx) => {
            const x = 80 + (idx % 3) * 60
            const y = 80 + Math.floor(idx / 3) * 60
            const cor = obra.metricas.avancooFisico > 80 ? coresRoraima.verde : 
                       obra.metricas.avancooFisico > 50 ? coresRoraima.amarelo : coresRoraima.vermelho
            
            return (
              <g key={obra.codigo}>
                <circle
                  cx={x}
                  cy={y}
                  r="8"
                  fill={cor}
                  stroke="#ffffff"
                  strokeWidth="2"
                  style={{
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => onObraClick(obra)}
                />
                <circle
                  cx={x}
                  cy={y}
                  r="12"
                  fill="none"
                  stroke={cor}
                  strokeWidth="1"
                  opacity="0.5"
                />
              </g>
            )
          })}
          
          {/* Coordenadas geográficas */}
          <text x="20" y="25" fill={coresRoraima.cinza} fontSize="10">5°N</text>
          <text x="20" y="260" fill={coresRoraima.cinza} fontSize="10">0°N</text>
          <text x="20" y="275" fill={coresRoraima.cinza} fontSize="10">64°W</text>
          <text x="260" y="275" fill={coresRoraima.cinza} fontSize="10">58°W</text>
        </svg>
        
        {/* Legenda */}
        <div style={{
          marginTop: '16px',
          display: 'flex',
          gap: '16px',
          fontSize: '12px',
          color: coresRoraima.cinza
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div style={{ 
              width: '8px', 
              height: '8px', 
              borderRadius: '50%', 
              background: coresRoraima.verde
            }} />
            <span>Avançado (&gt;80%)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div style={{ 
              width: '8px', 
              height: '8px', 
              borderRadius: '50%', 
              background: coresRoraima.amarelo
            }} />
            <span>Médio (50-80%)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div style={{ 
              width: '8px', 
              height: '8px', 
              borderRadius: '50%', 
              background: coresRoraima.vermelho
            }} />
            <span>Inicial (&lt;50%)</span>
          </div>
        </div>
      </div>

      {/* Gráfico de Pizza */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '24px',
        border: '2px solid #e2e8f0',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
      }}>
        <h3 style={{
          color: coresRoraima.preto,
          fontSize: '18px',
          fontWeight: '600',
          marginBottom: '20px',
          textAlign: 'center',
          borderBottom: `2px solid ${coresRoraima.verde}`,
          paddingBottom: '8px'
        }}>
          🎯 Marcos Físicos
        </h3>
        
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={dadosPizza}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {dadosPizza.map((entry, index) => (
                <Cell 
                  key={'cell-' + String(index)} 
                  fill={entry.cor}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomPieTooltip />} />
            <Legend 
              wrapperStyle={{ color: coresRoraima.preto }}
              iconType="rect"
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default GraficosUnificados