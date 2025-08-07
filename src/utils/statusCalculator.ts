// src/utils/statusCalculator.ts - VERSÃO SIMPLIFICADA E ROBUSTA

import { BaseObraData } from '@/types/obra'

/**
 * 🚀 FUNÇÃO PRINCIPAL SIMPLIFICADA PARA USO NO dataAdapter
 */
export function determinarStatusMelhorado(
  tarefasF: BaseObraData[], 
  tarefasE: BaseObraData[]
): string {
  
  const todasTarefas = [...tarefasF, ...tarefasE]
  console.log(`\n🔍 === CÁLCULO DE STATUS SIMPLIFICADO ===`)
  console.log(`📊 Analisando ${todasTarefas.length} tarefas`)
  
  // 1️⃣ CALCULAR PROGRESSO GERAL
  const progressoGeral = calcularProgressoGeral(todasTarefas)
  console.log(`📈 Progresso geral: ${progressoGeral}%`)
  
  // 2️⃣ IDENTIFICAR FASE
  const fase = identificarFase(todasTarefas)
  console.log(`📍 Fase identificada: ${fase}`)
  
  // 3️⃣ DETERMINAR STATUS POR LÓGICA SIMPLES
  const status = determinarStatusPorProgresso(progressoGeral, fase, tarefasF.length, tarefasE.length)
  console.log(`🎯 Status final: ${status}`)
  
  return status
}

/**
 * 📊 CALCULA PROGRESSO GERAL
 */
function calcularProgressoGeral(tarefas: BaseObraData[]): number {
  if (tarefas.length === 0) return 0
  
  const progressos = tarefas.map(t => Number(t.Porcentagem_Conclu_do) || 0)
  return Math.round(progressos.reduce((a, b) => a + b, 0) / progressos.length)
}

/**
 * 📍 IDENTIFICA FASE DA OBRA
 */
function identificarFase(tarefas: BaseObraData[]): string {
  
  // Analisar resumos para identificar fase predominante
  const resumos = tarefas
    .map(t => String(t.Resumo_pai || '').toLowerCase())
    .filter(r => r.length > 0)
  
  const textoCombinado = resumos.join(' ')
  
  // Contadores por fase
  let scoreExecucao = 0
  let scoreProjetos = 0
  let scoreComissionamento = 0
  let scorePreliminar = 0
  
  // Palavras-chave para execução
  const palavrasExecucao = ['obra', 'civil', 'eletromecânica', 'montagem', 'construção', 'instalação', 'fornecimentos', 'equipamentos', 'fundação']
  palavrasExecucao.forEach(palavra => {
    if (textoCombinado.includes(palavra)) scoreExecucao++
  })
  
  // Palavras-chave para projetos
  const palavrasProjetos = ['projeto', 'desenho', 'elaboração', 'estudos', 'aprovação', 'análise']
  palavrasProjetos.forEach(palavra => {
    if (textoCombinado.includes(palavra)) scoreProjetos++
  })
  
  // Palavras-chave para comissionamento
  const palavrasComissionamento = ['comissionamento', 'energização', 'testes', 'ensaios', 'entrada em operação']
  palavrasComissionamento.forEach(palavra => {
    if (textoCombinado.includes(palavra)) scoreComissionamento++
  })
  
  // Palavras-chave para preliminar
  const palavrasPreliminar = ['contratação', 'aquisição', 'licença', 'permissão', 'rfp', 'licitação']
  palavrasPreliminar.forEach(palavra => {
    if (textoCombinado.includes(palavra)) scorePreliminar++
  })
  
  console.log(`   📊 Scores: Execução=${scoreExecucao}, Projetos=${scoreProjetos}, Comissionamento=${scoreComissionamento}, Preliminar=${scorePreliminar}`)
  
  // Determinar fase com maior score
  const maxScore = Math.max(scoreExecucao, scoreProjetos, scoreComissionamento, scorePreliminar)
  
  if (maxScore === 0) return 'Projetos Executivos' // Default
  
  if (scoreExecucao === maxScore) return 'Execução'
  if (scoreComissionamento === maxScore) return 'Comissionamento'
  if (scorePreliminar === maxScore) return 'Procedimentos Preliminares'
  return 'Projetos Executivos'
}

/**
 * 🎯 DETERMINA STATUS BASEADO NO PROGRESSO E FASE
 */
function determinarStatusPorProgresso(
  progressoGeral: number, 
  fase: string, 
  qtdTarefasF: number, 
  qtdTarefasE: number
): string {
  
  let statusBase = ''
  let emoji = ''
  
  // 🏁 OBRA CONCLUÍDA
  if (progressoGeral >= 100) {
    return '✅ Concluída'
  }
  
  // 📊 LÓGICA POR FASE E PROGRESSO
  if (fase === 'Procedimentos Preliminares') {
    if (progressoGeral >= 80) {
      emoji = '🟢'
      statusBase = 'Adiantada'
    } else if (progressoGeral >= 50) {
      emoji = '🟡'
      statusBase = 'No Prazo'
    } else {
      emoji = '🔴'
      statusBase = 'Atrasada'
    }
  } else if (fase === 'Projetos Executivos') {
    if (progressoGeral >= 85) {
      emoji = '🟢'
      statusBase = 'Adiantada'
    } else if (progressoGeral >= 60) {
      emoji = '🟡'
      statusBase = 'No Prazo'
    } else {
      emoji = '🔴'
      statusBase = 'Atrasada'
    }
  } else if (fase === 'Execução') {
    if (progressoGeral >= 90) {
      emoji = '🟢'
      statusBase = 'Adiantada'
    } else if (progressoGeral >= 70) {
      emoji = '🟡'
      statusBase = 'No Prazo'
    } else {
      emoji = '🔴'
      statusBase = 'Atrasada'
    }
  } else if (fase === 'Comissionamento') {
    if (progressoGeral >= 95) {
      emoji = '🟢'
      statusBase = 'Adiantada'
    } else if (progressoGeral >= 80) {
      emoji = '🟡'
      statusBase = 'No Prazo'
    } else {
      emoji = '🔴'
      statusBase = 'Atrasada'
    }
  } else {
    // Default
    if (progressoGeral >= 80) {
      emoji = '🟢'
      statusBase = 'Adiantada'
    } else if (progressoGeral >= 50) {
      emoji = '🟡'
      statusBase = 'No Prazo'
    } else {
      emoji = '🔴'
      statusBase = 'Atrasada'
    }
  }
  
  // 🔧 AJUSTES ESPECIAIS
  
  // Se tem execução mas progresso muito baixo
  if (qtdTarefasE > 0 && progressoGeral < 40) {
    emoji = '🔴'
    statusBase = 'Atrasada'
  }
  
  // Se só tem fiscalização e progresso alto
  if (qtdTarefasE === 0 && qtdTarefasF > 0 && progressoGeral >= 90) {
    emoji = '🟢'
    statusBase = 'Adiantada'
  }
  
  return `${emoji} ${fase} - ${statusBase}`
}