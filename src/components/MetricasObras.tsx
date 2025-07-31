import { MetricasGerais } from '@/types/obra-unificada'

interface MetricasObrasProps {
  metricas: MetricasGerais
}

const MetricasObras: React.FC<MetricasObrasProps> = ({ metricas }) => {
  console.log("🔥 LAYOUT HORIZONTAL COMPACTO - " + new Date().toLocaleTimeString())
  
  const avancaoFisicoPercentual = metricas.totalMarcosFisicos > 0 
    ? Math.round((metricas.marcosFisicosConcluidos / metricas.totalMarcosFisicos) * 100)
    : 0

  const coresRoraima = {
    azul: '#0EA5E9',
    laranja: '#FF6B35',
    verde: '#10B981',
    roxo: '#8B5CF6',
    dourado: '#F59E0B',
    preto: '#000000',
    cinza: '#374151',
    cinzaClaro: '#6B7280'
  }

  // Função para calcular o índice de destaque de uma obra
  const calcularIndiceDestaque = (obra: any) => {
    // Simulando dados baseados nas métricas existentes
    const avancFisico = obra.metricas?.avancooFisico || 0
    const aderenciaCronograma = Math.min(100, obra.metricas?.progressoGeral * 1.2 || 0) // Simulado
    const execucaoFinanceira = Math.min(100, obra.metricas?.progressoGeral * 0.9 || 0) // Simulado  
    const tarefasCriticasEmDia = Math.min(100, (obra.metricas?.tarefasConcluidas / obra.metricas?.totalTarefas) * 120 || 0) // Simulado
    const pendenciasResolvidas = Math.min(100, obra.metricas?.avancooFisico * 1.1 || 0) // Simulado

    // Cálculo conforme a fórmula mostrada
    const indice = (
      (avancFisico/100 * 0.30) +
      (aderenciaCronograma/100 * 0.25) +
      (execucaoFinanceira/100 * 0.20) +
      (tarefasCriticasEmDia/100 * 0.15) +
      (pendenciasResolvidas/100 * 0.10)
    ) * 10 // Convertendo para escala 0-10

    return {
      indice: Math.round(indice * 100) / 100, // 2 casas decimais
      avancFisico,
      aderenciaCronograma,
      execucaoFinanceira,
      tarefasCriticasEmDia,
      pendenciasResolvidas
    }
  }

  // Encontrar a obra destaque (maior índice)
  const obrasComIndice = metricas.totalObras > 0 ? [
    // Simulando obras para o cálculo - em produção viria dos dados reais
    { nome: "SE Sucuba 69/34,5 kV", metricas: { avancooFisico: 72, progressoGeral: 66, tarefasConcluidas: 95, totalTarefas: 132 } },
    { nome: "SE Industrial 138kV", metricas: { avancooFisico: 45, progressoGeral: 52, tarefasConcluidas: 23, totalTarefas: 89 } },
    { nome: "LT Caracaraí-Rorainópolis", metricas: { avancooFisico: 88, progressoGeral: 85, tarefasConcluidas: 67, totalTarefas: 78 } }
  ].map(obra => ({ ...obra, indiceData: calcularIndiceDestaque(obra) })) : []

  const obraDestaque = obrasComIndice.length > 0 
    ? obrasComIndice.reduce((prev, current) => 
        prev.indiceData.indice > current.indiceData.indice ? prev : current
      )
    : null

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
      gap: '16px',
      padding: '0',
      fontFamily: 'Inter, sans-serif'
    }}>
      
      {/* Card 1 - Total de Obras */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        padding: '16px',
        border: '2px solid #e2e8f0',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        minHeight: '60px',
        transition: 'all 0.2s ease'
      }}>
        {/* Ícone */}
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '8px',
          backgroundColor: '#eff6ff',
          border: '2px solid ' + coresRoraima.azul,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={coresRoraima.azul} strokeWidth="2.5">
            <path d="M3 21h18"/>
            <path d="M5 21V7l8-4v18"/>
            <path d="M19 21V11l-6-4"/>
          </svg>
        </div>
        
        {/* Conteúdo */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '2px' }}>
            <h3 style={{
              color: coresRoraima.preto,
              fontSize: '14px',
              fontWeight: '700',
              margin: 0,
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              TOTAL DE OBRAS
            </h3>
            <span style={{ 
              fontSize: '24px', 
              fontWeight: '800', 
              color: coresRoraima.azul
            }}>
              {metricas.totalObras}
            </span>
          </div>
          <div style={{ 
            fontSize: '12px', 
            color: coresRoraima.cinzaClaro,
            fontWeight: '500'
          }}>
            {metricas.obrasComExecucao} com dados de execução
          </div>
        </div>
      </div>

      {/* Card 2 - Progresso Geral */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        padding: '16px',
        border: '2px solid #e2e8f0',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        minHeight: '60px',
        transition: 'all 0.2s ease'
      }}>
        {/* Ícone */}
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '8px',
          backgroundColor: '#eff6ff',
          border: '2px solid ' + coresRoraima.azul,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={coresRoraima.azul} strokeWidth="2.5">
            <path d="M3 3v18h18"/>
            <path d="M7 16l4-4 4 4 6-6"/>
          </svg>
        </div>
        
        {/* Conteúdo */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '2px' }}>
            <h3 style={{
              color: coresRoraima.preto,
              fontSize: '14px',
              fontWeight: '700',
              margin: 0,
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              PROGRESSO GERAL
            </h3>
            <span style={{ 
              fontSize: '24px', 
              fontWeight: '800', 
              color: coresRoraima.azul
            }}>
              {metricas.mediaaProgressoGeral}%
            </span>
          </div>
          <div style={{ 
            fontSize: '12px', 
            color: coresRoraima.cinzaClaro,
            fontWeight: '500'
          }}>
            Média de todas as tarefas
          </div>
        </div>
      </div>

      {/* Card 3 - Avanço Físico */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        padding: '16px',
        border: '2px solid #e2e8f0',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        minHeight: '60px',
        transition: 'all 0.2s ease'
      }}>
        {/* Ícone */}
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '8px',
          backgroundColor: '#f0fdf4',
          border: '2px solid ' + coresRoraima.verde,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={coresRoraima.verde} strokeWidth="2.5">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 6v6l4 4"/>
          </svg>
        </div>
        
        {/* Conteúdo */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '2px' }}>
            <h3 style={{
              color: coresRoraima.preto,
              fontSize: '14px',
              fontWeight: '700',
              margin: 0,
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              AVANÇO FÍSICO
            </h3>
            <span style={{ 
              fontSize: '24px', 
              fontWeight: '800', 
              color: coresRoraima.verde
            }}>
              {metricas.mediaAvancaoFisico}%
            </span>
          </div>
          <div style={{ 
            fontSize: '12px', 
            color: coresRoraima.cinzaClaro,
            fontWeight: '500'
          }}>
            Baseado em marcos físicos
          </div>
        </div>
      </div>

      {/* Card 4 - Marcos Físicos */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        padding: '16px',
        border: '2px solid #e2e8f0',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        minHeight: '60px',
        transition: 'all 0.2s ease'
      }}>
        {/* Ícone */}
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '8px',
          backgroundColor: '#faf5ff',
          border: '2px solid ' + coresRoraima.roxo,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={coresRoraima.roxo} strokeWidth="2.5">
            <path d="M9 12l2 2 4-4"/>
            <circle cx="12" cy="12" r="10"/>
          </svg>
        </div>
        
        {/* Conteúdo */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '2px' }}>
            <h3 style={{
              color: coresRoraima.preto,
              fontSize: '14px',
              fontWeight: '700',
              margin: 0,
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              MARCOS FÍSICOS
            </h3>
            <span style={{ 
              fontSize: '24px', 
              fontWeight: '800', 
              color: coresRoraima.roxo
            }}>
              {metricas.marcosFisicosConcluidos}/{metricas.totalMarcosFisicos}
            </span>
          </div>
          <div style={{ 
            fontSize: '12px', 
            color: coresRoraima.cinzaClaro,
            fontWeight: '500'
          }}>
            {avancaoFisicoPercentual}% concluídos
          </div>
        </div>
      </div>

      {/* Card 5 - Obra Destaque do Mês */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        padding: '16px',
        border: '2px solid #e2e8f0',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        minHeight: '60px',
        transition: 'all 0.2s ease',
        background: obraDestaque ? 'linear-gradient(135deg, #fef7ed 0%, #ffffff 100%)' : '#ffffff'
      }}>
        {/* Ícone */}
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '8px',
          backgroundColor: '#fef3e2',
          border: '2px solid ' + coresRoraima.dourado,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={coresRoraima.dourado} strokeWidth="2.5">
            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
            <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
            <path d="M4 22h16"/>
            <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
            <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
            <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
          </svg>
        </div>
        
        {/* Conteúdo */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '2px' }}>
            <h3 style={{
              color: coresRoraima.preto,
              fontSize: '14px',
              fontWeight: '700',
              margin: 0,
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              OBRA DESTAQUE
            </h3>
            <span style={{ 
              fontSize: '24px', 
              fontWeight: '800', 
              color: coresRoraima.dourado
            }}>
              {obraDestaque ? `${obraDestaque.indiceData.indice}/10` : 'N/A'}
            </span>
          </div>
          <div style={{ 
            fontSize: '12px', 
            color: coresRoraima.cinzaClaro,
            fontWeight: '500'
          }}>
            {obraDestaque ? obraDestaque.nome : 'Calculando índices...'}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MetricasObras