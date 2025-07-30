import { BaseObraData } from '@/types/obra'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface ChartsSectionProps {
  data: BaseObraData[]
}

const ChartsSection: React.FC<ChartsSectionProps> = ({ data }) => {
  // Dados para gráfico de pizza - Status das tarefas
  const statusData = [
    { 
      name: 'Concluídas', 
      value: data.filter(task => (task.__Conclu_do || 0) === 100).length,
      color: '#00ff88'
    },
    { 
      name: 'Em Andamento', 
      value: data.filter(task => (task.__Conclu_do || 0) > 0 && (task.__Conclu_do || 0) < 100).length,
      color: '#00d4ff'
    },
    { 
      name: 'Pendentes', 
      value: data.filter(task => (task.__Conclu_do || 0) === 0).length,
      color: '#ff6b6b'
    }
  ]

  // Dados para gráfico de barras com melhor formatação dos nomes
  const obraData = data.slice(0, 6).map((obra, index) => {
    const nomeOriginal = (obra as any).Obra || `Obra ${index + 1}`
    const nomeFormatado = nomeOriginal.length > 15 
      ? `${nomeOriginal.substring(0, 15)}...` 
      : nomeOriginal
    
    return {
      nome: nomeOriginal,
      nomeFormatado: nomeFormatado,
      avancoFisico: Math.round(obra.__Conclu_do || 0),
      progressoGeral: Math.round(obra.__Conclu_do || 0)
    }
  })

  // Tooltip customizado cyber
  const CyberTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: 'rgba(10, 10, 26, 0.95)',
          border: '2px solid #00d4ff',
          borderRadius: '10px',
          padding: '15px',
          color: '#ffffff',
          boxShadow: '0 0 20px rgba(0, 212, 255, 0.5)',
          backdropFilter: 'blur(10px)'
        }}>
          <p style={{ 
            color: '#00d4ff', 
            fontWeight: 'bold', 
            marginBottom: '10px',
            fontSize: '14px'
          }}>
            {label}
          </p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ 
              color: entry.color, 
              margin: '5px 0',
              fontSize: '13px',
              fontWeight: '500'
            }}>
              <span style={{ color: '#00d4ff' }}>●</span> {entry.name}: {entry.value}%
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  // Label customizado para pizza
  const CyberPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text 
        x={x} 
        y={y} 
        fill="#ffffff" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize="13"
        fontWeight="bold"
        style={{
          textShadow: '0 0 10px rgba(0, 212, 255, 0.8)'
        }}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  return (
    <div style={{ marginBottom: '40px', padding: '0 20px' }}>
      <h2 style={{ 
        fontSize: '28px', 
        marginBottom: '30px', 
        color: '#ffffff',
        textAlign: 'center',
        textShadow: '0 0 20px rgba(0, 212, 255, 0.8)',
        fontWeight: '700'
      }}>
        ⚡ Dashboard Analítico Avançado
      </h2>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 320px 1fr', 
        gap: '30px',
        alignItems: 'start'
      }}>
        {/* Gráfico de Barras - Esquerda */}
        <div style={{ 
          background: 'rgba(10, 10, 26, 0.8)',
          backdropFilter: 'blur(20px)',
          border: '2px solid #00d4ff',
          borderRadius: '20px',
          padding: '30px',
          boxShadow: `
            0 0 30px rgba(0, 212, 255, 0.3),
            0 15px 35px rgba(0, 0, 0, 0.5),
            inset 0 1px 0 rgba(255, 255, 255, 0.1)
          `,
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(45deg, transparent 30%, rgba(0, 212, 255, 0.02) 50%, transparent 70%)',
            pointerEvents: 'none'
          }} />
          
          <h3 style={{ 
            fontSize: '18px', 
            marginBottom: '25px', 
            color: '#00d4ff',
            textAlign: 'center',
            fontWeight: 'bold',
            textShadow: '0 0 15px rgba(0, 212, 255, 0.8)'
          }}>
            📊 Progresso por Obra
          </h3>
          
          <ResponsiveContainer width="100%" height={420}>
            <BarChart 
              data={obraData}
              margin={{ top: 20, right: 30, left: 20, bottom: 180 }}
              barCategoryGap="20%"
            >
              <defs>
                <linearGradient id="progressoGeralGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00d4ff" stopOpacity={1}/>
                  <stop offset="100%" stopColor="#0066cc" stopOpacity={0.8}/>
                </linearGradient>
                <linearGradient id="avancoFisicoGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00ff88" stopOpacity={1}/>
                  <stop offset="100%" stopColor="#00cc66" stopOpacity={0.8}/>
                </linearGradient>
              </defs>
              
              <CartesianGrid 
                strokeDasharray="2 2" 
                stroke="rgba(0, 212, 255, 0.2)"
                vertical={false}
              />
              
              <XAxis 
                dataKey="nomeFormatado"
                tick={{ 
                  fill: '#ffffff', 
                  fontSize: 10,
                  fontWeight: '500'
                }}
                axisLine={{ stroke: 'rgba(0, 212, 255, 0.5)', strokeWidth: 2 }}
                tickLine={{ stroke: 'rgba(0, 212, 255, 0.5)' }}
                angle={-45}
                textAnchor="end"
                height={140}
                interval={0}
              />
              
              <YAxis 
                tick={{ 
                  fill: '#ffffff', 
                  fontSize: 12,
                  fontWeight: '500'
                }}
                axisLine={{ stroke: 'rgba(0, 212, 255, 0.5)', strokeWidth: 2 }}
                tickLine={{ stroke: 'rgba(0, 212, 255, 0.5)' }}
                domain={[0, 100]}
              />
              
              <Tooltip content={<CyberTooltip />} />
              
              <Legend 
                verticalAlign="bottom"
                align="center"
                wrapperStyle={{
                  paddingTop: '60px',
                  paddingBottom: '10px',
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: '600',
                  position: 'absolute',
                  bottom: '10px',
                  left: '50%',
                  transform: 'translateX(-50%)'
                }}
                iconType="rect"
              />
              
              <Bar 
                dataKey="progressoGeral" 
                fill="url(#progressoGeralGrad)"
                name="Progresso Geral %"
                radius={[6, 6, 0, 0]}
                stroke="#00d4ff"
                strokeWidth={1}
                style={{
                  filter: 'drop-shadow(0 0 10px rgba(0, 212, 255, 0.6))'
                }}
              />
              
              <Bar 
                dataKey="avancoFisico" 
                fill="url(#avancoFisicoGrad)"
                name="Avanço Físico %"
                radius={[6, 6, 0, 0]}
                stroke="#00ff88"
                strokeWidth={1}
                style={{
                  filter: 'drop-shadow(0 0 10px rgba(0, 255, 136, 0.6))'
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Mapa de Roraima - Centro */}
        <div style={{ 
          background: 'rgba(10, 10, 26, 0.8)',
          backdropFilter: 'blur(20px)',
          border: '2px solid #00d4ff',
          borderRadius: '20px',
          padding: '25px',
          boxShadow: `
            0 0 30px rgba(0, 212, 255, 0.3),
            0 15px 35px rgba(0, 0, 0, 0.5),
            inset 0 1px 0 rgba(255, 255, 255, 0.1)
          `,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '500px'
        }}>
          <h3 style={{ 
            fontSize: '18px', 
            marginBottom: '20px', 
            color: '#00d4ff',
            textAlign: 'center',
            fontWeight: 'bold',
            textShadow: '0 0 15px rgba(0, 212, 255, 0.8)'
          }}>
            🗺️ Mapa de Roraima
          </h3>
          
          <div style={{
            width: '250px',
            height: '350px',
            background: 'rgba(0, 212, 255, 0.1)',
            border: '2px dashed rgba(0, 212, 255, 0.4)',
            borderRadius: '15px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'rgba(0, 212, 255, 0.7)',
            fontSize: '14px',
            textAlign: 'center',
            padding: '20px',
            position: 'relative'
          }}>
            <div style={{
              fontSize: '48px',
              marginBottom: '15px',
              filter: 'drop-shadow(0 0 10px rgba(0, 212, 255, 0.5))'
            }}>
              🌎
            </div>
            <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
              Estado de Roraima
            </div>
            <div style={{ fontSize: '12px', opacity: 0.8 }}>
              Localização das Obras
            </div>
            <div style={{ 
              position: 'absolute',
              bottom: '15px',
              fontSize: '11px',
              opacity: 0.6
            }}>
              Coordenadas serão inseridas aqui
            </div>
          </div>
        </div>

        {/* Gráfico de Pizza - Direita */}
        <div style={{ 
          background: 'rgba(10, 10, 26, 0.8)',
          backdropFilter: 'blur(20px)',
          border: '2px solid #00d4ff',
          borderRadius: '20px',
          padding: '30px',
          boxShadow: `
            0 0 30px rgba(0, 212, 255, 0.3),
            0 15px 35px rgba(0, 0, 0, 0.5),
            inset 0 1px 0 rgba(255, 255, 255, 0.1)
          `,
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(45deg, transparent 30%, rgba(0, 212, 255, 0.02) 50%, transparent 70%)',
            pointerEvents: 'none'
          }} />
          
          <h3 style={{ 
            fontSize: '20px', 
            marginBottom: '25px', 
            color: '#00d4ff',
            textAlign: 'center',
            fontWeight: 'bold',
            textShadow: '0 0 15px rgba(0, 212, 255, 0.8)'
          }}>
            🎯 Status das Obras
          </h3>
          
          <ResponsiveContainer width="100%" height={380}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="45%"
                labelLine={false}
                label={CyberPieLabel}
                outerRadius={110}
                innerRadius={40}
                fill="#8884d8"
                dataKey="value"
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth={3}
              >
                {statusData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color}
                    style={{
                      filter: `drop-shadow(0 0 15px ${entry.color}60)`
                    }}
                  />
                ))}
              </Pie>
              <Tooltip content={<CyberTooltip />} />
              <Legend 
                verticalAlign="bottom" 
                height={50}
                wrapperStyle={{
                  paddingTop: '30px',
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
                iconType="circle"
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de Barras Ultra Moderno */}
        <div style={{ 
          background: 'rgba(10, 10, 26, 0.8)',
          backdropFilter: 'blur(20px)',
          border: '2px solid #00d4ff',
          borderRadius: '20px',
          padding: '30px',
          boxShadow: `
            0 0 30px rgba(0, 212, 255, 0.3),
            0 15px 35px rgba(0, 0, 0, 0.5),
            inset 0 1px 0 rgba(255, 255, 255, 0.1)
          `,
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(45deg, transparent 30%, rgba(0, 212, 255, 0.02) 50%, transparent 70%)',
            pointerEvents: 'none'
          }} />
          
          <h3 style={{ 
            fontSize: '20px', 
            marginBottom: '25px', 
            color: '#00d4ff',
            textAlign: 'center',
            fontWeight: 'bold',
            textShadow: '0 0 15px rgba(0, 212, 255, 0.8)'
          }}>
            📊 Progresso Geral vs Avanço Físico por Obra
          </h3>
          
          <ResponsiveContainer width="100%" height={420}>
            <BarChart 
              data={obraData}
              margin={{ top: 20, right: 30, left: 20, bottom: 180 }}
              barCategoryGap="20%"
            >
              <defs>
                <linearGradient id="progressoGeralGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00d4ff" stopOpacity={1}/>
                  <stop offset="100%" stopColor="#0066cc" stopOpacity={0.8}/>
                </linearGradient>
                <linearGradient id="avancoFisicoGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00ff88" stopOpacity={1}/>
                  <stop offset="100%" stopColor="#00cc66" stopOpacity={0.8}/>
                </linearGradient>
              </defs>
              
              <CartesianGrid 
                strokeDasharray="2 2" 
                stroke="rgba(0, 212, 255, 0.2)"
                vertical={false}
              />
              
              <XAxis 
                dataKey="nomeFormatado"
                tick={{ 
                  fill: '#ffffff', 
                  fontSize: 10,
                  fontWeight: '500'
                }}
                axisLine={{ stroke: 'rgba(0, 212, 255, 0.5)', strokeWidth: 2 }}
                tickLine={{ stroke: 'rgba(0, 212, 255, 0.5)' }}
                angle={-45}
                textAnchor="end"
                height={140}
                interval={0}
              />
              
              <YAxis 
                tick={{ 
                  fill: '#ffffff', 
                  fontSize: 12,
                  fontWeight: '500'
                }}
                axisLine={{ stroke: 'rgba(0, 212, 255, 0.5)', strokeWidth: 2 }}
                tickLine={{ stroke: 'rgba(0, 212, 255, 0.5)' }}
                domain={[0, 100]}
              />
              
              <Tooltip content={<CyberTooltip />} />
              
              <Legend 
                verticalAlign="bottom"
                align="center"
                wrapperStyle={{
                  paddingTop: '60px',
                  paddingBottom: '10px',
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: '600',
                  position: 'absolute',
                  bottom: '10px',
                  left: '50%',
                  transform: 'translateX(-50%)'
                }}
                iconType="rect"
              />
              
              <Bar 
                dataKey="progressoGeral" 
                fill="url(#progressoGeralGrad)"
                name="Progresso Geral %"
                radius={[6, 6, 0, 0]}
                stroke="#00d4ff"
                strokeWidth={1}
                style={{
                  filter: 'drop-shadow(0 0 10px rgba(0, 212, 255, 0.6))'
                }}
              />
              
              <Bar 
                dataKey="avancoFisico" 
                fill="url(#avancoFisicoGrad)"
                name="Avanço Físico %"
                radius={[6, 6, 0, 0]}
                stroke="#00ff88"
                strokeWidth={1}
                style={{
                  filter: 'drop-shadow(0 0 10px rgba(0, 255, 136, 0.6))'
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default ChartsSection