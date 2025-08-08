// src/utils/formatacaoMonetaria.ts - VERSÃO APRIMORADA

/**
 * Utilitário para formatação de valores monetários no padrão brasileiro
 * Versão aprimorada com tratamento robusto de casos extremos
 */

// 💰 FORMATAÇÃO COMPLETA BRASILEIRA (para cards e modais)
export const formatarMoedaBR = (valor: number | null | undefined): string => {
  // Validação robusta de entrada
  if (valor === null || valor === undefined || typeof valor !== 'number' || isNaN(valor)) {
    return 'R$ 0,00'
  }
  
  // Garantir que o valor seja positivo
  const valorLimpo = Math.abs(valor)
  
  return valorLimpo.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

// 💰 FORMATAÇÃO RESUMIDA (para métricas do topo)
export const formatarMoedaResumo = (valor: number | null | undefined): string => {
  if (valor === null || valor === undefined || typeof valor !== 'number' || isNaN(valor)) {
    return 'R$ 0,00'
  }
  
  const valorLimpo = Math.abs(valor)
  
  if (valorLimpo >= 1000000000) {
    // Bilhões
    return `R$ ${(valorLimpo / 1000000000).toFixed(1)}B`
  } else if (valorLimpo >= 1000000) {
    // Milhões
    return `R$ ${(valorLimpo / 1000000).toFixed(1)}M`
  } else if (valorLimpo >= 1000) {
    // Milhares
    return `R$ ${(valorLimpo / 1000).toFixed(0)}k`
  }
  
  return formatarMoedaBR(valorLimpo)
}

// 💰 FORMATAÇÃO CONDICIONAL PARA ORÇAMENTO APROVADO - VERSÃO MELHORADA
export const formatarOrcamentoAprovado = (
  valor: number | null | undefined, 
  correlacaoEncontrada: boolean,
  opcoes?: {
    mostrarZero?: boolean
    textoFallback?: string
    formatoResumo?: boolean
  }
): string => {
  const {
    mostrarZero = false,
    textoFallback = 'Não encontrado',
    formatoResumo = false
  } = opcoes || {}
  
  // Se não há correlação ou valor inválido
  if (!correlacaoEncontrada || !valor || valor <= 0) {
    if (mostrarZero && valor === 0) {
      return formatoResumo ? 'R$ 0' : 'R$ 0,00'
    }
    return textoFallback
  }
  
  // Usar formato apropriado
  return formatoResumo ? formatarMoedaResumo(valor) : formatarMoedaBR(valor)
}

// 💰 FORMATAÇÃO INTELIGENTE - ESCOLHE O MELHOR FORMATO AUTOMATICAMENTE
export const formatarMoedaInteligente = (
  valor: number | null | undefined,
  contexto: 'card' | 'modal' | 'metrica' | 'tabela' = 'card'
): string => {
  if (valor === null || valor === undefined || typeof valor !== 'number' || isNaN(valor)) {
    return contexto === 'metrica' ? 'R$ 0' : 'R$ 0,00'
  }
  
  const valorLimpo = Math.abs(valor)
  
  switch (contexto) {
    case 'metrica':
      // Para cards de métricas, sempre formato resumido
      return formatarMoedaResumo(valorLimpo)
    
    case 'modal':
      // Para modais, formato completo para valores pequenos, resumido para grandes
      return valorLimpo >= 100000 ? formatarMoedaResumo(valorLimpo) : formatarMoedaBR(valorLimpo)
    
    case 'tabela':
      // Para tabelas, formato resumido para economizar espaço
      return formatarMoedaResumo(valorLimpo)
    
    case 'card':
    default:
      // Para cards, formato resumido se valor > 10k, senão completo
      return valorLimpo >= 10000 ? formatarMoedaResumo(valorLimpo) : formatarMoedaBR(valorLimpo)
  }
}

// 💰 FORMATAÇÃO PARA COMPARAÇÕES (mostra diferenças)
export const formatarDiferencaMonetaria = (
  valorAtual: number,
  valorAnterior: number,
  mostrarSinal: boolean = true
): string => {
  const diferenca = valorAtual - valorAnterior
  const simbolo = diferenca > 0 ? '+' : ''
  const prefixo = mostrarSinal ? simbolo : ''
  
  return `${prefixo}${formatarMoedaResumo(diferenca)}`
}

// 💰 VALIDADOR DE VALORES MONETÁRIOS
export const validarValorMonetario = (valor: any): number => {
  if (typeof valor === 'number' && !isNaN(valor)) {
    return Math.max(0, valor) // Garantir que seja positivo
  }
  
  if (typeof valor === 'string') {
    // Tentar converter string para número
    const valorLimpo = valor
      .replace(/[R$\s]/g, '')
      .replace(/\./g, '')
      .replace(',', '.')
    
    const numero = parseFloat(valorLimpo)
    return isNaN(numero) ? 0 : Math.max(0, numero)
  }
  
  return 0
}

// 💰 ESTATÍSTICAS DE VALORES (para debug)
export const analisarValoresMonetarios = (valores: number[]): {
  total: string
  media: string
  menor: string
  maior: string
  count: number
} => {
  const valoresValidos = valores.filter(v => typeof v === 'number' && !isNaN(v) && v > 0)
  
  if (valoresValidos.length === 0) {
    return {
      total: 'R$ 0,00',
      media: 'R$ 0,00',
      menor: 'R$ 0,00',
      maior: 'R$ 0,00',
      count: 0
    }
  }
  
  const total = valoresValidos.reduce((acc, v) => acc + v, 0)
  const media = total / valoresValidos.length
  const menor = Math.min(...valoresValidos)
  const maior = Math.max(...valoresValidos)
  
  return {
    total: formatarMoedaResumo(total),
    media: formatarMoedaResumo(media),
    menor: formatarMoedaResumo(menor),
    maior: formatarMoedaResumo(maior),
    count: valoresValidos.length
  }
}