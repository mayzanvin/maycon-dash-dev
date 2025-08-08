// src/components/ListaObrasUnificadas.tsx - CÓDIGO COMPLETO COM FUNÇÕES INLINE

import { ObraUnificada } from '@/types/obra-unificada'
import { Building2, Users, Wrench, Target, TrendingUp, DollarSign } from 'lucide-react'

interface ListaObrasUnificadasProps {
  obras: ObraUnificada[]
  showAll: boolean
  onObraClick: (obra: ObraUnificada) => void
}

const ListaObrasUnificadas: React.FC<ListaObrasUnificadasProps> = ({ obras, showAll, onObraClick }) => {
  // 💰 FUNÇÕES DE FORMATAÇÃO BRASILEIRA INLINE
  const formatarMoedaBR = (valor: number): string => {
    if (typeof valor !== 'number' || isNaN(valor)) {
      return 'R$ 0,00'
    }
    
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  }

  const formatarOrcamentoAprovado = (valor: number, correlacaoEncontrada: boolean): string => {
    if (!correlacaoEncontrada || valor === 0) {
      return 'Não encontrado'
    }
    return formatarMoedaBR(valor)
  }

  // Cores da Roraima Energia
  const coresRoraima = {
    azul: '#0EA5E9',
    verde: '#10B981',
    laranja: '#FF6B35',
    vermelho: '#EF4444',
    amarelo: '#F59E0B',
    roxo: '#8b5cf6',
    preto: '#000000',
    cinza: '#374151',
    cinzaClaro: '#6B7280'
  }

  if (!obras.length) {
    return (
      <div style={{
        backgroundColor: '#ffffff',
        border: '2px solid #e2e8f0',
        borderRadius: '12px',
        padding: '40px',
        textAlign: 'center',
        color: coresRoraima.cinza,
        fontSize: '16px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
      }}>
        ⚠️ Nenhuma obra encontrada para os filtros selecionados
      </div>
    )
  }

  // ✅ CORES POR STATUS HÍBRIDO
  const getCorStatus = (status: string) => {
    const statusLower = status.toLowerCase()
    
    if (statusLower.includes('adiantado')) return coresRoraima.verde
    if (statusLower.includes('atrasado')) return coresRoraima.vermelho
    if (statusLower.includes('no prazo')) return coresRoraima.azul
    if (statusLower.includes('fase de testes')) return coresRoraima.roxo
    if (statusLower.includes('execução em andamento')) return coresRoraima.laranja
    if (statusLower.includes('projeto executivo')) return coresRoraima.azul
    if (statusLower.includes('procedimentos preliminares')) return coresRoraima.amarelo
    if (statusLower.includes('comissionamento')) return coresRoraima.roxo
    if (statusLower.includes('aprovação final') || statusLower.includes('análise avançada')) return coresRoraima.verde
    if (statusLower.includes('concluído')) return coresRoraima.verde
    if (statusLower.includes('não iniciado')) return coresRoraima.cinza
    
    return coresRoraima.amarelo
  }

  // 💰 CORES POR EFICIÊNCIA FINANCEIRA
  const getCorEficiencia = (eficiencia: number) => {
    if (eficiencia <= 120) return coresRoraima.verde    // Eficiente
    if (eficiencia <= 150) return coresRoraima.amarelo  // Atenção
    return coresRoraima.vermelho                         // Crítico
  }

  // 💰 TEXTO DE EFICIÊNCIA
  const getTextoEficiencia = (eficiencia: number) => {
    if (eficiencia <= 120) return 'Eficiente'
    if (eficiencia <= 150) return 'Atenção'
    return 'Crítico'
  }

  return (
    <div style={{
      backgroundColor: '#ffffff',
      padding: '20px',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e2e8f0',
      marginBottom: '30px',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    }}>
      <h2 style={{ 
        fontSize: '24px', 
        marginBottom: '20px', 
        color: coresRoraima.preto,
        fontWeight: '700',
        textAlign: 'center',
        borderBottom: `3px solid ${coresRoraima.laranja}`,
        paddingBottom: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        width: '100%',
        textTransform: 'uppercase',
        letterSpacing: '1.5px',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
      }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={coresRoraima.laranja} strokeWidth="2.5">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          <path d="M9 9h6M9 13h6M9 17h3"/>
        </svg>
        RESUMO DAS OBRAS {showAll ? `(${obras.length} OBRAS)` : `(${Math.min(obras.length, 6)} DE ${obras.length})`}
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))',
        gap: '24px',
        justifyItems: 'stretch'
      }}>
        {(showAll ? obras : obras.slice(0, 6)).map((obra, index) => (
          <div
            key={obra.codigo}
            onClick={() => onObraClick(obra)}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              padding: '20px',
              border: '2px solid #e2e8f0',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)'
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)'
              e.currentTarget.style.borderColor = coresRoraima.laranja
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)'
              e.currentTarget.style.borderColor = '#e2e8f0'
            }}
          >
            {/* Header da obra */}
            <div style={{ marginBottom: '16px' }}>
              <h3 style={{
                color: coresRoraima.preto,
                fontSize: '16px',
                fontWeight: '700',
                margin: '0 0 8px 0',
                lineHeight: '1.4',
                wordWrap: 'break-word',
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
              }}>
                {obra.nome}
              </h3>
              
              {/* Código + Status na mesma linha */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '12px'
              }}>
                <p style={{
                  fontSize: '12px',
                  color: coresRoraima.cinza,
                  fontFamily: 'Inter, monospace',
                  backgroundColor: '#f8fafc',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  border: '1px solid #e2e8f0',
                  margin: '0',
                  fontWeight: '600',
                  flex: 1
                }}>
                  {obra.codigo}
                </p>
                
                <div style={{
                  backgroundColor: getCorStatus(obra.status),
                  color: '#ffffff',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '11px',
                  fontWeight: '600',
                  textAlign: 'center',
                  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
                  whiteSpace: 'nowrap',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                }}>
                  {obra.status}
                </div>
              </div>
            </div>

            {/* 💰 MÉTRICAS PRINCIPAIS - AGORA COM 3 COLUNAS */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '16px',
              marginBottom: '20px'
            }}>
              <div style={{
                backgroundColor: obra.progressoGeral === 100 ? '#f0fdf4' : obra.progressoGeral > 0 ? '#eff6ff' : '#fef2f2',
                border: `1px solid ${obra.progressoGeral === 100 ? coresRoraima.verde : obra.progressoGeral > 0 ? coresRoraima.azul : coresRoraima.vermelho}`,
                borderRadius: '8px',
                padding: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                  <TrendingUp style={{ 
                    width: '16px', 
                    height: '16px', 
                    color: obra.progressoGeral === 100 ? coresRoraima.verde : obra.progressoGeral > 0 ? coresRoraima.azul : coresRoraima.vermelho,
                    marginRight: '6px'
                  }} />
                  <span style={{ 
                    fontSize: '12px', 
                    color: coresRoraima.cinza,
                    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
                  }}>Progresso Geral</span>
                </div>
                <div style={{ 
                  fontSize: '22px', 
                  fontWeight: 'bold', 
                  color: obra.progressoGeral === 100 ? coresRoraima.verde : obra.progressoGeral > 0 ? coresRoraima.azul : coresRoraima.vermelho,
                  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
                }}>
                  {obra.progressoGeral}%
                </div>
              </div>

              <div style={{
                backgroundColor: obra.avancooFisico === 100 ? '#f0fdf4' : obra.avancooFisico > 0 ? '#ecfdf5' : '#fef2f2',
                border: `1px solid ${obra.avancooFisico === 100 ? coresRoraima.verde : obra.avancooFisico > 0 ? coresRoraima.verde : coresRoraima.vermelho}`,
                borderRadius: '8px',
                padding: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                  <Target style={{ 
                    width: '16px', 
                    height: '16px', 
                    color: obra.avancooFisico === 100 ? coresRoraima.verde : obra.avancooFisico > 0 ? coresRoraima.verde : coresRoraima.vermelho,
                    marginRight: '6px'
                  }} />
                  <span style={{ 
                    fontSize: '12px', 
                    color: coresRoraima.cinza,
                    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
                  }}>Avanço Físico</span>
                </div>
                <div style={{ 
                  fontSize: '22px', 
                  fontWeight: 'bold', 
                  color: obra.avancooFisico === 100 ? coresRoraima.verde : obra.avancooFisico > 0 ? coresRoraima.verde : coresRoraima.vermelho,
                  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
                }}>
                  {obra.avancooFisico}%
                </div>
                <div style={{ 
                  fontSize: '11px', 
                  color: coresRoraima.cinza,
                  fontWeight: '600',
                  marginTop: '2px'
                }}>
                  {obra.temEnergizacao ? 'Com Energização' : 'Sem Energização'}
                </div>
              </div>

              <div style={{
                backgroundColor: getCorEficiencia(obra.dadosFinanceiros.eficienciaExecucao) === coresRoraima.verde ? 
                                '#f0fdf4' :
                                getCorEficiencia(obra.dadosFinanceiros.eficienciaExecucao) === coresRoraima.amarelo ? '#fefce8' : '#fef2f2',
                border: `1px solid ${getCorEficiencia(obra.dadosFinanceiros.eficienciaExecucao)}`,
                borderRadius: '8px',
                padding: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                  <DollarSign style={{ 
                    width: '16px', 
                    height: '16px', 
                    color: getCorEficiencia(obra.dadosFinanceiros.eficienciaExecucao),
                    marginRight: '6px'
                  }} />
                  <span style={{ 
                    fontSize: '12px', 
                    color: coresRoraima.cinza,
                    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
                  }}>Eficiência</span>
                </div>
                <div style={{ 
                  fontSize: '22px', 
                  fontWeight: 'bold', 
                  color: getCorEficiencia(obra.dadosFinanceiros.eficienciaExecucao),
                  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
                }}>
                  {obra.dadosFinanceiros.eficienciaExecucao}%
                </div>
                <div style={{ 
                  fontSize: '11px', 
                  color: getCorEficiencia(obra.dadosFinanceiros.eficienciaExecucao),
                  fontWeight: '600',
                  marginTop: '2px'
                }}>
                  {getTextoEficiencia(obra.dadosFinanceiros.eficienciaExecucao)}
                </div>
              </div>
            </div>

            {/* 💰 SEÇÃO FINANCEIRA DETALHADA - CORRIGIDA COM FUNÇÕES INLINE */}
            <div style={{
              backgroundColor: '#f8fafc',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '16px',
              border: '1px solid #e2e8f0'
            }}>
              <h4 style={{
                fontSize: '14px',
                fontWeight: '600',
                color: coresRoraima.preto,
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <DollarSign style={{ width: '16px', height: '16px', color: coresRoraima.laranja }} />
                💰 Informações Financeiras
              </h4>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                fontSize: '13px'
              }}>
                <div>
                  <div style={{ color: coresRoraima.cinza, marginBottom: '2px' }}>Orçamento Total:</div>
                  <div style={{ fontWeight: '600', color: coresRoraima.preto }}>
                    {formatarMoedaBR(obra.dadosFinanceiros.orcamentoTotal)}
                  </div>
                </div>
                <div>
                  <div style={{ color: coresRoraima.cinza, marginBottom: '2px' }}>Valor Realizado:</div>
                  <div style={{ fontWeight: '600', color: coresRoraima.azul }}>
                    {formatarMoedaBR(obra.dadosFinanceiros.valorRealizado)}
                  </div>
                </div>
                <div>
                  <div style={{ color: coresRoraima.cinza, marginBottom: '2px' }}>Orçamento Aprovado:</div>
                  <div style={{ 
                    fontWeight: '600', 
                    color: obra.dadosFinanceiros.corelacionEncontrada ? coresRoraima.verde : coresRoraima.cinza 
                  }}>
                    {formatarOrcamentoAprovado(obra.dadosFinanceiros.orcamentoAprovado, obra.dadosFinanceiros.corelacionEncontrada)}
                  </div>
                </div>
                <div>
                  <div style={{ color: coresRoraima.cinza, marginBottom: '2px' }}>Progresso Financeiro:</div>
                  <div style={{ fontWeight: '600', color: coresRoraima.roxo }}>
                    {obra.dadosFinanceiros.progressoFinanceiro}%
                  </div>
                </div>
              </div>
            </div>

            {/* Detalhes das tarefas */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '12px',
              marginBottom: '16px'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '4px' }}>
                  <Building2 style={{ width: '14px', height: '14px', color: coresRoraima.cinza, marginRight: '4px' }} />
                  <span style={{ 
                    fontSize: '11px', 
                    color: coresRoraima.cinza,
                    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
                  }}>Total</span>
                </div>
                <div style={{ 
                  fontSize: '16px', 
                  fontWeight: 'bold', 
                  color: coresRoraima.preto,
                  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
                }}>
                  {obra.metricas.totalTarefas}
                </div>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '4px' }}>
                  <Users style={{ width: '14px', height: '14px', color: coresRoraima.cinza, marginRight: '4px' }} />
                  <span style={{ 
                    fontSize: '11px', 
                    color: coresRoraima.cinza,
                    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
                  }}>Concluídas</span>
                </div>
                <div style={{ 
                  fontSize: '16px', 
                  fontWeight: 'bold', 
                  color: coresRoraima.verde,
                  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
                }}>
                  {obra.metricas.tarefasConcluidas}
                </div>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '4px' }}>
                  <Wrench style={{ width: '14px', height: '14px', color: coresRoraima.cinza, marginRight: '4px' }} />
                  <span style={{ 
                    fontSize: '11px', 
                    color: coresRoraima.cinza,
                    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
                  }}>Marcos</span>
                </div>
                <div style={{ 
                  fontSize: '16px', 
                  fontWeight: 'bold', 
                  color: '#8b5cf6',
                  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
                }}>
                  {obra.metricas.marcosConcluidos}/{obra.metricas.totalMarcos}
                </div>
              </div>
            </div>

            {/* Call to action */}
            <div style={{
              textAlign: 'center',
              padding: '8px',
              backgroundColor: '#fff7ed',
              border: `1px solid ${coresRoraima.laranja}`,
              borderRadius: '6px',
              fontSize: '12px',
              color: coresRoraima.laranja,
              fontWeight: '600',
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
            }}>
              🔍 Clique para ver detalhes completos + Curvas S
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ListaObrasUnificadas