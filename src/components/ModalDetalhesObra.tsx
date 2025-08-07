// src/components/ModalDetalhesObra.tsx - VERSÃO RICA SEM CURVATENDENCIA
import { useEffect } from 'react'
import { ObraUnificada } from '@/types/obra-unificada'
import { X, Calendar, TrendingUp, AlertTriangle, CheckCircle, Building2, Users, Wrench } from 'lucide-react'
// import CurvaTendencia from './CurvaTendencia' // TEMPORARIAMENTE REMOVIDO

interface ModalDetalhesObraProps {
  obra: ObraUnificada | null
  onClose: () => void
}

const ModalDetalhesObra: React.FC<ModalDetalhesObraProps> = ({ obra, onClose }) => {
  // Cores da Roraima Energia (consistente com o dashboard)
  const coresRoraima = {
    azul: '#0EA5E9',
    verde: '#10B981',
    laranja: '#FF6B35',
    vermelho: '#EF4444',
    amarelo: '#F59E0B',
    roxo: '#8b5cf6',
    preto: '#000000',
    cinza: '#374151',
    cinzaClaro: '#6B7280',
    branco: '#ffffff'
  }

  // Fechar modal com ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    
    if (obra) {
      document.addEventListener('keydown', handleEsc)
      document.body.style.overflow = 'hidden' // Prevenir scroll
    }
    
    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = 'unset'
    }
  }, [obra, onClose])

  if (!obra) return null

  // ✅ CALCULAR DATAS REAIS COM PROTEÇÃO CONTRA DADOS VAZIOS
  const calcularDatasExtremas = () => {
    const todasTarefas = [...obra.fiscalizacao.tarefas, ...obra.execucao.tarefas]
    
    if (todasTarefas.length === 0) {
      return {
        dataInicio: 0,
        dataTermino: 0,
        dataInicioBase: 0,
        dataTerminoBase: 0,
        duracaoTotal: 0
      }
    }
    
    // ✅ FILTRAR DADOS VÁLIDOS CORRETAMENTE
    const datasInicio = todasTarefas
      .map(t => typeof t['Data Início'] === 'number' ? t['Data Início'] : 0)
      .filter(d => d > 0)
    
    const datasTermino = todasTarefas
      .map(t => typeof t['Data Término'] === 'number' ? t['Data Término'] : 0)
      .filter(d => d > 0)
    
    const datasBaseInicio = todasTarefas
      .map(t => typeof t['LinhaBase Início'] === 'number' ? t['LinhaBase Início'] : 0)
      .filter(d => d > 0)
    
    const datasBaseTermino = todasTarefas
      .map(t => typeof t['LinhaBase Término'] === 'number' ? t['LinhaBase Término'] : 0)
      .filter(d => d > 0)
    
    return {
      dataInicio: datasInicio.length > 0 ? Math.min(...datasInicio) : 0,
      dataTermino: datasTermino.length > 0 ? Math.max(...datasTermino) : 0,
      dataInicioBase: datasBaseInicio.length > 0 ? Math.min(...datasBaseInicio) : 0,
      dataTerminoBase: datasBaseTermino.length > 0 ? Math.max(...datasBaseTermino) : 0,
      duracaoTotal: 0
    }
  }

  // ✅ FORMATAÇÃO DE DATA MAIS ROBUSTA
  const formatarData = (excelDate: number): string => {
    if (!excelDate || excelDate <= 0) return 'Não definida'
    
    try {
      const date = new Date((excelDate - 25569) * 86400 * 1000)
      if (isNaN(date.getTime())) return 'Data inválida'
      return date.toLocaleDateString('pt-BR')
    } catch (error) {
      return 'Data inválida'
    }
  }

  // ✅ CORES POR STATUS (igual aos cards)
  const getCorStatus = (status: string) => {
    const statusLower = status.toLowerCase()
    
    if (statusLower.includes('adiantado')) return coresRoraima.verde
    if (statusLower.includes('atrasado')) return coresRoraima.vermelho
    if (statusLower.includes('no prazo')) return coresRoraima.azul
    if (statusLower.includes('concluído')) return coresRoraima.verde
    if (statusLower.includes('execução em andamento')) return coresRoraima.laranja
    if (statusLower.includes('comissionamento')) return coresRoraima.roxo
    if (statusLower.includes('procedimentos preliminares')) return coresRoraima.amarelo
    
    return coresRoraima.azul
  }

  const { dataInicio, dataTermino, dataInicioBase, dataTerminoBase } = calcularDatasExtremas()
  
  // ✅ CÁLCULO DE ATRASO MAIS SEGURO
  const diasAtraso = (dataTermino > 0 && dataTerminoBase > 0) ? dataTermino - dataTerminoBase : 0
  const statusAtraso = diasAtraso > 0 ? 'Atrasada' : diasAtraso < 0 ? 'Adiantada' : 'No prazo'
  const corStatus = getCorStatus(obra.status)

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // ✅ Fundo mais sutil
      backdropFilter: 'blur(4px)', // ✅ Efeito blur moderno
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    }}
    onClick={onClose}
    >
      <div style={{
        backgroundColor: coresRoraima.branco, // ✅ Fundo branco como o dashboard
        borderRadius: '16px', // ✅ Bordas mais arredondadas
        maxWidth: '1200px', // ✅ Maior para acomodar gráficos
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', // ✅ Sombra mais suave
        border: '1px solid #e2e8f0' // ✅ Borda sutil
      }}
      onClick={(e) => e.stopPropagation()}
      >
        {/* ✅ HEADER REDESENHADO - Estilo Roraima Energia */}
        <div style={{
          padding: '32px 32px 24px',
          borderBottom: `3px solid ${coresRoraima.laranja}`, // ✅ Borda laranja como no dashboard
          background: `linear-gradient(135deg, ${coresRoraima.branco} 0%, #f8fafc 100%)` // ✅ Gradiente sutil
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start'
          }}>
            <div style={{ flex: 1 }}>
              {/* ✅ TÍTULO COM DESTAQUE */}
              <h2 style={{
                fontSize: '28px',
                fontWeight: '800',
                color: coresRoraima.preto,
                marginBottom: '8px',
                lineHeight: '1.2'
              }}>
                {obra.nome}
              </h2>
              
              {/* ✅ CÓDIGO E STATUS NA MESMA LINHA */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginBottom: '12px'
              }}>
                <p style={{
                  color: coresRoraima.cinza,
                  fontSize: '14px',
                  fontFamily: 'Inter, monospace',
                  backgroundColor: '#f8fafc',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  margin: '0',
                  fontWeight: '600'
                }}>
                  {obra.codigo}
                </p>
                
                <div style={{
                  backgroundColor: corStatus,
                  color: coresRoraima.branco,
                  padding: '6px 16px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: '600',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                }}>
                  {obra.status}
                </div>
              </div>
            </div>
            
            {/* ✅ BOTÃO FECHAR REDESENHADO */}
            <button
              onClick={onClose}
              style={{
                background: coresRoraima.vermelho,
                border: 'none',
                cursor: 'pointer',
                padding: '12px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 6px -1px rgba(239, 68, 68, 0.3)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)'
                e.currentTarget.style.boxShadow = '0 6px 8px -1px rgba(239, 68, 68, 0.4)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)'
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(239, 68, 68, 0.3)'
              }}
            >
              <X style={{ width: '20px', height: '20px', color: coresRoraima.branco }} />
            </button>
          </div>
        </div>

        {/* ✅ STATUS DA OBRA REDESENHADO */}
        <div style={{
          padding: '32px',
          borderBottom: '1px solid #e2e8f0'
        }}>
          <h3 style={{ 
            fontSize: '20px', 
            fontWeight: '700', 
            marginBottom: '24px', 
            color: coresRoraima.preto,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <TrendingUp style={{ width: '24px', height: '24px', color: coresRoraima.laranja }} />
            Status Geral da Obra
          </h3>
          
          {/* ✅ CARDS DE MÉTRICAS PRINCIPAIS */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            marginBottom: '24px'
          }}>
            {/* Progresso Geral */}
            <div style={{
              padding: '20px',
              backgroundColor: '#eff6ff',
              borderRadius: '12px',
              border: `2px solid ${coresRoraima.azul}`,
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                <TrendingUp style={{ width: '20px', height: '20px', color: coresRoraima.azul }} />
                <span style={{ marginLeft: '8px', fontWeight: '600', color: coresRoraima.preto }}>
                  Progresso Geral
                </span>
              </div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: coresRoraima.azul, marginBottom: '4px' }}>
                {obra.progressoGeral}%
              </div>
              <div style={{ fontSize: '14px', color: coresRoraima.cinza }}>
                {obra.tarefasConcluidas}/{obra.totalTarefas} tarefas concluídas
              </div>
            </div>

            {/* Avanço Físico */}
            <div style={{
              padding: '20px',
              backgroundColor: '#f0fdf4',
              borderRadius: '12px',
              border: `2px solid ${coresRoraima.verde}`,
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                <CheckCircle style={{ width: '20px', height: '20px', color: coresRoraima.verde }} />
                <span style={{ marginLeft: '8px', fontWeight: '600', color: coresRoraima.preto }}>
                  Avanço Físico
                </span>
              </div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: coresRoraima.verde, marginBottom: '4px' }}>
                {obra.avancooFisico}%
              </div>
              <div style={{ fontSize: '14px', color: coresRoraima.cinza }}>
                {obra.marcos.concluidos}/{obra.marcos.total} marcos físicos
              </div>
            </div>

            {/* Status do Cronograma */}
            <div style={{
              padding: '20px',
              backgroundColor: corStatus === coresRoraima.verde ? '#f0fdf4' : 
                             corStatus === coresRoraima.vermelho ? '#fef2f2' : '#eff6ff',
              borderRadius: '12px',
              border: `2px solid ${corStatus}`,
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                {obra.status.toLowerCase().includes('atrasado') ? (
                  <AlertTriangle style={{ width: '20px', height: '20px', color: corStatus }} />
                ) : (
                  <CheckCircle style={{ width: '20px', height: '20px', color: corStatus }} />
                )}
                <span style={{ marginLeft: '8px', fontWeight: '600', color: coresRoraima.preto }}>
                  Status do Cronograma
                </span>
              </div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: corStatus, marginBottom: '4px' }}>
                {statusAtraso}
              </div>
              {diasAtraso !== 0 && (
                <div style={{ fontSize: '14px', color: coresRoraima.cinza }}>
                  {Math.abs(diasAtraso)} dias {diasAtraso > 0 ? 'de atraso' : 'adiantada'}
                </div>
              )}
            </div>
          </div>

          {/* ✅ INFORMAÇÕES FINANCEIRAS MELHORADAS */}
          <div style={{
            backgroundColor: '#f8fafc',
            borderRadius: '12px',
            padding: '24px',
            border: '1px solid #e2e8f0',
            marginBottom: '24px'
          }}>
            <h4 style={{ 
              fontSize: '18px', 
              fontWeight: '600', 
              marginBottom: '20px', 
              color: coresRoraima.preto,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              💰 Informações Financeiras
            </h4>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '16px' 
            }}>
              <div>
                <div style={{ fontSize: '12px', color: coresRoraima.cinza, marginBottom: '4px' }}>
                  Orçamento Total:
                </div>
                <div style={{ fontSize: '16px', fontWeight: 'bold', color: coresRoraima.preto }}>
                  R$ {obra.dadosFinanceiros.orcamentoTotal.toLocaleString()}
                </div>
              </div>
              
              <div>
                <div style={{ fontSize: '12px', color: coresRoraima.cinza, marginBottom: '4px' }}>
                  Valor Realizado:
                </div>
                <div style={{ fontSize: '16px', fontWeight: 'bold', color: coresRoraima.azul }}>
                  R$ {obra.dadosFinanceiros.valorRealizado.toLocaleString()}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '12px', color: coresRoraima.cinza, marginBottom: '4px' }}>
                  Progresso Financeiro:
                </div>
                <div style={{ fontSize: '16px', fontWeight: 'bold', color: coresRoraima.verde }}>
                  {obra.dadosFinanceiros.progressoFinanceiro}%
                </div>
              </div>

              <div>
                <div style={{ fontSize: '12px', color: coresRoraima.cinza, marginBottom: '4px' }}>
                  Correlação Encontrada:
                </div>
                <div style={{ 
                  fontSize: '16px', 
                  fontWeight: 'bold', 
                  color: obra.dadosFinanceiros.corelacionEncontrada ? coresRoraima.verde : coresRoraima.vermelho
                }}>
                  {obra.dadosFinanceiros.corelacionEncontrada ? 'Sim' : 'Não'}
                </div>
              </div>
            </div>
          </div>

          {/* ✅ RESUMO DE TAREFAS */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '16px',
            marginBottom: '24px'
          }}>
            <div style={{
              textAlign: 'center',
              padding: '16px',
              backgroundColor: '#f8fafc',
              borderRadius: '8px',
              border: '1px solid #e2e8f0'
            }}>
              <Building2 style={{ width: '24px', height: '24px', color: coresRoraima.cinza, margin: '0 auto 8px' }} />
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: coresRoraima.preto }}>
                {obra.totalTarefas}
              </div>
              <div style={{ fontSize: '12px', color: coresRoraima.cinza }}>Total de Tarefas</div>
            </div>

            <div style={{
              textAlign: 'center',
              padding: '16px',
              backgroundColor: '#f0fdf4',
              borderRadius: '8px',
              border: '1px solid #dcfce7'
            }}>
              <Users style={{ width: '24px', height: '24px', color: coresRoraima.verde, margin: '0 auto 8px' }} />
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: coresRoraima.verde }}>
                {obra.tarefasConcluidas}
              </div>
              <div style={{ fontSize: '12px', color: coresRoraima.cinza }}>Concluídas</div>
            </div>

            <div style={{
              textAlign: 'center',
              padding: '16px',
              backgroundColor: '#fefce8',
              borderRadius: '8px',
              border: '1px solid #fef3c7'
            }}>
              <Wrench style={{ width: '24px', height: '24px', color: coresRoraima.roxo, margin: '0 auto 8px' }} />
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: coresRoraima.roxo }}>
                {obra.marcos.concluidos}/{obra.marcos.total}
              </div>
              <div style={{ fontSize: '12px', color: coresRoraima.cinza }}>Marcos Físicos</div>
            </div>
          </div>

          {/* ✅ INFORMAÇÕES DE DATAS REDESENHADAS */}
          <div style={{
            padding: '20px',
            backgroundColor: '#f8fafc',
            borderRadius: '12px',
            border: '1px solid #e2e8f0'
          }}>
            <h4 style={{ 
              fontSize: '16px', 
              fontWeight: '600', 
              marginBottom: '16px', 
              color: coresRoraima.preto,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Calendar style={{ width: '18px', height: '18px', color: coresRoraima.laranja }} />
              Cronograma da Obra
            </h4>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '16px',
              fontSize: '14px'
            }}>
              <div style={{
                padding: '12px',
                backgroundColor: coresRoraima.branco,
                borderRadius: '8px',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ color: coresRoraima.cinza, marginBottom: '4px', fontSize: '12px' }}>Início Previsto:</div>
                <div style={{ fontWeight: '600', color: coresRoraima.preto }}>{formatarData(dataInicioBase)}</div>
              </div>
              <div style={{
                padding: '12px',
                backgroundColor: coresRoraima.branco,
                borderRadius: '8px',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ color: coresRoraima.cinza, marginBottom: '4px', fontSize: '12px' }}>Início Real:</div>
                <div style={{ fontWeight: '600', color: coresRoraima.preto }}>{formatarData(dataInicio)}</div>
              </div>
              <div style={{
                padding: '12px',
                backgroundColor: coresRoraima.branco,
                borderRadius: '8px',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ color: coresRoraima.cinza, marginBottom: '4px', fontSize: '12px' }}>Término Previsto:</div>
                <div style={{ fontWeight: '600', color: coresRoraima.preto }}>{formatarData(dataTerminoBase)}</div>
              </div>
              <div style={{
                padding: '12px',
                backgroundColor: coresRoraima.branco,
                borderRadius: '8px',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ color: coresRoraima.cinza, marginBottom: '4px', fontSize: '12px' }}>Término Real:</div>
                <div style={{ fontWeight: '600', color: coresRoraima.preto }}>{formatarData(dataTermino)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* ✅ CURVA DE TENDÊNCIA REDESENHADA */}
        <div style={{ padding: '32px' }}>
          <h3 style={{ 
            fontSize: '20px', 
            fontWeight: '700', 
            marginBottom: '20px', 
            color: coresRoraima.preto,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <TrendingUp style={{ width: '24px', height: '24px', color: coresRoraima.azul }} />
            Curva de Tendência - Realizado vs Previsto
          </h3>
          
          {/* ✅ PLACEHOLDER PARA CURVA DE TENDÊNCIA */}
          <div style={{
            backgroundColor: '#f8fafc',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            padding: '40px',
            textAlign: 'center'
          }}>
            <h4 style={{ 
              fontSize: '18px', 
              fontWeight: '600', 
              color: coresRoraima.preto, 
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}>
              <TrendingUp style={{ width: '20px', height: '20px', color: coresRoraima.azul }} />
              📈 Curva S - Análise de Tendência
            </h4>
            <p style={{ 
              fontSize: '14px', 
              color: coresRoraima.cinza, 
              marginBottom: '24px' 
            }}>
              Gráficos detalhados de progresso físico e financeiro
            </p>
            
            {/* Cards de Performance */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '16px',
              marginBottom: '20px'
            }}>
              <div style={{
                padding: '20px',
                backgroundColor: coresRoraima.branco,
                borderRadius: '10px',
                border: '2px solid #10b981',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
              }}>
                <div style={{ 
                  fontSize: '12px', 
                  color: coresRoraima.cinza, 
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                  fontWeight: '600' 
                }}>
                  Performance Física
                </div>
                <div style={{ 
                  fontSize: '28px', 
                  fontWeight: 'bold', 
                  color: coresRoraima.verde,
                  marginBottom: '4px'
                }}>
                  {obra.avancooFisico}%
                </div>
                <div style={{ fontSize: '11px', color: coresRoraima.cinza }}>
                  {obra.marcos.concluidos}/{obra.marcos.total} marcos
                </div>
              </div>
              
              <div style={{
                padding: '20px',
                backgroundColor: coresRoraima.branco,
                borderRadius: '10px',
                border: `2px solid ${
                  obra.dadosFinanceiros.statusEficiencia === 'Eficiente' ? coresRoraima.verde :
                  obra.dadosFinanceiros.statusEficiencia === 'Atenção' ? coresRoraima.amarelo :
                  coresRoraima.vermelho
                }`,
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
              }}>
                <div style={{ 
                  fontSize: '12px', 
                  color: coresRoraima.cinza, 
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                  fontWeight: '600' 
                }}>
                  Performance Financeira
                </div>
                <div style={{ 
                  fontSize: '28px', 
                  fontWeight: 'bold', 
                  color: obra.dadosFinanceiros.statusEficiencia === 'Eficiente' ? coresRoraima.verde :
                         obra.dadosFinanceiros.statusEficiencia === 'Atenção' ? coresRoraima.amarelo :
                         coresRoraima.vermelho,
                  marginBottom: '4px'
                }}>
                  {obra.dadosFinanceiros.progressoFinanceiro}%
                </div>
                <div style={{ fontSize: '11px', color: coresRoraima.cinza }}>
                  {obra.dadosFinanceiros.statusEficiencia}
                </div>
              </div>
              
              <div style={{
                padding: '20px',
                backgroundColor: coresRoraima.branco,
                borderRadius: '10px',
                border: '2px solid #8b5cf6',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
              }}>
                <div style={{ 
                  fontSize: '12px', 
                  color: coresRoraima.cinza, 
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                  fontWeight: '600' 
                }}>
                  Eficiência Execução
                </div>
                <div style={{ 
                  fontSize: '28px', 
                  fontWeight: 'bold', 
                  color: coresRoraima.roxo,
                  marginBottom: '4px'
                }}>
                  {obra.dadosFinanceiros.eficienciaExecucao}%
                </div>
                <div style={{ fontSize: '11px', color: coresRoraima.cinza }}>
                  vs previsto
                </div>
              </div>
            </div>

            {/* Nota sobre desenvolvimento */}
            <div style={{
              padding: '12px 16px',
              backgroundColor: '#fef3cd',
              borderRadius: '8px',
              border: '1px solid #fbbf24',
              fontSize: '13px',
              color: '#92400e'
            }}>
              ⚡ <strong>Gráficos interativos</strong> em desenvolvimento - Dados de performance disponíveis acima
            </div>
          </div>

          {/* ✅ DETALHES DE FISCALIZAÇÃO E EXECUÇÃO */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '20px',
            marginTop: '32px'
          }}>
            <div style={{
              backgroundColor: '#f8fafc',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid #e2e8f0'
            }}>
              <h4 style={{ 
                fontSize: '16px', 
                fontWeight: '600', 
                marginBottom: '16px', 
                color: coresRoraima.preto,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                📋 Fiscalização
              </h4>
              <div style={{ display: 'grid', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '14px', color: coresRoraima.cinza }}>Tarefas Concluídas:</span>
                  <span style={{ fontSize: '14px', fontWeight: 'bold' }}>
                    {obra.fiscalizacao.tarefasConcluidas || 0}/{obra.fiscalizacao.totalTarefas || 0}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '14px', color: coresRoraima.cinza }}>Progresso Fornecimentos:</span>
                  <span style={{ fontSize: '14px', fontWeight: 'bold', color: coresRoraima.azul }}>
                    {obra.fiscalizacao.progressoFornecimentos}%
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '14px', color: coresRoraima.cinza }}>Progresso Médio:</span>
                  <span style={{ fontSize: '14px', fontWeight: 'bold', color: coresRoraima.verde }}>
                    {obra.fiscalizacao.progressoMedio}%
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '14px', color: coresRoraima.cinza }}>Total de Tarefas:</span>
                  <span style={{ fontSize: '14px', fontWeight: 'bold' }}>
                    {obra.fiscalizacao.tarefas.length}
                  </span>
                </div>
              </div>
            </div>

            <div style={{
              backgroundColor: '#f8fafc',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid #e2e8f0'
            }}>
              <h4 style={{ 
                fontSize: '16px', 
                fontWeight: '600', 
                marginBottom: '16px', 
                color: coresRoraima.preto,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                🏗️ Execução
              </h4>
              <div style={{ display: 'grid', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '14px', color: coresRoraima.cinza }}>Tarefas Concluídas:</span>
                  <span style={{ fontSize: '14px', fontWeight: 'bold' }}>
                    {obra.execucao.tarefasConcluidas || 0}/{obra.execucao.totalTarefas || 0}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '14px', color: coresRoraima.cinza }}>Progresso Execução:</span>
                  <span style={{ fontSize: '14px', fontWeight: 'bold', color: coresRoraima.azul }}>
                    {obra.execucao.progressoExecucao}%
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '14px', color: coresRoraima.cinza }}>Progresso Médio:</span>
                  <span style={{ fontSize: '14px', fontWeight: 'bold', color: coresRoraima.verde }}>
                    {obra.execucao.progressoMedio}%
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '14px', color: coresRoraima.cinza }}>Total de Tarefas:</span>
                  <span style={{ fontSize: '14px', fontWeight: 'bold' }}>
                    {obra.execucao.tarefas.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ModalDetalhesObra