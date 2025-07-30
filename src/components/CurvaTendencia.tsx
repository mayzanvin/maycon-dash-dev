import { ObraUnificada, TaskData } from '@/types/obra-unificada'
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine,
  AreaChart, Area, Bar, PieChart, Pie, Cell, ComposedChart
} from 'recharts'

interface CurvaTendenciaProps {
  obra: ObraUnificada
}

interface PontoTendencia {
  data: string
  dataExcel: number
  progressoPrevisto: number
  progressoRealizado?: number
  progressoProjetado?: number
  velocidadePrevista?: number
  velocidadeReal?: number
  marcosAcumulados?: number
  marcosPlanejados?: number
  produtividade?: number
  desvio?: number
}

const CurvaTendencia: React.FC<CurvaTendenciaProps> = ({ obra }) => {
  const gerarDadosCompletos = () => {
    const todasTarefas = [...obra.fiscalizacao.tarefas, ...obra.execucao.tarefas]
    
    if (todasTarefas.length === 0) return { curvaS: [], velocidade: [], marcos: [], distribuicao: [] }

    // Ordenar tarefas por data
    const tarefasOrdenadas = todasTarefas
      .filter(t => t['Data Início'] && t['Data Término'])
      .sort((a, b) => a['Data Início'] - b['Data Início'])

    // Calcular datas extremas
    const dataInicio = Math.min(...tarefasOrdenadas.map(t => t['Data Início']))
    const dataTermino = Math.max(...tarefasOrdenadas.map(t => t['Data Término']))
    const dataInicioBase = Math.min(...tarefasOrdenadas.map(t => t['LinhaBase Início'] || t['Data Início']))
    const dataTerminoBase = Math.max(...tarefasOrdenadas.map(t => t['LinhaBase Término'] || t['Data Término']))

    const dataHoje = new Date()
    const excelHoje = Math.floor((dataHoje.getTime() / 86400000) + 25569)
    const dataFinal = Math.max(dataTermino, dataTerminoBase, excelHoje + 90)

    // Gerar Curva S
    const curvaS: PontoTendencia[] = []
    let progressoAnterior = 0
    let progressoAnteriorPrevisto = 0

    for (let data = dataInicio; data <= dataFinal; data += 10) { // A cada 10 dias
      const dataFormatada = excelParaData(data)
      const isProjecao = data > excelHoje

      // Progresso previsto (curva S baseada em linha base)
      const progressoPrevisto = calcularProgressoPrevisto(data, dataInicioBase, dataTerminoBase)
      
      // Progresso realizado
      const progressoRealizado = isProjecao ? undefined : calcularProgressoRealizado(data, tarefasOrdenadas)
      
      // Projeção futura
      const progressoProjetado = isProjecao 
        ? calcularProjecao(data, excelHoje, tarefasOrdenadas, obra.metricas.progressoGeral)
        : undefined

      // Velocidade (derivada do progresso)
      const velocidadePrevista = progressoPrevisto - progressoAnteriorPrevisto
      const velocidadeReal = progressoRealizado ? progressoRealizado - progressoAnterior : 0

      // Marcos acumulados
      const marcosAcumulados = calcularMarcosAcumulados(data, obra.execucao.tarefas)
      const marcosPlanejados = calcularMarcosPlanejados(data, obra.execucao.tarefas)

      // Produtividade (marcos / progresso)
      const produtividade = progressoRealizado && progressoRealizado > 0 
        ? (marcosAcumulados / progressoRealizado) * 100 
        : 0

      // Desvio do planejado
      const desvio = progressoRealizado ? progressoRealizado - progressoPrevisto : 0

      curvaS.push({
        data: dataFormatada,
        dataExcel: data,
        progressoPrevisto,
        progressoRealizado,
        progressoProjetado,
        velocidadePrevista,
        velocidadeReal: isProjecao ? undefined : velocidadeReal,
        marcosAcumulados,
        marcosPlanejados,
        produtividade: isProjecao ? undefined : produtividade,
        desvio
      })

      progressoAnterior = progressoRealizado || progressoAnterior
      progressoAnteriorPrevisto = progressoPrevisto
    }

    // Gerar dados de distribuição
    const distribuicao = gerarDadosDistribuicao(obra)

    return { curvaS, distribuicao }
  }

  const excelParaData = (excelDate: number): string => {
    const date = new Date((excelDate - 25569) * 86400 * 1000)
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
  }

  const calcularProgressoPrevisto = (data: number, inicioBase: number, terminoBase: number): number => {
    if (data <= inicioBase) return 0
    if (data >= terminoBase) return 100
    
    // Curva S: crescimento lento no início, rápido no meio, lento no final
    const t = (data - inicioBase) / (terminoBase - inicioBase)
    const curvaS = 100 * (3 * t * t - 2 * t * t * t) // Função cúbica suave
    return Math.min(100, Math.max(0, curvaS))
  }

  const calcularProgressoRealizado = (data: number, tarefas: TaskData[]): number => {
    let pesoTotal = 0
    let pesoRealizado = 0

    tarefas.forEach(tarefa => {
      const inicioTarefa = tarefa['Data Início']
      const terminoTarefa = tarefa['Data Término']
      const progressoTarefa = tarefa['% Concluído'] || 0
      
      const peso = terminoTarefa - inicioTarefa
      pesoTotal += peso

      if (data >= terminoTarefa) {
        pesoRealizado += peso * (progressoTarefa / 100)
      } else if (data >= inicioTarefa) {
        const progressoTemporal = (data - inicioTarefa) / (terminoTarefa - inicioTarefa)
        const progressoEsperado = Math.min(progressoTemporal * 100, progressoTarefa)
        pesoRealizado += peso * (progressoEsperado / 100)
      }
    })

    return pesoTotal > 0 ? Math.min(100, (pesoRealizado / pesoTotal) * 100) : 0
  }

  const calcularProjecao = (data: number, hoje: number, tarefas: TaskData[], progressoAtual: number): number => {
    const diasRestantes = data - hoje
    const velocidadeMedia = progressoAtual / (hoje - Math.min(...tarefas.map(t => t['Data Início'])))
    
    return Math.min(100, progressoAtual + (velocidadeMedia * diasRestantes))
  }

  const calcularMarcosAcumulados = (data: number, tarefasExecucao: TaskData[]): number => {
    return tarefasExecucao.filter(tarefa => 
      tarefa.Marco === 'SIM' && 
      tarefa['Data Término'] <= data &&
      (tarefa['% Concluído'] || 0) === 100
    ).length
  }

  const calcularMarcosPlanejados = (data: number, tarefasExecucao: TaskData[]): number => {
    return tarefasExecucao.filter(tarefa => 
      tarefa.Marco === 'SIM' && 
      (tarefa['LinhaBase Término'] || tarefa['Data Término']) <= data
    ).length
  }

  const gerarDadosDistribuicao = (obra: ObraUnificada) => {
    const total = obra.metricas.totalTarefas
    
    return [
      {
        name: 'Concluídas',
        value: obra.metricas.tarefasConcluidas,
        fill: '#10b981',
        percentual: ((obra.metricas.tarefasConcluidas / total) * 100).toFixed(1)
      },
      {
        name: 'Em Andamento',
        value: total - obra.metricas.tarefasConcluidas - (total - obra.metricas.totalTarefas),
        fill: '#f59e0b',
        percentual: (((total - obra.metricas.tarefasConcluidas) / total) * 100).toFixed(1)
      },
      {
        name: 'Pendentes',
        value: total - obra.metricas.tarefasConcluidas,
        fill: '#ef4444',
        percentual: (((total - obra.metricas.tarefasConcluidas) / total) * 100).toFixed(1)
      }
    ]
  }

  const { curvaS, distribuicao } = gerarDadosCompletos()

  if (curvaS.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
        Dados insuficientes para gerar análises
      </div>
    )
  }

  // Encontrar ponto atual
  const dataHoje = new Date()
  const excelHoje = Math.floor((dataHoje.getTime() / 86400000) + 25569)
  const pontoAtual = curvaS.find(p => Math.abs(p.dataExcel - excelHoje) <= 5)
  const progressoAtual = pontoAtual?.progressoRealizado || obra.metricas.progressoGeral
  const progressoEsperado = pontoAtual?.progressoPrevisto || 0

  return (
    <div>
      {/* Header com Status */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
        gap: '12px',
        marginBottom: '24px',
        padding: '16px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>
            {progressoAtual.toFixed(1)}%
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>Realizado</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>
            {progressoEsperado.toFixed(1)}%
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>Previsto</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: progressoAtual >= progressoEsperado ? '#10b981' : '#ef4444' }}>
            {progressoAtual >= progressoEsperado ? '+' : ''}{(progressoAtual - progressoEsperado).toFixed(1)}%
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>Desvio</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#8b5cf6' }}>
            {obra.metricas.marcosConcluidos}/{obra.metricas.totalMarcos}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>Marcos</div>
        </div>
      </div>

      {/* Grid de Gráficos */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
        gap: '24px'
      }}>
        {/* 1. Curva S Principal */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '20px',
          border: '1px solid #e5e7eb'
        }}>
          <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#1f2937' }}>
            📈 Curva S - Progresso Acumulado
          </h4>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={curvaS}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="data" tick={{ fontSize: 10 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
              <Tooltip 
                formatter={(value: any, name: string) => [
                  `${typeof value === 'number' ? value.toFixed(1) : value}%`, 
                  name
                ]}
              />
              <Legend />
              
              <Area
                type="monotone"
                dataKey="progressoPrevisto"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.1}
                name="Previsto"
              />
              <Area
                type="monotone"
                dataKey="progressoRealizado"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.3}
                name="Realizado"
              />
              <Line
                type="monotone"
                dataKey="progressoProjetado"
                stroke="#f59e0b"
                strokeDasharray="5 5"
                dot={false}
                name="Projeção"
              />
              
              {pontoAtual && (
                <ReferenceLine 
                  x={pontoAtual.data} 
                  stroke="#6b7280" 
                  strokeDasharray="2 2"
                  label={{ value: "Hoje", position: "top" }}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* 2. Velocidade de Execução */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '20px',
          border: '1px solid #e5e7eb'
        }}>
          <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#1f2937' }}>
            🚀 Velocidade de Execução
          </h4>
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={curvaS}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="data" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Legend />
              
              <Bar dataKey="velocidadePrevista" fill="#3b82f6" name="Velocidade Prevista" opacity={0.7} />
              <Bar dataKey="velocidadeReal" fill="#10b981" name="Velocidade Real" />
              <Line type="monotone" dataKey="desvio" stroke="#ef4444" name="Desvio do Plano" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* 3. Marcos Físicos */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '20px',
          border: '1px solid #e5e7eb'
        }}>
          <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#1f2937' }}>
            🎯 Evolução dos Marcos Físicos
          </h4>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={curvaS}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="data" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Legend />
              
              <Line
                type="monotone"
                dataKey="marcosPlanejados"
                stroke="#3b82f6"
                strokeWidth={2}
                name="Marcos Planejados"
              />
              <Line
                type="monotone"
                dataKey="marcosAcumulados"
                stroke="#10b981"
                strokeWidth={3}
                name="Marcos Executados"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 4. Distribuição de Status */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '20px',
          border: '1px solid #e5e7eb'
        }}>
          <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#1f2937' }}>
            📊 Distribuição Atual das Tarefas
          </h4>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={distribuicao}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, percentual }) => `${name}: ${percentual}%`}
              >
                {distribuicao.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Legenda e Interpretação */}
      <div style={{
        marginTop: '24px',
        padding: '16px',
        backgroundColor: '#f3f4f6',
        borderRadius: '8px',
        fontSize: '12px',
        lineHeight: '1.5'
      }}>
        <h5 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#1f2937' }}>
          📋 Como Interpretar a Curva S:
        </h5>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          <div>
            <strong style={{ color: '#3b82f6' }}>Curva Azul (Previsto):</strong> Representa o cronograma planejado baseado na linha base
          </div>
          <div>
            <strong style={{ color: '#10b981' }}>Curva Verde (Realizado):</strong> Mostra o progresso real executado até hoje
          </div>
          <div>
            <strong style={{ color: '#f59e0b' }}>Linha Laranja (Projeção):</strong> Tendência futura baseada na velocidade atual
          </div>
          <div>
            <strong style={{ color: '#ef4444' }}>Desvio:</strong> Diferença entre realizado e previsto - indica atrasos ou adiantamentos
          </div>
        </div>
      </div>
    </div>
  )
}

export default CurvaTendencia