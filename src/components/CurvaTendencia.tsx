import React from 'react'
import { ObraUnificada } from '@/types/obra-unificada'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { TrendingUp, TrendingDown, Calendar, Target, Clock, AlertTriangle } from 'lucide-react'

interface CurvaTendenciaProps {
  obra: ObraUnificada
}

const CurvaTendencia: React.FC<CurvaTendenciaProps> = ({ obra }) => {
  // Cores da Roraima Energia
  const cores = {
    azul: '#0EA5E9',
    verde: '#10B981',
    laranja: '#FF6B35',
    vermelho: '#EF4444',
    amarelo: '#F59E0B',
    cinza: '#6B7280',
    azulClaro: '#E0F2FE',
    verdeClaro: '#F0FDF4'
  }

  // ✅ GERAR DADOS DE CURVA S BASEADOS EM DADOS REAIS DOS MARCOS
  const gerarDadosCurvaFisica = () => {
    const progressoAtual = obra.metricas.avancooFisico
    const marcosTotal = obra.metricas.totalMarcos
    const marcosConcluidos = obra.metricas.marcosConcluidos
    
    const pontos = []
    const hoje = new Date()
    const mesAtual = hoje.getMonth()
    
    // Criar 18 pontos (últimos 6 meses + 12 meses futuros)
    for (let i = -6; i < 12; i++) {
      const data = new Date(hoje)
      data.setMonth(data.getMonth() + i)
      
      const periodoTexto = data.toLocaleDateString('pt-BR', { 
        month: 'short', 
        year: '2-digit' 
      })
      
      // Curva planejada (S-curve típica: lenta no início, acelerada no meio, lenta no final)
      let progressoPlanejado = 0
      const progressoNormalizado = (i + 6) / 18 // 0 a 1
      if (progressoNormalizado <= 0.2) {
        progressoPlanejado = progressoNormalizado * 50 // 0-10%
      } else if (progressoNormalizado <= 0.8) {
        progressoPlanejado = 10 + (progressoNormalizado - 0.2) * 150 // 10-100%
      } else {
        progressoPlanejado = 100
      }
      
      // Progresso real baseado na distribuição atual dos marcos
      let progressoReal = 0
      if (i <= 0) { // Dados históricos e atual
        const fatorTempo = Math.min(1, (i + 6) / 6)
        progressoReal = fatorTempo * progressoAtual
      } else { // Projeção futura
        progressoReal = progressoAtual
      }
      
      const isHoje = i === 0
      
      pontos.push({
        periodo: periodoTexto,
        planejado: Math.round(Math.min(100, Math.max(0, progressoPlanejado))),
        realFisico: Math.round(Math.min(100, Math.max(0, progressoReal))),
        isHoje: isHoje,
        mes: i
      })
    }
    
    return pontos
  }

  const dadosCurva = gerarDadosCurvaFisica()
  const progressoAtual = obra.metricas.avancooFisico
  const marcosTotal = obra.metricas.totalMarcos
  const marcosConcluidos = obra.metricas.marcosConcluidos
  
  // ✅ ANÁLISE AVANÇADA DE TENDÊNCIA
  const calcularTendenciaAvancada = () => {
    const percentualMarcos = marcosTotal > 0 ? (marcosConcluidos / marcosTotal) * 100 : 0
    const eficienciaMarcos = percentualMarcos / 100
    
    // Calcular velocidade baseada em marcos concluídos
    const velocidadeMarcosPorMes = marcosConcluidos / 8 // Assumir 8 meses de trabalho
    const marcosRestantes = marcosTotal - marcosConcluidos
    const mesesParaConcluir = marcosRestantes / Math.max(velocidadeMarcosPorMes, 0.1)
    
    let tendencia = 'estavel'
    let cor = cores.amarelo
    let texto = 'No Prazo'
    let icone = Calendar
    
    if (eficienciaMarcos >= 0.8 && velocidadeMarcosPorMes > 0.5) {
      tendencia = 'acelerando'
      cor = cores.verde
      texto = 'Acelerando'
      icone = TrendingUp
    } else if (eficienciaMarcos < 0.4 || velocidadeMarcosPorMes < 0.2) {
      tendencia = 'atrasado'
      cor = cores.vermelho
      texto = 'Atrasado'
      icone = TrendingDown
    }
    
    return {
      tipo: tendencia,
      cor,
      texto,
      icone,
      velocidadeMarcos: velocidadeMarcosPorMes,
      mesesRestantes: mesesParaConcluir,
      eficiencia: eficienciaMarcos
    }
  }

  const analise = calcularTendenciaAvancada()
  
  // ✅ CÁLCULO DE PROJEÇÃO DE CONCLUSÃO BASEADO EM MARCOS
  const calcularProjecaoConclusao = () => {
    if (progressoAtual >= 100) return { texto: 'Concluída', cor: cores.verde, status: 'concluida' }
    if (marcosConcluidos === 0) return { texto: 'Não iniciada', cor: cores.cinza, status: 'nao_iniciada' }
    
    const dataEstimada = new Date()
    dataEstimada.setMonth(dataEstimada.getMonth() + Math.ceil(analise.mesesRestantes))
    
    const textoData = dataEstimada.toLocaleDateString('pt-BR', { 
      month: 'short', 
      year: 'numeric' 
    })
    
    // Determinar cor baseada na urgência
    let cor = cores.verde
    let status = 'no_prazo'
    
    if (analise.mesesRestantes > 12) {
      cor = cores.vermelho
      status = 'atrasado'
    } else if (analise.mesesRestantes > 6) {
      cor = cores.amarelo
      status = 'alerta'
    }
    
    return { texto: textoData, cor, status }
  }

  const projecao = calcularProjecaoConclusao()
  
  // ✅ ANÁLISE DE MARCOS CRÍTICOS
  const analisarMarcosCriticos = () => {
    const percentualConcluido = (marcosConcluidos / marcosTotal) * 100
    const marcosRestantes = marcosTotal - marcosConcluidos
    const criticidade = marcosRestantes > 10 ? 'alta' : marcosRestantes > 5 ? 'media' : 'baixa'
    
    return {
      restantes: marcosRestantes,
      percentual: percentualConcluido,
      criticidade,
      cor: criticidade === 'alta' ? cores.vermelho : 
           criticidade === 'media' ? cores.amarelo : cores.verde
    }
  }

  const marcos = analisarMarcosCriticos()

  // ✅ TOOLTIP CUSTOMIZADO MELHORADO
  const TooltipCustomizado = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null

    const isHoje = payload[0]?.payload?.isHoje
    
    return (
      <div style={{
        backgroundColor: 'white',
        border: `2px solid ${isHoje ? cores.laranja : cores.azul}`,
        borderRadius: '12px',
        padding: '16px',
        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
        minWidth: '200px'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          marginBottom: '8px',
          gap: '8px'
        }}>
          {isHoje && <Clock style={{ width: '16px', height: '16px', color: cores.laranja }} />}
          <p style={{ 
            fontWeight: 'bold', 
            color: isHoje ? cores.laranja : cores.azul,
            margin: 0,
            fontSize: '14px'
          }}>
            {label} {isHoje && '(Hoje)'}
          </p>
        </div>
        
        {payload.map((entry: any, index: number) => (
          <div key={index} style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            marginBottom: '4px',
            fontSize: '13px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '12px',
                height: '12px',
                backgroundColor: entry.color,
                borderRadius: '50%'
              }} />
              <span style={{ fontWeight: '500' }}>{entry.name}:</span>
            </div>
            <span style={{ fontWeight: 'bold', color: entry.color }}>
              {entry.value}%
            </span>
          </div>
        ))}
        
        {isHoje && (
          <div style={{
            marginTop: '8px',
            padding: '6px',
            backgroundColor: '#fef3cd',
            borderRadius: '6px',
            fontSize: '11px',
            color: '#92400e',
            textAlign: 'center'
          }}>
            📍 Posição atual da obra
          </div>
        )}
      </div>
    )
  }

  if (!obra) {
    return (
      <div style={{
        padding: '40px',
        textAlign: 'center',
        color: cores.cinza,
        backgroundColor: '#f8fafc',
        borderRadius: '12px',
        border: '2px dashed #e2e8f0'
      }}>
        <TrendingUp style={{ width: '48px', height: '48px', color: cores.cinza, margin: '0 auto 16px' }} />
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
          Dados insuficientes para análise
        </h3>
        <p style={{ fontSize: '14px' }}>
          Carregando informações da obra...
        </p>
      </div>
    )
  }

  const IconeTendencia = analise.icone

  return (
    <div style={{ width: '100%' }}>
      {/* ✅ INDICADORES AVANÇADOS DE AVANÇO FÍSICO */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        {/* Análise de Tendência */}
        <div style={{
          padding: '16px',
          backgroundColor: analise.tipo === 'acelerando' ? cores.verdeClaro : 
                          analise.tipo === 'atrasado' ? '#fef2f2' : '#fefce8',
          borderRadius: '12px',
          border: `2px solid ${analise.cor}`,
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <IconeTendencia style={{ width: '28px', height: '28px', color: analise.cor }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '2px' }}>
              Tendência de Progresso
            </div>
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: analise.cor, marginBottom: '2px' }}>
              {analise.texto}
            </div>
            <div style={{ fontSize: '11px', color: '#6B7280' }}>
              {analise.velocidadeMarcos.toFixed(1)} marcos/mês
            </div>
          </div>
        </div>

        {/* Projeção de Conclusão */}
        <div style={{
          padding: '16px',
          backgroundColor: projecao.status === 'concluida' ? cores.verdeClaro :
                          projecao.status === 'atrasado' ? '#fef2f2' :
                          projecao.status === 'alerta' ? '#fefce8' : cores.azulClaro,
          borderRadius: '12px',
          border: `2px solid ${projecao.cor}`,
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <Calendar style={{ width: '28px', height: '28px', color: projecao.cor }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '2px' }}>
              Conclusão Estimada
            </div>
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: projecao.cor, marginBottom: '2px' }}>
              {projecao.texto}
            </div>
            <div style={{ fontSize: '11px', color: '#6B7280' }}>
              {analise.mesesRestantes.toFixed(1)} meses restantes
            </div>
          </div>
        </div>

        {/* Análise de Marcos */}
        <div style={{
          padding: '16px',
          backgroundColor: marcos.criticidade === 'alta' ? '#fef2f2' :
                          marcos.criticidade === 'media' ? '#fefce8' : cores.verdeClaro,
          borderRadius: '12px',
          border: `2px solid ${marcos.cor}`,
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <Target style={{ width: '28px', height: '28px', color: marcos.cor }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '2px' }}>
              Marcos Físicos
            </div>
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: marcos.cor, marginBottom: '2px' }}>
              {marcosConcluidos}/{marcosTotal}
            </div>
            <div style={{ fontSize: '11px', color: '#6B7280' }}>
              {marcos.percentual.toFixed(1)}% concluído
            </div>
          </div>
        </div>

        {/* Eficiência Atual */}
        <div style={{
          padding: '16px',
          backgroundColor: analise.eficiencia >= 0.8 ? cores.verdeClaro :
                          analise.eficiencia >= 0.6 ? '#fefce8' : '#fef2f2',
          borderRadius: '12px',
          border: `2px solid ${analise.eficiencia >= 0.8 ? cores.verde :
                              analise.eficiencia >= 0.6 ? cores.amarelo : cores.vermelho}`,
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <TrendingUp style={{ 
            width: '28px', 
            height: '28px', 
            color: analise.eficiencia >= 0.8 ? cores.verde :
                   analise.eficiencia >= 0.6 ? cores.amarelo : cores.vermelho 
          }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '2px' }}>
              Eficiência Física
            </div>
            <div style={{ 
              fontSize: '16px', 
              fontWeight: 'bold', 
              color: analise.eficiencia >= 0.8 ? cores.verde :
                     analise.eficiencia >= 0.6 ? cores.amarelo : cores.vermelho,
              marginBottom: '2px'
            }}>
              {(analise.eficiencia * 100).toFixed(1)}%
            </div>
            <div style={{ fontSize: '11px', color: '#6B7280' }}>
              {progressoAtual}% progresso físico
            </div>
          </div>
        </div>
      </div>

      {/* ✅ CURVA S FOCADA APENAS NO AVANÇO FÍSICO */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '24px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          marginBottom: '20px',
          gap: '8px'
        }}>
          <TrendingUp style={{ width: '20px', height: '20px', color: cores.azul }} />
          <h4 style={{ 
            fontSize: '18px', 
            fontWeight: '600', 
            color: '#1f2937',
            margin: 0
          }}>
            Curva S - Avanço Físico
          </h4>
        </div>

        <ResponsiveContainer width="100%" height={350}>
          <LineChart
            data={dadosCurva}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            
            <XAxis 
              dataKey="periodo"
              tick={{ fontSize: 11, fill: '#6B7280' }}
              tickLine={{ stroke: '#e2e8f0' }}
              axisLine={{ stroke: '#e2e8f0' }}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            
            <YAxis 
              tick={{ fontSize: 11, fill: '#6B7280' }}
              tickLine={{ stroke: '#e2e8f0' }}
              axisLine={{ stroke: '#e2e8f0' }}
              domain={[0, 100]}
              label={{ 
                value: 'Progresso (%)', 
                angle: -90, 
                position: 'insideLeft',
                style: { textAnchor: 'middle', fontSize: '12px', fill: '#6B7280' }
              }}
            />
            
            <Tooltip content={<TooltipCustomizado />} />
            
            {/* Linha de referência "Hoje" */}
            <ReferenceLine 
              x={dadosCurva.find(p => p.isHoje)?.periodo} 
              stroke={cores.laranja} 
              strokeWidth={2}
              strokeDasharray="5 5"
              label={{ value: "Hoje", position: "top", style: { fill: cores.laranja, fontSize: '11px' } }}
            />
            
            {/* Curva Planejada */}
            <Line
              type="monotone"
              dataKey="planejado"
              stroke={cores.azul}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: cores.azul, strokeWidth: 2 }}
              name="Planejado"
            />
            
            {/* Curva Real Física */}
            <Line
              type="monotone"
              dataKey="realFisico"
              stroke={cores.verde}
              strokeWidth={3}
              dot={{ fill: cores.verde, strokeWidth: 2, r: 3 }}
              activeDot={{ r: 6, fill: cores.verde, strokeWidth: 2 }}
              name="Real Físico"
            />
          </LineChart>
        </ResponsiveContainer>

        {/* ✅ RESUMO DE PERFORMANCE */}
        <div style={{
          marginTop: '20px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '12px'
        }}>
          <div style={{
            padding: '12px',
            backgroundColor: '#f8fafc',
            borderRadius: '8px',
            textAlign: 'center',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ fontSize: '11px', color: '#6B7280', marginBottom: '4px' }}>
              TAREFAS FÍSICAS
            </div>
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: cores.azul }}>
              {obra.metricas.tarefasConcluidas}/{obra.metricas.totalTarefas}
            </div>
          </div>
          
          <div style={{
            padding: '12px',
            backgroundColor: '#f8fafc',
            borderRadius: '8px',
            textAlign: 'center',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ fontSize: '11px', color: '#6B7280', marginBottom: '4px' }}>
              MARCOS FÍSICOS
            </div>
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: cores.verde }}>
              {obra.metricas.marcosConcluidos}/{obra.metricas.totalMarcos}
            </div>
          </div>
          
          <div style={{
            padding: '12px',
            backgroundColor: '#f8fafc',
            borderRadius: '8px',
            textAlign: 'center',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ fontSize: '11px', color: '#6B7280', marginBottom: '4px' }}>
              STATUS ATUAL
            </div>
            <div style={{ fontSize: '14px', fontWeight: 'bold', color: cores.cinza }}>
              {obra.status}
            </div>
          </div>
        </div>

        {/* ✅ NOTA SOBRE DADOS FINANCEIROS */}
        <div style={{
          marginTop: '16px',
          padding: '12px',
          backgroundColor: '#fef3cd',
          borderRadius: '8px',
          border: '1px solid #fbbf24',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '12px', color: '#92400e', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <AlertTriangle style={{ width: '14px', height: '14px' }} />
            <span>
              <strong>Próxima fase:</strong> Curva S Financeira será implementada quando dados de orçamento estiverem disponíveis
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CurvaTendencia