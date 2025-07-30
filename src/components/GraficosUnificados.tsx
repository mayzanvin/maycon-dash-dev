import { ObraUnificada } from '@/types/obra-unificada'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface GraficosUnificadosProps {
  obras: ObraUnificada[]
  onObraClick: (obra: ObraUnificada) => void
}

const GraficosUnificados: React.FC<GraficosUnificadosProps> = ({ obras, onObraClick }) => {
  
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
    { name: 'Marcos Concluídos', value: marcosConcluidos, cor: '#00ff88' },
    { name: 'Marcos Pendentes', value: marcosPendentes, cor: '#ff4444' }
  ]

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: 'linear-gradient(135deg, #0a0e1a 0%, #1a1f2e 100%)',
          border: '2px solid #FF6B35',
          borderRadius: '8px',
          padding: '12px',
          boxShadow: '0 0 20px rgba(255, 107, 53, 0.5)',
          color: '#ffffff'
        }}>
          <p style={{ color: '#00d4ff', fontWeight: 'bold', marginBottom: '8px' }}>{label}</p>
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
          background: 'linear-gradient(135deg, #0a0e1a 0%, #1a1f2e 100%)',
          border: '2px solid #FF6B35',
          borderRadius: '8px',
          padding: '12px',
          boxShadow: '0 0 20px rgba(255, 107, 53, 0.5)',
          color: '#ffffff'
        }}>
          <p style={{ color: data.payload.cor, fontWeight: 'bold', marginBottom: '4px' }}>
            {data.name}
          </p>
          <p style={{ color: '#94a3b8' }}>
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
    <div style={{ marginBottom: '30px' }}>
      <h2 style={{ 
        fontSize: '20px', 
        marginBottom: '20px', 
        color: '#00d4ff',
        fontWeight: '700',
        textAlign: 'center',
        textShadow: '0 0 20px rgba(0, 212, 255, 0.5)',
        letterSpacing: '1px'
      }}>
        ◈ ANÁLISE VISUAL
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 400px 1fr',
        gap: '24px',
        alignItems: 'start',
        minHeight: '400px'
      }}>
        
        {/* Gráfico de Barras */}
        <div style={{
          background: 'linear-gradient(135deg, #0a0e1a 0%, #1a1f2e 50%, #0a0e1a 100%)',
          borderRadius: '16px',
          padding: '24px',
          border: '2px solid #FF6B35',
          boxShadow: `
            0 0 30px rgba(255, 107, 53, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.1)
          `,
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            height: '2px',
            background: 'linear-gradient(90deg, transparent, #FF6B35, transparent)',
            animation: 'borderGlow 2s ease-in-out infinite alternate'
          }} />
          
          <h3 style={{
            color: '#ffffff',
            fontSize: '16px',
            fontWeight: '600',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            📊 Progresso das Obras
          </h3>
          
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dadosBarras} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <defs>
                <linearGradient id="progressoGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00d4ff" stopOpacity={1}/>
                  <stop offset="100%" stopColor="#0066cc" stopOpacity={0.8}/>
                </linearGradient>
                <linearGradient id="avancooGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00ff88" stopOpacity={1}/>
                  <stop offset="100%" stopColor="#00cc66" stopOpacity={0.8}/>
                </linearGradient>
              </defs>
              
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="rgba(255, 107, 53, 0.2)"
                vertical={false}
              />
              <XAxis 
                dataKey="nome" 
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                axisLine={{ stroke: '#FF6B35' }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                axisLine={{ stroke: '#FF6B35' }}
                domain={[0, 100]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ color: '#ffffff' }}
                iconType="rect"
              />
              <Bar 
                dataKey="progressoGeral" 
                fill="url(#progressoGrad)"
                name="Progresso Geral"
                radius={[4, 4, 0, 0]}
                style={{
                  filter: 'drop-shadow(0 0 8px rgba(0, 212, 255, 0.5))'
                }}
              />
              <Bar 
                dataKey="avancooFisico" 
                fill="url(#avancooGrad)"
                name="Avanço Físico"
                radius={[4, 4, 0, 0]}
                style={{
                  filter: 'drop-shadow(0 0 8px rgba(0, 255, 136, 0.5))'
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Mapa de Roraima */}
        <div style={{
          background: 'linear-gradient(135deg, #0a0e1a 0%, #1a1f2e 50%, #0a0e1a 100%)',
          borderRadius: '16px',
          padding: '24px',
          border: '2px solid #FF6B35',
          boxShadow: `
            0 0 30px rgba(255, 107, 53, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.1)
          `,
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minHeight: '400px'
        }}>
          <div style={{
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            height: '2px',
            background: 'linear-gradient(90deg, transparent, #FF6B35, transparent)',
            animation: 'borderGlow 2s ease-in-out infinite alternate'
          }} />
          
          <h3 style={{
            color: '#ffffff',
            fontSize: '16px',
            fontWeight: '600',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            🗺️ Roraima - Localização das Obras
          </h3>
          
          <svg width="300" height="280" viewBox="0 0 300 280" style={{ 
            background: 'radial-gradient(circle at center, rgba(0, 212, 255, 0.1) 0%, transparent 70%)',
            borderRadius: '8px'
          }}>
            {/* Contorno de Roraima simplificado */}
            <path
              d="M50 50 L250 60 L240 180 L200 220 L150 240 L100 220 L60 180 Z"
              fill="rgba(0, 212, 255, 0.1)"
              stroke="#00d4ff"
              strokeWidth="2"
              style={{
                filter: 'drop-shadow(0 0 10px rgba(0, 212, 255, 0.5))'
              }}
            />
            
            {/* Grid cyber de fundo */}
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255, 107, 53, 0.2)" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            
            {/* Pontos das obras */}
            {obras.slice(0, 6).map((obra, idx) => {
              const x = 80 + (idx % 3) * 60
              const y = 80 + Math.floor(idx / 3) * 60
              const cor = obra.metricas.avancooFisico > 80 ? '#00ff88' : 
                         obra.metricas.avancooFisico > 50 ? '#f59e0b' : '#ff4444'
              
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
                      filter: `drop-shadow(0 0 8px ${cor})`,
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
                    style={{
                      animation: 'pulse 2s ease-in-out infinite'
                    }}
                  />
                </g>
              )
            })}
            
            {/* Coordenadas geográficas */}
            <text x="20" y="25" fill="#94a3b8" fontSize="10">5°N</text>
            <text x="20" y="260" fill="#94a3b8" fontSize="10">0°N</text>
            <text x="20" y="275" fill="#94a3b8" fontSize="10">64°W</text>
            <text x="260" y="275" fill="#94a3b8" fontSize="10">58°W</text>
          </svg>
          
          {/* Legenda */}
          <div style={{
            marginTop: '16px',
            display: 'flex',
            gap: '16px',
            fontSize: '12px',
            color: '#94a3b8'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ 
                width: '8px', 
                height: '8px', 
                borderRadius: '50%', 
                background: '#00ff88',
                boxShadow: '0 0 4px #00ff88'
              }} />
              <span>Avançado (&gt;80%)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ 
                width: '8px', 
                height: '8px', 
                borderRadius: '50%', 
                background: '#f59e0b',
                boxShadow: '0 0 4px #f59e0b'
              }} />
              <span>Médio (50-80%)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ 
                width: '8px', 
                height: '8px', 
                borderRadius: '50%', 
                background: '#ff4444',
                boxShadow: '0 0 4px #ff4444'
              }} />
              <span>Inicial (&lt;50%)</span>
            </div>
          </div>
        </div>

        {/* Gráfico de Pizza */}
        <div style={{
          background: 'linear-gradient(135deg, #0a0e1a 0%, #1a1f2e 50%, #0a0e1a 100%)',
          borderRadius: '16px',
          padding: '24px',
          border: '2px solid #FF6B35',
          boxShadow: `
            0 0 30px rgba(255, 107, 53, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.1)
          `,
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            height: '2px',
            background: 'linear-gradient(90deg, transparent, #FF6B35, transparent)',
            animation: 'borderGlow 2s ease-in-out infinite alternate'
          }} />
          
          <h3 style={{
            color: '#ffffff',
            fontSize: '16px',
            fontWeight: '600',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            🎯 Marcos Físicos
          </h3>
          
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <defs>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge> 
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              <Pie
                data={dadosPizza}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                style={{
                  filter: 'url(#glow)'
                }}
              >
                {dadosPizza.map((entry, index) => (
                  <Cell 
                    key={'cell-' + String(index)} 
                    fill={entry.cor}
                    style={{
                      filter: `drop-shadow(0 0 8px ${entry.cor})`
                    }}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomPieTooltip />} />
              <Legend 
                wrapperStyle={{ color: '#ffffff' }}
                iconType="rect"
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default GraficosUnificados