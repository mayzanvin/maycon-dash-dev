import React from 'react'
import { ObraUnificada } from '@/types/obra-unificada'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { TrendingUp, TrendingDown, Calendar, Target, Clock, AlertTriangle, DollarSign, BarChart3 } from 'lucide-react'

interface CurvaTendenciaProps {
  obra: ObraUnificada
}

const CurvaTendencia: React.FC<CurvaTendenciaProps> = ({ obra }) => {
  // Cores da Roraima Energia
  const coresRoraima = {
    azul: '#0EA5E9',
    verde: '#10B981',
    laranja: '#FF6B35',
    vermelho: '#EF4444',
    amarelo: '#F59E0B',
    roxo: '#8b5cf6',
    cinza: '#6B7280',
    azulClaro: '#E0F2FE',
    verdeClaro: '#F0FDF4'
  }

  // 💰 FORMATAÇÃO DE VALORES
  const formatarMoeda = (valor: number) => {
    if (valor >= 1000000) {
      return `R$ ${(valor / 1000000).toFixed(1)}M`
    } else if (valor >= 1000) {
      return `R$ ${(valor / 1000).toFixed(0)}k`
    }
    return `R$ ${valor.toLocaleString()}`
  }

  // ✅ GERAR DADOS PARA CURVA S FÍSICA
  const gerarDadosCurvaFisica = () => {
    const pontos = []
    const hoje = new Date()
    
    for (let i = -6; i < 12; i++) {
      const data = new Date(hoje)
      data.setMonth(data.getMonth() + i)
      
      const periodoTexto = data.toLocaleDateString('pt-BR', { 
        month: 'short', 
        year: '2-digit' 
      })
      
      // Curva planejada (S-curve típica)
      let progressoPlanejado = 0
      const progressoNormalizado = (i + 6) / 18
      if (progressoNormalizado <= 0.2) {
        progressoPlanejado = progressoNormalizado * 50
      } else if (progressoNormalizado <= 0.8) {
        progressoPlanejado = 10 + (progressoNormalizado - 0.2) * 150
      } else {
        progressoPlanejado = 100
      }
      
      // Progresso real baseado na distribuição atual
      let progressoReal = 0
      if (i <= 0) {
        const fatorTempo = Math.min(1, (i + 6) / 6)
        progressoReal = fatorTempo * (obra.metricas.avancooFisico || 0)
      } else {
        progressoReal = obra.metricas.avancooFisico || 0
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

  // 💰 GERAR DADOS PARA CURVA S FINANCEIRA
  const gerarDadosCurvaFinanceira = () => {
    const pontos = []
    const hoje = new Date()
    
    for (let i = -6; i < 12; i++) {
      const data = new Date(hoje)
      data.setMonth(data.getMonth() + i)
      
      const periodoTexto = data.toLocaleDateString('pt-BR', { 
        month: 'short', 
        year: '2-digit' 
      })
      
      // Curva financeira planejada (geralmente acompanha a física com defasagem)
      let financeiroPlanejado = 0
      const progressoNormalizado = (i + 6) / 18
      if (progressoNormalizado <= 0.15) {
        financeiroPlanejado = progressoNormalizado * 30 // Início mais lento
      } else if (progressoNormalizado <= 0.85) {
        financeiroPlanejado = 5 + (progressoNormalizado - 0.15) * 135
      } else {
        financeiroPlanejado = 100
      }
      
      // Progresso financeiro real
      let financeiroReal = 0
      if (i <= 0) {
        const fatorTempo = Math.min(1, (i + 6) / 6)
        financeiroReal = fatorTempo * (obra.dadosFinanceiros?.progressoFinanceiro || 0)
      } else {
        financeiroReal = obra.dadosFinanceiros?.progressoFinanceiro || 0
      }
      
      const isHoje = i === 0
      
      pontos.push({
        periodo: periodoTexto,
        planejadoFinanceiro: Math.round(Math.min(100, Math.max(0, financeiroPlanejado))),
        realFinanceiro: Math.round(Math.min(100, Math.max(0, financeiroReal))),
        isHoje: isHoje,
        mes: i
      })
    }
    
    return pontos
  }

  const dadosCurvaFisica = gerarDadosCurvaFisica()
  const dadosCurvaFinanceira = gerarDadosCurvaFinanceira()
  
  // ✅ ANÁLISE DE TENDÊNCIA FÍSICA
  const calcularTendenciaFisica = () => {
    const marcosTotal = obra.metricas.totalMarcos || 0
    const marcosConcluidos = obra.metricas.marcosConcluidos || 0
    
    const velocidadeMarcosPorMes = marcosConcluidos / 8
    const marcosRestantes = marcosTotal - marcosConcluidos
    const mesesParaConcluir = marcosRestantes / Math.max(velocidadeMarcosPorMes, 0.1)
    const eficiencia = marcosTotal > 0 ? (marcosConcluidos / marcosTotal) : 0
    
    let tendencia = 'estavel'
    let cor = coresRoraima.amarelo
    let texto = 'No Prazo'
    let icone = Calendar
    
    if (eficiencia >= 0.8 && velocidadeMarcosPorMes > 0.5) {
      tendencia = 'acelerando'
      cor = coresRoraima.verde
      texto = 'Acelerando'
      icone = TrendingUp
    } else if (eficiencia < 0.4 || velocidadeMarcosPorMes < 0.2) {
      tendencia = 'atrasado'
      cor = coresRoraima.vermelho
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
      eficiencia
    }
  }

  // 💰 ANÁLISE DE TENDÊNCIA FINANCEIRA
  const calcularTendenciaFinanceira = () => {
    const eficienciaFinanceira = obra.dadosFinanceiros?.eficienciaExecucao || 100
    const progressoFinanceiro = obra.dadosFinanceiros?.progressoFinanceiro || 0
    const statusEficiencia = obra.dadosFinanceiros?.statusEficiencia || 'Eficiente'
    
    let cor = coresRoraima.verde
    let icone = TrendingUp
    let texto = 'Eficiente'
    
    if (statusEficiencia === 'Crítico') {
      cor = coresRoraima.vermelho
      icone = TrendingDown
      texto = 'Crítico'
    } else if (statusEficiencia === 'Atenção') {
      cor = coresRoraima.amarelo
      icone = AlertTriangle
      texto = 'Atenção'
    }
    
    return {
      cor,
      icone,
      texto,
      eficiencia: eficienciaFinanceira,
      progresso: progressoFinanceiro,
      valorRealizado: obra.dadosFinanceiros?.valorRealizado || 0,
      orcamentoTotal: obra.dadosFinanceiros?.orcamentoTotal || 0
    }
  }

  const analiseFisica = calcularTendenciaFisica()
  const analiseFinanceira = calcularTendenciaFinanceira()
  
  // ✅ TOOLTIP CUSTOMIZADO
  const TooltipCustomizado = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null

    const isHoje = payload[0]?.payload?.isHoje
    
    return (
      <div style={{
        backgroundColor: 'white',
        border: `2px solid ${isHoje ? coresRoraima.laranja : coresRoraima.azul}`,
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
          {isHoje && <Clock style={{ width: '16px', height: '16px', color: coresRoraima.laranja }} />}
          <p style={{ 
            fontWeight: 'bold', 
            color: isHoje ? coresRoraima.laranja : coresRoraima.azul,
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
        color: coresRoraima.cinza,
        backgroundColor: '#f8fafc',
        borderRadius: '12px',
        border: '2px dashed #e2e8f0'
      }}>
        <TrendingUp style={{ width: '48px', height: '48px', color: coresRoraima.cinza, margin: '0 auto 16px' }} />
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
          Dados insuficientes para análise
        </h3>
        <p style={{ fontSize: '14px' }}>
          Carregando informações da obra...
        </p>
      </div>
    )
  }

  const IconeTendenciaFisica = analiseFisica.icone
  const IconeTendenciaFinanceira = analiseFinanceira.icone

  return (
    <div style={{ width: '100%' }}>
      {/* 💰 INDICADORES GERAIS - FÍSICO + FINANCEIRO */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '16px',
        marginBottom: '32px'
      }}>
        {/* Análise Física */}
        <div style={{
          padding: '20px',
          backgroundColor: analiseFisica.tipo === 'acelerando' ? coresRoraima.verdeClaro : 
                          analiseFisica.tipo === 'atrasado' ? '#fef2f2' : '#fefce8',
          borderRadius: '12px',
          border: `2px solid ${analiseFisica.cor}`,
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <IconeTendenciaFisica style={{ width: '32px', height: '32px', color: analiseFisica.cor }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px' }}>
              Tendência Física
            </div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: analiseFisica.cor, marginBottom: '4px' }}>
              {analiseFisica.texto}
            </div>
            <div style={{ fontSize: '12px', color: '#6B7280' }}>
              {obra.metricas.avancooFisico}% • {obra.metricas.marcosConcluidos}/{obra.metricas.totalMarcos} marcos
            </div>
          </div>
        </div>

        {/* 💰 Análise Financeira */}
        <div style={{
          padding: '20px',
          backgroundColor: analiseFinanceira.texto === 'Eficiente' ? coresRoraima.verdeClaro :
                          analiseFinanceira.texto === 'Atenção' ? '#fefce8' : '#fef2f2',
          borderRadius: '12px',
          border: `2px solid ${analiseFinanceira.cor}`,
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <IconeTendenciaFinanceira style={{ width: '32px', height: '32px', color: analiseFinanceira.cor }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px' }}>
              Eficiência Financeira
            </div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: analiseFinanceira.cor, marginBottom: '4px' }}>
              {analiseFinanceira.eficiencia}% • {analiseFinanceira.texto}
            </div>
            <div style={{ fontSize: '12px', color: '#6B7280' }}>
              {formatarMoeda(analiseFinanceira.valorRealizado)} de {formatarMoeda(analiseFinanceira.orcamentoTotal)}
            </div>
          </div>
        </div>

        {/* Correlação com Aprovado */}
        <div style={{
          padding: '20px',
          backgroundColor: obra.dadosFinanceiros?.corelacionEncontrada ? coresRoraima.verdeClaro : '#f8fafc',
          borderRadius: '12px',
          border: `2px solid ${obra.dadosFinanceiros?.corelacionEncontrada ? coresRoraima.verde : coresRoraima.cinza}`,
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <BarChart3 style={{ 
            width: '32px', 
            height: '32px', 
            color: obra.dadosFinanceiros?.corelacionEncontrada ? coresRoraima.verde : coresRoraima.cinza 
          }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px' }}>
              Orçamento Aprovado 2025
            </div>
            <div style={{ 
              fontSize: '18px', 
              fontWeight: 'bold', 
              color: obra.dadosFinanceiros?.corelacionEncontrada ? coresRoraima.verde : coresRoraima.cinza,
              marginBottom: '4px'
            }}>
              {obra.dadosFinanceiros?.corelacionEncontrada ? 
                formatarMoeda(obra.dadosFinanceiros.orcamentoAprovado) : 
                'Não encontrado'
              }
            </div>
            <div style={{ fontSize: '12px', color: '#6B7280' }}>
              {obra.dadosFinanceiros?.corelacionEncontrada ? 
                'Correlação identificada' : 
                'Aguardando correlação'
              }
            </div>
          </div>
        </div>
      </div>

      {/* 📊 CURVAS S SEPARADAS - FÍSICA E FINANCEIRA */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '24px'
      }}>
        {/* 📊 CURVA S FÍSICA */}
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
            <Target style={{ width: '20px', height: '20px', color: coresRoraima.verde }} />
            <h4 style={{ 
              fontSize: '16px', 
              fontWeight: '600', 
              color: '#1f2937',
              margin: 0
            }}>
              Curva S - Avanço Físico
            </h4>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={dadosCurvaFisica}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              
              <XAxis 
                dataKey="periodo"
                tick={{ fontSize: 10, fill: '#6B7280' }}
                tickLine={{ stroke: '#e2e8f0' }}
                axisLine={{ stroke: '#e2e8f0' }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              
              <YAxis 
                tick={{ fontSize: 10, fill: '#6B7280' }}
                tickLine={{ stroke: '#e2e8f0' }}
                axisLine={{ stroke: '#e2e8f0' }}
                domain={[0, 100]}
                label={{ 
                  value: 'Progresso (%)', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { textAnchor: 'middle', fontSize: '11px', fill: '#6B7280' }
                }}
              />
              
              <Tooltip content={<TooltipCustomizado />} />
              
              <ReferenceLine 
                x={dadosCurvaFisica.find(p => p.isHoje)?.periodo} 
                stroke={coresRoraima.laranja} 
                strokeWidth={2}
                strokeDasharray="5 5"
                label={{ value: "Hoje", position: "top", style: { fill: coresRoraima.laranja, fontSize: '10px' } }}
              />
              
              <Line
                type="monotone"
                dataKey="planejado"
                stroke={coresRoraima.azul}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: coresRoraima.azul, strokeWidth: 2 }}
                name="Planejado"
              />
              
              <Line
                type="monotone"
                dataKey="realFisico"
                stroke={coresRoraima.verde}
                strokeWidth={3}
                dot={{ fill: coresRoraima.verde, strokeWidth: 2, r: 3 }}
                activeDot={{ r: 6, fill: coresRoraima.verde, strokeWidth: 2 }}
                name="Real Físico"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 💰 CURVA S FINANCEIRA */}
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
            <DollarSign style={{ width: '20px', height: '20px', color: coresRoraima.laranja }} />
            <h4 style={{ 
              fontSize: '16px', 
              fontWeight: '600', 
              color: '#1f2937',
              margin: 0
            }}>
              Curva S - Avanço Financeiro
            </h4>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={dadosCurvaFinanceira}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              
              <XAxis 
                dataKey="periodo"
                tick={{ fontSize: 10, fill: '#6B7280' }}
                tickLine={{ stroke: '#e2e8f0' }}
                axisLine={{ stroke: '#e2e8f0' }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              
              <YAxis 
                tick={{ fontSize: 10, fill: '#6B7280' }}
                tickLine={{ stroke: '#e2e8f0' }}
                axisLine={{ stroke: '#e2e8f0' }}
                domain={[0, 100]}
                label={{ 
                  value: 'Progresso (%)', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { textAnchor: 'middle', fontSize: '11px', fill: '#6B7280' }
                }}
              />
              
              <Tooltip content={<TooltipCustomizado />} />
              
              <ReferenceLine 
                x={dadosCurvaFinanceira.find(p => p.isHoje)?.periodo} 
                stroke={coresRoraima.laranja} 
                strokeWidth={2}
                strokeDasharray="5 5"
                label={{ value: "Hoje", position: "top", style: { fill: coresRoraima.laranja, fontSize: '10px' } }}
              />
              
              <Line
                type="monotone"
                dataKey="planejadoFinanceiro"
                stroke={coresRoraima.roxo}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: coresRoraima.roxo, strokeWidth: 2 }}
                name="Planejado Financeiro"
              />
              
              <Line
                type="monotone"
                dataKey="realFinanceiro"
                stroke={coresRoraima.laranja}
                strokeWidth={3}
                dot={{ fill: coresRoraima.laranja, strokeWidth: 2, r: 3 }}
                activeDot={{ r: 6, fill: coresRoraima.laranja, strokeWidth: 2 }}
                name="Real Financeiro"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 📊 RESUMO DE PERFORMANCE FINANCEIRA */}
      <div style={{
        marginTop: '24px',
        backgroundColor: '#f8fafc',
        borderRadius: '12px',
        padding: '20px',
        border: '1px solid #e2e8f0'
      }}>
        <h4 style={{
          fontSize: '16px',
          fontWeight: '600',
          color: '#1f2937',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <BarChart3 style={{ width: '18px', height: '18px', color: coresRoraima.azul }} />
          Resumo de Performance
        </h4>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px'
        }}>
          {/* Performance Física */}
          <div style={{
            padding: '16px',
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            textAlign: 'center',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ fontSize: '11px', color: '#6B7280', marginBottom: '8px' }}>
              PERFORMANCE FÍSICA
            </div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: coresRoraima.verde, marginBottom: '4px' }}>
              {obra.metricas.avancooFisico}%
            </div>
            <div style={{ fontSize: '12px', color: '#6B7280' }}>
              {obra.metricas.marcosConcluidos}/{obra.metricas.totalMarcos} marcos
            </div>
            <div style={{ fontSize: '12px', color: '#6B7280' }}>
              {obra.metricas.tarefasConcluidas}/{obra.metricas.totalTarefas} tarefas
            </div>
          </div>
          
          {/* Performance Financeira */}
          <div style={{
            padding: '16px',
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            textAlign: 'center',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ fontSize: '11px', color: '#6B7280', marginBottom: '8px' }}>
              PERFORMANCE FINANCEIRA
            </div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: coresRoraima.laranja, marginBottom: '4px' }}>
              {obra.dadosFinanceiros?.progressoFinanceiro || 0}%
            </div>
            <div style={{ fontSize: '12px', color: '#6B7280' }}>
              {formatarMoeda(analiseFinanceira.valorRealizado)}
            </div>
            <div style={{ fontSize: '12px', color: '#6B7280' }}>
              de {formatarMoeda(analiseFinanceira.orcamentoTotal)}
            </div>
          </div>
          
          {/* Eficiência */}
          <div style={{
            padding: '16px',
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            textAlign: 'center',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ fontSize: '11px', color: '#6B7280', marginBottom: '8px' }}>
              EFICIÊNCIA DE EXECUÇÃO
            </div>
            <div style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              color: analiseFinanceira.cor,
              marginBottom: '4px'
            }}>
              {obra.dadosFinanceiros?.eficienciaExecucao || 100}%
            </div>
            <div style={{ fontSize: '12px', color: analiseFinanceira.cor, fontWeight: '600' }}>
              {obra.dadosFinanceiros?.statusEficiencia || 'Eficiente'}
            </div>
            <div style={{ fontSize: '11px', color: '#6B7280' }}>
              vs previsto por avanço
            </div>
          </div>
          
          {/* Status Atual */}
          <div style={{
            padding: '16px',
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            textAlign: 'center',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ fontSize: '11px', color: '#6B7280', marginBottom: '8px' }}>
              STATUS GERAL
            </div>
            <div style={{ 
              fontSize: '16px', 
              fontWeight: 'bold', 
              color: coresRoraima.cinza,
              marginBottom: '4px',
              lineHeight: '1.3'
            }}>
              {obra.status}
            </div>
            <div style={{ fontSize: '11px', color: '#6B7280' }}>
              {obra.temEnergizacao ? 'Com energização' : 'Sem energização'}
            </div>
          </div>
        </div>

        {/* 💰 NOTA SOBRE CORRELAÇÃO */}
        <div style={{
          marginTop: '16px',
          padding: '12px',
          backgroundColor: obra.dadosFinanceiros?.corelacionEncontrada ? '#fef3cd' : '#f3f4f6',
          borderRadius: '8px',
          border: `1px solid ${obra.dadosFinanceiros?.corelacionEncontrada ? '#fbbf24' : '#d1d5db'}`,
          textAlign: 'center'
        }}>
          <div style={{ 
            fontSize: '12px', 
            color: obra.dadosFinanceiros?.corelacionEncontrada ? '#92400e' : '#6b7280',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '6px' 
          }}>
            {obra.dadosFinanceiros?.corelacionEncontrada ? (
              <>
                <DollarSign style={{ width: '14px', height: '14px' }} />
                <span>
                  <strong>Correlação encontrada:</strong> Comparação com orçamento aprovado 2025 ativa
                </span>
              </>
            ) : (
              <>
                <AlertTriangle style={{ width: '14px', height: '14px' }} />
                <span>
                  <strong>Correlação pendente:</strong> Obra não encontrada no BaseInvestimento2025.xlsx
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CurvaTendencia