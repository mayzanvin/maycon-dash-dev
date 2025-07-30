import * as XLSX from 'xlsx';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface RawObraData {
  [key: string]: any;
}

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
    
    const allData: { [sheetName: string]: RawObraData[] } = {};
    let allColumns: Set<string> = new Set();
    
    // Processar cada planilha
    workbook.SheetNames.forEach((sheetName, index) => {
      console.log(`🔍 Processando planilha ${index + 1}/${workbook.SheetNames.length}: "${sheetName}"`);
      
      const worksheet = workbook.Sheets[sheetName];
      const jsonData: RawObraData[] = XLSX.utils.sheet_to_json(worksheet);
      
      allData[sheetName] = jsonData;
      
      console.log(`  📊 Registros encontrados: ${jsonData.length}`);
      
      if (jsonData.length > 0) {
        const columns = Object.keys(jsonData[0]);
        console.log(`  📝 Colunas (${columns.length}): ${columns.join(', ')}`);
        
        // Adicionar colunas ao conjunto geral
        columns.forEach(col => allColumns.add(col));
        
        // Mostrar primeiro registro como exemplo
        console.log(`  📋 Exemplo de dados:`, JSON.stringify(jsonData[0], null, 2));
      } else {
        console.log(`  ⚠️  Planilha vazia`);
      }
      console.log('');
    });
    
    console.log(`\n✅ Todas as planilhas processadas!`);
    console.log(`📊 Total de colunas únicas encontradas: ${allColumns.size}`);
    console.log(`📋 Colunas: ${Array.from(allColumns).join(', ')}`);
    
    // Salvar dados de todas as planilhas
    const outputPath = join(__dirname, '../src/data/obras.json');
    mkdirSync(dirname(outputPath), { recursive: true });
    writeFileSync(outputPath, JSON.stringify(allData, null, 2));
    
    console.log(`\n💾 Arquivo JSON salvo em: ${outputPath}`);
    
    // Gerar tipos baseado em todas as colunas encontradas
    generateTypesFromAllData(allData, allColumns);
    
  } catch (error) {
    console.error('❌ Erro ao converter arquivo:', error);
  }
};

const generateTypesFromAllData = (allData: { [sheetName: string]: RawObraData[] }, allColumns: Set<string>) => {
  console.log('\n🔧 Gerando tipos TypeScript baseado em todas as planilhas...');
  
  const types: string[] = [];
  const allColumnsArray = Array.from(allColumns);
  
  // Analisar tipos de dados em todas as planilhas
  const columnTypes: { [key: string]: Set<string> } = {};
  
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

convertExcelToJson();