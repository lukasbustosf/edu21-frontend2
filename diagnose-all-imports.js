const fs = require('fs');
const path = require('path');

// Componentes UI que sabemos que existen
const UI_COMPONENTS = [
  'button', 'input', 'select', 'card', 'modal', 'form', 'label', 
  'textarea', 'checkbox', 'radio', 'switch', 'tabs', 'accordion',
  'dropdown', 'tooltip', 'badge', 'avatar', 'progress', 'spinner'
];

// Función para procesar archivos recursivamente
function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  const results = {
    totalFiles: 0,
    filesWithIssues: 0,
    issues: []
  };
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      const subResults = processDirectory(filePath);
      results.totalFiles += subResults.totalFiles;
      results.filesWithIssues += subResults.filesWithIssues;
      results.issues.push(...subResults.issues);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.totalFiles++;
      const fileIssues = analyzeFile(filePath);
      if (fileIssues.length > 0) {
        results.filesWithIssues++;
        results.issues.push(...fileIssues);
      }
    }
  });
  
  return results;
}

// Función para analizar un archivo específico
function analyzeFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const issues = [];
    
    // Buscar imports problemáticos
    const importRegex = /import\s+\{[^}]*\}\s+from\s+['"]([^'"]+)['"]/g;
    let match;
    
    while ((match = importRegex.exec(content)) !== null) {
      const importPath = match[1];
      
      // Verificar imports de @/components/ui/
      if (importPath.startsWith('@/components/ui/')) {
        const componentName = importPath.split('/').pop();
        if (!UI_COMPONENTS.includes(componentName.toLowerCase())) {
          issues.push({
            type: 'unknown_component',
            importPath,
            componentName,
            line: getLineNumber(content, match.index)
          });
        }
      }
      
      // Verificar imports relativos con mayúsculas
      if (importPath.includes('../ui/') || importPath.includes('./ui/')) {
        const componentName = importPath.split('/').pop();
        if (componentName && componentName !== componentName.toLowerCase()) {
          issues.push({
            type: 'case_sensitivity',
            importPath,
            componentName,
            line: getLineNumber(content, match.index)
          });
        }
      }
    }
    
    return issues.map(issue => ({
      ...issue,
      file: filePath
    }));
  } catch (error) {
    return [{
      type: 'file_error',
      file: filePath,
      error: error.message
    }];
  }
}

// Función para obtener el número de línea
function getLineNumber(content, index) {
  return content.substring(0, index).split('\n').length;
}

// Función para arreglar automáticamente los problemas
function fixIssues(issues) {
  console.log('\n🔧 Arreglando problemas automáticamente...\n');
  
  const filesToFix = new Map();
  
  // Agrupar problemas por archivo
  issues.forEach(issue => {
    if (!filesToFix.has(issue.file)) {
      filesToFix.set(issue.file, []);
    }
    filesToFix.get(issue.file).push(issue);
  });
  
  let fixedFiles = 0;
  
  filesToFix.forEach((fileIssues, filePath) => {
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      let modified = false;
      
      fileIssues.forEach(issue => {
        if (issue.type === 'case_sensitivity') {
          // Arreglar case sensitivity
          const oldImport = `from '${issue.importPath}'`;
          const newImport = `from '${issue.importPath.toLowerCase()}'`;
          
          if (content.includes(oldImport)) {
            content = content.replace(new RegExp(oldImport.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newImport);
            modified = true;
            console.log(`✅ Arreglado case sensitivity: ${issue.importPath} → ${issue.importPath.toLowerCase()}`);
          }
        }
      });
      
      if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        fixedFiles++;
        console.log(`📝 Archivo actualizado: ${filePath}`);
      }
    } catch (error) {
      console.error(`❌ Error arreglando ${filePath}:`, error.message);
    }
  });
  
  return fixedFiles;
}

// Función principal
function main() {
  console.log('🔍 Diagnóstico completo de imports...\n');
  
  const srcDir = path.join(__dirname, 'src');
  const results = processDirectory(srcDir);
  
  console.log(`📊 Resumen del diagnóstico:`);
  console.log(`   • Archivos totales: ${results.totalFiles}`);
  console.log(`   • Archivos con problemas: ${results.filesWithIssues}`);
  console.log(`   • Problemas encontrados: ${results.issues.length}\n`);
  
  if (results.issues.length === 0) {
    console.log('✅ ¡No se encontraron problemas!');
    return;
  }
  
  // Mostrar problemas por tipo
  const issuesByType = {};
  results.issues.forEach(issue => {
    if (!issuesByType[issue.type]) {
      issuesByType[issue.type] = [];
    }
    issuesByType[issue.type].push(issue);
  });
  
  console.log('📋 Problemas encontrados por tipo:');
  Object.entries(issuesByType).forEach(([type, issues]) => {
    console.log(`\n🔴 ${type.toUpperCase()} (${issues.length} problemas):`);
    issues.slice(0, 5).forEach(issue => {
      console.log(`   • ${issue.file}:${issue.line} - ${issue.importPath || issue.error}`);
    });
    if (issues.length > 5) {
      console.log(`   • ... y ${issues.length - 5} más`);
    }
  });
  
  // Preguntar si arreglar automáticamente
  console.log('\n🤔 ¿Quieres que arregle automáticamente los problemas de case sensitivity? (y/n)');
  
  // Simular respuesta automática (en producción sería interactivo)
  const shouldFix = true; // Cambiar a false si no quieres arreglar automáticamente
  
  if (shouldFix) {
    const caseSensitivityIssues = results.issues.filter(issue => issue.type === 'case_sensitivity');
    if (caseSensitivityIssues.length > 0) {
      const fixedFiles = fixIssues(caseSensitivityIssues);
      console.log(`\n✅ ¡Arreglados ${fixedFiles} archivos!`);
    }
  }
  
  console.log('\n📝 Archivos problemáticos restantes:');
  const remainingIssues = results.issues.filter(issue => issue.type !== 'case_sensitivity');
  remainingIssues.forEach(issue => {
    console.log(`   • ${issue.file}:${issue.line} - ${issue.importPath || issue.error}`);
  });
}

// Ejecutar el script
main(); 