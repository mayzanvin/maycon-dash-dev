// src/components/CurvaTendencia.tsx - CORRIGIDO ERRO COMPILAÇÃO
import React from 'react'
import { ObraUnificada } from '@/types/obra-unificada'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { TrendingUp, TrendingDown, Calendar, Target, Clock, AlertTriangle, DollarSign, BarChart3 } from 'lucide-react'

interface CurvaTendenciaProps {
  obras: ObraUnificada[]
}

const CurvaTendencia: React.FC<CurvaTendenciaProps> = ({ obras }) => {
  console.log("📈 CURVA DE TENDÊNCIA - " + new Date().toLocaleTimeString())
  
  // 🎯 GERAR DADOS PARA O GRÁFICO DE TENDÊNCIA
  const dadosGrafico = obras.map((obra, index) => ({
    nome: obra.codigo,
    progressoGeral: obra.progressoGeral,
    avancaoFisico: obra.metricas.avancooFisico, // ✅ USO DIRETO SEM VARIÁVEL INTERMEDIÁRIA
    eficiencia: obra.metricas?.eficienciaExecucao || 0,
    orcamento: obra.metricas?.orcamentoTotal || 0,
    valorRealizado: obra.metricas?.valorRealizado || 0,
    index: index + 1
  })).sort((a, b) => b.progressoGeral - a.progressoGeral)

  // 📊 CALCULAR ESTATÍSTICAS
  const progressoMedio = Math.round(
    obras.reduce((acc, obra) => acc + obra.progressoGeral, 0) / obras.length
  )
  
  const avancaoMedio = Math.round(
    obras.reduce((acc, obra) => acc + obra.metricas.avancooFisico, 0) / obras.length
  )
  
  const eficienciaMedia = Math.round(
    obras.reduce((acc, obra) => acc + (obra.metricas?.eficienciaExecucao || 0), 0) / obras.length
  )

  // 🎯 IDENTIFICAR TENDÊNCIAS
  const obrasAdiantadas = obras.filter(o => o.progressoGeral > progressoMedio).length
  const obrasAtrasadas = obras.filter(o => o.progressoGeral < progressoMedio).length
  const tendencia = obrasAdiantadas > obrasAtrasadas ? 'positiva' : obrasAtrasadas > obrasAdiantadas ? 'negativa' : 'estável'

  // 💰 ORÇAMENTO TOTAL
  const orcamentoTotal = obras.reduce((acc, obra) => acc + (obra.metricas?.orcamentoTotal || 0), 0)
  const valorRealizadoTotal = obras.reduce((acc, obra) => acc + (obra.metricas?.valorRealizado || 0), 0)

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            Curva de Tendência do Portfólio
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Análise comparativa de progresso e performance das obras
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
            tendencia === 'positiva' ? 'bg-green-100 text-green-700' :
            tendencia === 'negativa' ? 'bg-red-100 text-red-700' :
            'bg-yellow-100 text-yellow-700'
          }`}>
            {tendencia === 'positiva' ? <TrendingUp className="h-4 w-4" /> :
             tendencia === 'negativa' ? <TrendingDown className="h-4 w-4" /> :
             <Target className="h-4 w-4" />}
            Tendência {tendencia === 'positiva' ? 'Positiva' : tendencia === 'negativa' ? 'Negativa' : 'Estável'}
          </div>
        </div>
      </div>

      {/* 📊 ESTATÍSTICAS RESUMIDAS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">Progresso Médio</span>
          </div>
          <div className="text-2xl font-bold text-blue-900">{progressoMedio}%</div>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-green-900">Avanço Físico</span>
          </div>
          <div className="text-2xl font-bold text-green-900">{avancaoMedio}%</div>
        </div>
        
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-900">Eficiência</span>
          </div>
          <div className="text-2xl font-bold text-purple-900">{eficienciaMedia}%</div>
        </div>
        
        <div className="bg-orange-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="h-4 w-4 text-orange-600" />
            <span className="text-sm font-medium text-orange-900">Realizado</span>
          </div>
          <div className="text-lg font-bold text-orange-900">
            {((valorRealizadoTotal / orcamentoTotal) * 100 || 0).toFixed(1)}%
          </div>
        </div>
      </div>

      {/* 📈 GRÁFICO DE TENDÊNCIA */}
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={dadosGrafico} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="nome" 
              stroke="#666"
              fontSize={12}
              tick={{ fill: '#666' }}
            />
            <YAxis 
              domain={[0, 100]}
              stroke="#666"
              fontSize={12}
              tick={{ fill: '#666' }}
              label={{ value: 'Progresso (%)', angle: -90, position: 'insideLeft' }}
            />
            
            {/* ✅ LINHA DE REFERÊNCIA - CORREÇÃO DO ERRO */}
            <ReferenceLine 
              y={progressoMedio} 
              stroke="#8b5cf6" 
              strokeDasharray="5 5"
              label={{ value: `Média: ${progressoMedio}%`, position: "top" }}
            />
            
            {/* LINHAS DO GRÁFICO */}
            <Line 
              type="monotone" 
              dataKey="progressoGeral" 
              stroke="#3b82f6" 
              strokeWidth={3}
              dot={{ r: 6, fill: '#3b82f6' }}
              name="Progresso Geral"
            />
            
            <Line 
              type="monotone" 
              dataKey="avancaoFisico" 
              stroke="#10b981" 
              strokeWidth={2}
              dot={{ r: 4, fill: '#10b981' }}
              strokeDasharray="5 5"
              name="Avanço Físico"
            />
            
            <Line 
              type="monotone" 
              dataKey="eficiencia" 
              stroke="#f59e0b" 
              strokeWidth={2}
              dot={{ r: 4, fill: '#f59e0b' }}
              strokeDasharray="3 3"
              name="Eficiência"
            />
            
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              formatter={(value: any, name: string) => {
                const labels: Record<string, string> = {
                  'progressoGeral': 'Progresso Geral',
                  'avancaoFisico': 'Avanço Físico',
                  'eficiencia': 'Eficiência'
                }
                return [`${value}%`, labels[name] || name]
              }}
              labelFormatter={(label) => `Obra: ${label}`}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 🎯 ANÁLISE DE PERFORMANCE */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-green-900">Obras Adiantadas</span>
          </div>
          <div className="text-xl font-bold text-green-900">
            {obrasAdiantadas} de {obras.length}
          </div>
          <div className="text-sm text-green-700">
            {((obrasAdiantadas / obras.length) * 100).toFixed(1)}% do portfólio
          </div>
        </div>
        
        <div className="bg-red-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <span className="text-sm font-medium text-red-900">Obras Atrasadas</span>
          </div>
          <div className="text-xl font-bold text-red-900">
            {obrasAtrasadas} de {obras.length}
          </div>
          <div className="text-sm text-red-700">
            {((obrasAtrasadas / obras.length) * 100).toFixed(1)}% do portfólio
          </div>
        </div>
        
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">No Prazo</span>
          </div>
          <div className="text-xl font-bold text-blue-900">
            {obras.length - obrasAdiantadas - obrasAtrasadas} de {obras.length}
          </div>
          <div className="text-sm text-blue-700">
            {(((obras.length - obrasAdiantadas - obrasAtrasadas) / obras.length) * 100).toFixed(1)}% do portfólio
          </div>
        </div>
      </div>

      {/* 💡 INSIGHTS */}
      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">💡 Insights da Análise</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div>
            <strong>Performance Geral:</strong> {
              progressoMedio >= 80 ? 'Excelente performance do portfólio' :
              progressoMedio >= 60 ? 'Boa performance com margem para melhorias' :
              progressoMedio >= 40 ? 'Performance moderada, atenção necessária' :
              'Performance abaixo do esperado, ação urgente'
            }
          </div>
          <div>
            <strong>Execução Física:</strong> {
              avancaoMedio >= progressoMedio ? 'Execução física acompanha o planejado' :
              'Execução física pode estar atrasada em relação ao cronograma'
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default CurvaTendencia