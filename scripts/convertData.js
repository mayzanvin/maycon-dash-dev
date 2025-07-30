import XLSX from 'xlsx';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const convertExcelToJson = () => {
  try {
    console.log('🔄 Iniciando conversão do arquivo Excel...');
    
    const filePath = join(__dirname, '../data/BaseObras.xlsx');
    
    if (!existsSync(filePath)) {
      console.error('❌ Arquivo BaseObras.xlsx não encontrado!');
      return;
    }

    const workbook = XLSX.readFile(filePath);
    console.log(`📋 Planilhas encontradas: ${workbook.SheetNames.length}`);
    console.log(`📄 Nomes das planilhas: ${workbook.SheetNames.join(', ')}\n`);
    
    const allData = {};
    let allColumns = new Set();
    
    // Processar cada planilha
    workbook.SheetNames.forEach((sheetName, index) => {
      console.log(`🔍 Processando planilha ${index + 1}/${workbook.SheetNames.length}: "${sheetName}"`);
      
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      
      allData[sheetName] = jsonData;
      
      console.log(`  📊 Registros encontrados: ${jsonData.length}`);
      
      if (jsonData.length > 0) {
        const columns = Object.keys(jsonData[0]);
        console.log(`  📝 Colunas (${columns.length}): ${columns.join(', ')}`);
        
        // Adicionar colunas ao conjunto geral
        columns.forEach(col => allColumns.add(col));
        
        // Mostrar primeiro registro como exemplo
        console.log(`  📋 Exemplo de dados:`, JSON.stringify(jsonData[0], null, 2));
        
        // Procurar por coluna Marco ou similar
        console.log(`  🔍 Procurando coluna Marco em todas as variações possíveis:`);
        let marcoFound = false;
        
        for (let i = 0; i < Math.min(20, jsonData.length); i++) {
          const record = jsonData[i];
          const keys = Object.keys(record);
          
          // Procurar por qualquer chave que contenha "marco"
          const marcoKeys = keys.filter(key => 
            key.toLowerCase().includes('marco') || 
            key.toLowerCase().includes('milestone') ||
            key.toLowerCase().includes('mark')
          );
          
          if (marcoKeys.length > 0) {
            console.log(`    🎯 Registro ${i+1} - Colunas relacionadas a Marco:`, marcoKeys);
            marcoKeys.forEach(key => {
              console.log(`      ${key}: ${record[key]}`);
            });
            marcoFound = true;
          }
        }
        
        if (!marcoFound) {
          console.log(`    ❌ Nenhuma coluna 'Marco' encontrada nos primeiros 20 registros`);
          console.log(`    📝 Todas as colunas disponíveis:`, columns);
        }
      } else {
        console.log(`  ⚠️  Planilha vazia`);
      }
      console.log('');
    });
    
    console.log(`\n✅ Todas as planilhas processadas!`);
    console.log(`📊 Total de colunas únicas encontradas: ${allColumns.size}`);
    console.log(`📋 Colunas: ${Array.from(allColumns).join(', ')}`);
    
    // Processar e unificar obras
    const unifiedProjects = processUnifiedProjects(allData);
    
    // Salvar dados originais
    const outputPath = join(__dirname, '../src/data/obras.json');
    mkdirSync(dirname(outputPath), { recursive: true });
    writeFileSync(outputPath, JSON.stringify(allData, null, 2));
    
    // Salvar dados unificados
    const unifiedOutputPath = join(__dirname, '../src/data/obras-unificadas.json');
    writeFileSync(unifiedOutputPath, JSON.stringify(unifiedProjects, null, 2));
    
    console.log(`\n💾 Arquivo JSON original salvo em: ${outputPath}`);
    console.log(`🔗 Arquivo JSON unificado salvo em: ${unifiedOutputPath}`);
    
    // Gerar tipos baseado em todas as colunas encontradas
    generateTypesFromAllData(allData, allColumns);
    
  } catch (error) {
    console.error('❌ Erro ao converter arquivo:', error);
  }
};

const generateTypesFromAllData = (allData, allColumns) => {
  console.log('\n🔧 Gerando tipos TypeScript baseado em todas as planilhas...');
  
  const types = [];
  const allColumnsArray = Array.from(allColumns);
  
  // Analisar tipos de dados em todas as planilhas
  const columnTypes = {};
  
  Object.values(allData).forEach(sheetData => {
    sheetData.forEach(record => {
      Object.entries(record).forEach(([key, value]) => {
        if (!columnTypes[key]) {
          columnTypes[key] = new Set();
        }
        
        if (value === null || value === undefined || value === '') {
          columnTypes[key].add('null');
        } else if (typeof value === 'number') {
          columnTypes[key].add('number');
        } else if (typeof value === 'boolean') {
          columnTypes[key].add('boolean');
        } else if (value instanceof Date) {
          columnTypes[key].add('Date');
        } else {
          columnTypes[key].add('string');
        }
      });
    });
  });
  
  // Gerar tipos para cada coluna
  allColumnsArray.forEach(key => {
    const cleanKey = key.replace(/[^a-zA-Z0-9]/g, '_');
    const possibleTypes = columnTypes[key] || new Set(['string']);
    
    // Remover null se houver outros tipos
    if (possibleTypes.size > 1) {
      possibleTypes.delete('null');
    }
    
    const finalType = Array.from(possibleTypes).join(' | ') || 'string';
    const optional = columnTypes[key]?.has('null') ? '?' : '';
    
    types.push(`  ${cleanKey}${optional}: ${finalType};`);
  });
  
  // Gerar interfaces para cada planilha
  const sheetInterfaces = Object.keys(allData).map(sheetName => {
    const cleanSheetName = sheetName.replace(/[^a-zA-Z0-9]/g, '');
    return `export interface ${cleanSheetName}Data extends BaseObraData {}`;
  }).join('\n\n');
  
  const typeDefinition = `// Tipos gerados automaticamente baseado nas planilhas do Excel

export interface BaseObraData {
${types.join('\n')}
}

${sheetInterfaces}

export interface ObraMetrics {
  totalObras: number;
  obrasConcluidas: number;
  obrasEmAndamento: number;
  obrasPendentes: number;
  valorTotal: number;
  valorGasto: number;
}

export interface ExcelData {
  [sheetName: string]: BaseObraData[];
}

export interface DashboardData {
  sheets: ExcelData;
  metrics: ObraMetrics;
  sheetNames: string[];
}

// Nomes das planilhas encontradas
export const SHEET_NAMES = ${JSON.stringify(Object.keys(allData), null, 2)} as const;

export type SheetName = typeof SHEET_NAMES[number];`;
  
  const typesPath = join(__dirname, '../src/types/obra.ts');
  mkdirSync(dirname(typesPath), { recursive: true });
  writeFileSync(typesPath, typeDefinition);
  
  console.log(`✅ Tipos gerados em: ${typesPath}`);
  console.log(`📋 Interfaces criadas para ${Object.keys(allData).length} planilhas`);
};

const processUnifiedProjects = (allData) => {
  console.log('\n🔧 Processando unificação de obras...');
  
  const projects = {};
  
  // Processar cada planilha
  Object.entries(allData).forEach(([sheetName, sheetData]) => {
    if (sheetName === 'Planilha1' || sheetData.length === 0) return;
    
    // Extrair nome base do projeto (remover sufixos F/E)
    const projectCode = sheetName.replace(/\s*-\s*[FE]\s*$/, '');
    const type = sheetName.endsWith('- F') ? 'fiscalizacao' : 'execucao';
    
    console.log(`  📋 Processando: ${sheetName}`);
    console.log(`    🏗️  Projeto: ${projectCode}`);
    console.log(`    📝 Tipo: ${type}`);
    
    if (!projects[projectCode]) {
      projects[projectCode] = {
        nome: '',
        codigo: projectCode,
        fiscalizacao: {
          planilha: '',
          tarefas: [],
          totalTarefas: 0
        },
        execucao: {
          planilha: '',
          tarefas: [],
          totalTarefas: 0,
          marcosComSim: 0,
          marcosConcluidos: 0
        },
        metricas: {
          progressoGeral: 0,
          avancooFisico: 0,
          totalTarefas: 0,
          tarefasConcluidas: 0
        }
      };
    }
    
    // Adicionar dados à estrutura unificada
    if (type === 'fiscalizacao') {
      projects[projectCode].fiscalizacao.planilha = sheetName;
      projects[projectCode].fiscalizacao.tarefas = sheetData;
      projects[projectCode].fiscalizacao.totalTarefas = sheetData.length;
      
      // Nome da obra vem da fiscalização (F)
      if (sheetData.length > 0) {
        projects[projectCode].nome = sheetData[0]['Resumo (pai)'] || projectCode;
      }
    } else {
      projects[projectCode].execucao.planilha = sheetName;
      projects[projectCode].execucao.tarefas = sheetData;
      projects[projectCode].execucao.totalTarefas = sheetData.length;
      
      // Contar marcos físicos na execução
      let marcosComSim = 0;
      let marcosConcluidos = 0;
      
      sheetData.forEach(tarefa => {
        if (tarefa.Marco && tarefa.Marco.toString().toUpperCase() === 'SIM') {
          marcosComSim++;
          if ((tarefa['% Concluído'] || 0) === 100) {
            marcosConcluidos++;
          }
        }
      });
      
      projects[projectCode].execucao.marcosComSim = marcosComSim;
      projects[projectCode].execucao.marcosConcluidos = marcosConcluidos;
    }
  });
  
  // Calcular métricas finais
  Object.values(projects).forEach(project => {
    const totalTarefas = project.fiscalizacao.totalTarefas + project.execucao.totalTarefas;
    let tarefasConcluidas = 0;
    let somaProgresso = 0;
    
    // Contar tarefas concluídas de ambas as planilhas
    [...project.fiscalizacao.tarefas, ...project.execucao.tarefas].forEach(tarefa => {
      const progresso = tarefa['% Concluído'] || 0;
      somaProgresso += progresso;
      if (progresso === 100) {
        tarefasConcluidas++;
      }
    });
    
    project.metricas = {
      progressoGeral: totalTarefas > 0 ? Math.round(somaProgresso / totalTarefas) : 0,
      avancooFisico: project.execucao.marcosComSim > 0 
        ? Math.round((project.execucao.marcosConcluidos / project.execucao.marcosComSim) * 100) 
        : 0,
      totalTarefas,
      tarefasConcluidas,
      totalMarcos: project.execucao.marcosComSim,
      marcosConcluidos: project.execucao.marcosConcluidos
    };
    
    console.log(`  ✅ ${project.nome}`);
    console.log(`    📊 Progresso Geral: ${project.metricas.progressoGeral}%`);
    console.log(`    🏗️  Avanço Físico: ${project.metricas.avancooFisico}% (${project.metricas.marcosConcluidos}/${project.metricas.totalMarcos} marcos)`);
    console.log(`    📝 Tarefas: ${project.metricas.tarefasConcluidas}/${project.metricas.totalTarefas} concluídas`);
  });
  
  console.log(`\n🎯 Total de obras unificadas: ${Object.keys(projects).length}`);
  
  return projects;
};

convertExcelToJson();