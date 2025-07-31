import { MetricasGerais } from '@/types/obra-unificada'

interface MetricasObrasProps {
  metricas: MetricasGerais
}

const MetricasObras: React.FC<MetricasObrasProps> = ({ metricas }) => {
  const avancaoFisicoPercentual = metricas.totalMarcosFisicos > 0 
    ? Math.round((metricas.marcosFisicosConcluidos / metricas.totalMarcosFisicos) * 100)
    : 0

  // Cores da Roraima Energia
  const coresRoraima = {
    azul: '#0EA5E9',
    laranja: '#FF6B35',
    verde: '#10B981',
    roxo: '#8B5CF6',
    preto: '#000000',
    cinza: '#374151',
    cinzaClaro: '#6B7280'
  }

  const CardComponent = ({ 
    icon, 
    title, 
    value, 
    description, 
    color 
  }: { 
    icon: React.ReactNode; 
    title: string; 
    value: string | number; 
    description: string; 
    color: string 
  }) => (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '32px',
      border: '3px solid #e2e8f0',
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
      transition: 'all 0.3s ease',
      cursor: 'default',
      textAlign: 'center',
      minHeight: '200px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background gradient */}
      <div style={{
        position: 'absolute',
        top: '0',
        left: '0',
        right: '0',
        height: '4px',
        background: `linear-gradient(90deg, ${color}, ${color}80, ${color})`
      }} />
      
      {/* Icon */}
      <div style={{
        width: '80px',
        height: '80px',
        borderRadius: '16px',
        backgroundColor: color + '10',
        border: `3px solid ${color}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '24px',
        boxShadow: `0 6px 12px ${color}25`
      }}>
        {icon}
      </div>
      
      {/* Title */}
      <div style={{
        color: '#000000',
        fontSize: '20px',
        fontWeight: '800',
        marginBottom: '20px',
        letterSpacing: '0.8px',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
        textAlign: 'center',
        lineHeight: '1.2',
        textTransform: 'uppercase'
      }}>
        {title}
      </div>
      
      {/* Value */}
      <div style={{
        fontSize: '48px',
        fontWeight: '900',
        color: color,
        marginBottom: '12px',
        lineHeight: '1',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
        textShadow: `0 2px 4px ${color}40`
      }}>
        {value}
      </div>
      
      {/* Description */}
      <div style={{
        fontSize: '15px',
        color: '#6B7280',
        fontWeight: '600',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
        textAlign: 'center',
        lineHeight: '1.4',
        maxWidth: '180px'
      }}>
        {description}
      </div>
    </div>
  )

  return (
    <div>
      {/* Título da seção centralizado */}
      <div style={{
        textAlign: 'center',
        marginBottom: '40px',
        fontSize: '28px',
        fontWeight: '900',
        color: '#FF6B35',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
        textTransform: 'uppercase',
        letterSpacing: '2px',
        textShadow: '0 2px 4px rgba(255, 107, 53, 0.3)'
      }}>
        🚀 MÉTRICAS CORPORATIVAS - RORAIMA ENERGIA
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '32px',
        padding: '0',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
      }}>
        
        <CardComponent
          icon={
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={coresRoraima.azul} strokeWidth="3">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <rect x="7" y="7" width="3" height="9"/>
              <rect x="14" y="7" width="3" height="5"/>
            </svg>
          }
          title="Total de Obras"
          value={metricas.totalObras}
          description={`${metricas.obrasComExecucao} com dados de execução`}
          color={coresRoraima.azul}
        />

        <CardComponent
          icon={
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={coresRoraima.azul} strokeWidth="3">
              <path d="M3 3v18h18"/>
              <path d="M7 16l4-4 4 4 6-6"/>
              <circle cx="11" cy="11" r="2"/>
            </svg>
          }
          title="Progresso Geral"
          value={`${metricas.mediaaProgressoGeral}%`}
          description="Média de todas as tarefas"
          color={coresRoraima.azul}
        />

        <CardComponent
          icon={
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={coresRoraima.verde} strokeWidth="3">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 6v6l4 4"/>
              <circle cx="12" cy="12" r="2"/>
            </svg>
          }
          title="Avanço Físico"
          value={`${metricas.mediaAvancaoFisico}%`}
          description="Baseado em marcos físicos"
          color={coresRoraima.verde}
        />

        <CardComponent
          icon={
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={coresRoraima.roxo} strokeWidth="3">
              <path d="M9 12l2 2 4-4"/>
              <circle cx="12" cy="12" r="10"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          }
          title="Marcos Físicos"
          value={`${metricas.marcosFisicosConcluidos}/${metricas.totalMarcosFisicos}`}
          description={`${avancaoFisicoPercentual}% concluídos`}
          color={coresRoraima.roxo}
        />
      </div>
    </div>
  )
}

export default MetricasObras