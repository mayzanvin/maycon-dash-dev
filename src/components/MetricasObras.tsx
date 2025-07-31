import { MetricasGerais } from '@/types/obra-unificada'

interface MetricasObrasProps {
  metricas: MetricasGerais
}

const MetricasObras: React.FC<MetricasObrasProps> = ({ metricas }) => {
  console.log("🔥 VERSÃO NOVA CARREGANDO - " + new Date().toLocaleTimeString())
  
  const avancaoFisicoPercentual = metricas.totalMarcosFisicos > 0 
    ? Math.round((metricas.marcosFisicosConcluidos / metricas.totalMarcosFisicos) * 100)
    : 0

  const coresRoraima = {
    azul: '#0EA5E9',
    laranja: '#FF6B35',
    verde: '#10B981',
    roxo: '#8B5CF6',
    preto: '#000000',
    cinza: '#374151',
    cinzaClaro: '#6B7280'
  }

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
      gap: '20px',
      padding: '0',
      fontFamily: 'Inter, sans-serif'
    }}>
      
      {/* Card 1 - Total de Obras */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '24px',
        border: '2px solid #e2e8f0',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '180px'
      }}>
        <div style={{
          width: '60px',
          height: '60px',
          borderRadius: '12px',
          backgroundColor: '#eff6ff',
          border: '2px solid ' + coresRoraima.azul,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px'
        }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={coresRoraima.azul} strokeWidth="2.5">
            <path d="M3 21h18"/>
            <path d="M5 21V7l8-4v18"/>
            <path d="M19 21V11l-6-4"/>
          </svg>
        </div>
        
        <h3 style={{
          color: coresRoraima.preto,
          fontSize: '16px',
          fontWeight: '800',
          margin: '0 0 16px 0',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
          textAlign: 'center',
          textTransform: 'uppercase',
          letterSpacing: '1.2px'
        }}>
          TOTAL DE OBRAS
        </h3>
        
        <div style={{ 
          fontSize: '36px', 
          fontWeight: '900', 
          color: coresRoraima.azul,
          marginBottom: '8px',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
        }}>
          {metricas.totalObras}
        </div>
        
        <div style={{ 
          fontSize: '13px', 
          color: coresRoraima.cinzaClaro,
          fontWeight: '600',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
          textAlign: 'center'
        }}>
          {metricas.obrasComExecucao} com dados de execução
        </div>
      </div>

      {/* Card 2 - Progresso Geral */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '24px',
        border: '2px solid #e2e8f0',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '180px'
      }}>
        <div style={{
          width: '60px',
          height: '60px',
          borderRadius: '12px',
          backgroundColor: '#eff6ff',
          border: '2px solid ' + coresRoraima.azul,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px'
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={coresRoraima.azul} strokeWidth="2">
            <path d="M3 3v18h18"/>
            <path d="M7 16l4-4 4 4 6-6"/>
          </svg>
        </div>
        
        <h3 style={{
          color: coresRoraima.preto,
          fontSize: '18px',
          fontWeight: '700',
          margin: '0 0 16px 0',
          fontFamily: 'Inter, sans-serif',
          textAlign: 'center',
          textTransform: 'uppercase',
          letterSpacing: '1px'
        }}>
          PROGRESSO GERAL
        </h3>
        
        <div style={{ 
          fontSize: '36px', 
          fontWeight: '800', 
          color: coresRoraima.azul,
          marginBottom: '8px',
          fontFamily: 'Inter, sans-serif'
        }}>
          {metricas.mediaaProgressoGeral}%
        </div>
        
        <div style={{ 
          fontSize: '14px', 
          color: coresRoraima.cinzaClaro,
          fontWeight: '500',
          fontFamily: 'Inter, sans-serif',
          textAlign: 'center'
        }}>
          Média de todas as tarefas
        </div>
      </div>

      {/* Card 3 - Avanço Físico */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '24px',
        border: '2px solid #e2e8f0',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '180px'
      }}>
        <div style={{
          width: '60px',
          height: '60px',
          borderRadius: '12px',
          backgroundColor: '#f0fdf4',
          border: '2px solid ' + coresRoraima.verde,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px'
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={coresRoraima.verde} strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 6v6l4 4"/>
          </svg>
        </div>
        
        <h3 style={{
          color: coresRoraima.preto,
          fontSize: '18px',
          fontWeight: '700',
          margin: '0 0 16px 0',
          fontFamily: 'Inter, sans-serif',
          textAlign: 'center',
          textTransform: 'uppercase',
          letterSpacing: '1px'
        }}>
          AVANÇO FÍSICO
        </h3>
        
        <div style={{ 
          fontSize: '36px', 
          fontWeight: '800', 
          color: coresRoraima.verde,
          marginBottom: '8px',
          fontFamily: 'Inter, sans-serif'
        }}>
          {metricas.mediaAvancaoFisico}%
        </div>
        
        <div style={{ 
          fontSize: '14px', 
          color: coresRoraima.cinzaClaro,
          fontWeight: '500',
          fontFamily: 'Inter, sans-serif',
          textAlign: 'center'
        }}>
          Baseado em marcos físicos
        </div>
      </div>

      {/* Card 4 - Marcos Físicos */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '24px',
        border: '2px solid #e2e8f0',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '180px'
      }}>
        <div style={{
          width: '60px',
          height: '60px',
          borderRadius: '12px',
          backgroundColor: '#faf5ff',
          border: '2px solid ' + coresRoraima.roxo,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px'
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={coresRoraima.roxo} strokeWidth="2">
            <path d="M9 12l2 2 4-4"/>
            <circle cx="12" cy="12" r="10"/>
          </svg>
        </div>
        
        <h3 style={{
          color: coresRoraima.preto,
          fontSize: '18px',
          fontWeight: '700',
          margin: '0 0 16px 0',
          fontFamily: 'Inter, sans-serif',
          textAlign: 'center',
          textTransform: 'uppercase',
          letterSpacing: '1px'
        }}>
          MARCOS FÍSICOS
        </h3>
        
        <div style={{ 
          fontSize: '36px', 
          fontWeight: '800', 
          color: coresRoraima.roxo,
          marginBottom: '8px',
          fontFamily: 'Inter, sans-serif'
        }}>
          {metricas.marcosFisicosConcluidos}/{metricas.totalMarcosFisicos}
        </div>
        
        <div style={{ 
          fontSize: '14px', 
          color: coresRoraima.cinzaClaro,
          fontWeight: '500',
          fontFamily: 'Inter, sans-serif',
          textAlign: 'center'
        }}>
          {avancaoFisicoPercentual}% concluídos
        </div>
      </div>
    </div>
  )
}

export default MetricasObras