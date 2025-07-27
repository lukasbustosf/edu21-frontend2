const fs = require('fs');
const path = require('path');

// Mapeo de imports incorrectos que necesitan ser corregidos
const importMappings = {
  '@/components/ui/Button': '@/components/ui/button',
  '@/components/ui/Input': '@/components/ui/input',
  '@/components/ui/Textarea': '@/components/ui/textarea',
  '@/components/ui/Select': '@/components/ui/select',
  '@/components/ui/LoadingSpinner': '@/components/ui/loading-spinner',
  '@/components/ui/NotificationBell': '@/components/ui/notification-bell',
  '@/components/ui/TTSControls': '@/components/ui/tts-controls',
  '@/components/ui/OASelector': '@/components/ui/oa-selector',
  '@/components/ui/StatsGrid': '@/components/ui/stats-grid',
  '@/components/ui/ResponsiveTable': '@/components/ui/responsive-table',
  '@/components/ui/ResponsiveModal': '@/components/ui/responsive-modal',
  '@/components/ui/ConfirmationModal': '@/components/ui/confirmation-modal',
  '../ui/Button': '../ui/button',
  '../ui/Input': '../ui/input',
  '../ui/Textarea': '../ui/textarea',
  '../ui/Select': '../ui/select',
  '../ui/LoadingSpinner': '../ui/loading-spinner',
  '../ui/NotificationBell': '../ui/notification-bell',
  '../ui/TTSControls': '../ui/tts-controls',
  '../ui/OASelector': '../ui/oa-selector',
  '../ui/StatsGrid': '../ui/stats-grid',
  '../ui/ResponsiveTable': '../ui/responsive-table',
  '../ui/ResponsiveModal': '../ui/responsive-modal',
  '../ui/ConfirmationModal': '../ui/confirmation-modal',
  '../../../components/ui/Button': '../../../components/ui/button',
  '../../../components/ui/Input': '../../../components/ui/input',
  '../../../components/ui/Textarea': '../../../components/ui/textarea',
  '../../../components/ui/Select': '../../../components/ui/select',
  '../../../components/ui/LoadingSpinner': '../../../components/ui/loading-spinner',
  '../../../components/ui/NotificationBell': '../../../components/ui/notification-bell',
  '../../../components/ui/TTSControls': '../../../components/ui/tts-controls',
  '../../../components/ui/OASelector': '../../../components/ui/oa-selector',
  '../../../components/ui/StatsGrid': '../../../components/ui/stats-grid',
  '../../../components/ui/ResponsiveTable': '../../../components/ui/responsive-table',
  '../../../components/ui/ResponsiveModal': '../../../components/ui/responsive-modal',
  '../../../components/ui/ConfirmationModal': '../../../components/ui/confirmation-modal'
};

// Función para procesar un archivo
function checkFileForErrors(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const errors = [];
    
    // Buscar imports incorrectos
    for (const [incorrect, correct] of Object.entries(importMappings)) {
      if (content.includes(incorrect)) {
        errors.push({
          type: 'import',
          incorrect,
          correct,
          line: findLineNumber(content, incorrect)
        });
      }
    }
    
    // Buscar imports que no existen
    const importRegex = /import.*from\s+['"]([^'"]+)['"]/g;
    let match;
    while ((match = importRegex.exec(content)) !== null) {
      const importPath = match[1];
      if (importPath.startsWith('@/components/ui/') || importPath.startsWith('../ui/') || importPath.startsWith('../../../components/ui/')) {
        const expectedFile = importPath.replace('@/', 'src/').replace('../ui/', 'src/components/ui/').replace('../../../components/ui/', 'src/components/ui/');
        const fullPath = path.resolve(path.dirname(filePath), expectedFile + '.tsx');
        if (!fs.existsSync(fullPath)) {
          errors.push({
            type: 'missing_file',
            importPath,
            expectedFile: expectedFile + '.tsx',
            line: findLineNumber(content, importPath)
          });
        }
      }
    }
    
    return errors;
  } catch (error) {
    return [{
      type: 'error',
      message: error.message
    }];
  }
}

// Función para encontrar el número de línea
function findLineNumber(content, searchText) {
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(searchText)) {
      return i + 1;
    }
  }
  return 'unknown';
}

// Función para procesar directorio recursivamente
function processDirectory(dirPath) {
  const items = fs.readdirSync(dirPath);
  let allErrors = [];
  
  for (const item of items) {
    const fullPath = path.join(dirPath, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
      allErrors = allErrors.concat(processDirectory(fullPath));
    } else if (stat.isFile() && item.endsWith('.tsx')) {
      const errors = checkFileForErrors(fullPath);
      if (errors.length > 0) {
        allErrors.push({
          file: fullPath,
          errors
        });
      }
    }
  }
  
  return allErrors;
}

// Ejecutar el script
console.log('🔍 Buscando errores de imports...\n');
const srcPath = path.join(__dirname, 'src');
const allErrors = processDirectory(srcPath);

if (allErrors.length === 0) {
  console.log('✅ ¡No se encontraron errores de imports!');
} else {
  console.log(`❌ Se encontraron errores en ${allErrors.length} archivos:\n`);
  
  allErrors.forEach((fileError, index) => {
    console.log(`${index + 1}. 📁 ${fileError.file}`);
    fileError.errors.forEach(error => {
      if (error.type === 'import') {
        console.log(`   ❌ Línea ${error.line}: "${error.incorrect}" → "${error.correct}"`);
      } else if (error.type === 'missing_file') {
        console.log(`   ❌ Línea ${error.line}: Archivo no encontrado "${error.expectedFile}"`);
      } else {
        console.log(`   ❌ Error: ${error.message}`);
      }
    });
    console.log('');
  });
  
  console.log('💡 Para corregir automáticamente, ejecuta: node fix-all-imports.js');
} 