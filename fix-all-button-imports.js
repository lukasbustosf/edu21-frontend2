const fs = require('fs');
const path = require('path');

// Función para procesar archivos recursivamente
function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      processDirectory(filePath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      fixButtonImports(filePath);
    }
  });
}

// Función para arreglar imports de Button
function fixButtonImports(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Arreglar imports relativos con mayúscula
    const relativeImportRegex = /import\s+\{\s*Button\s*\}\s+from\s+['"]\.\.\/ui\/Button['"]/g;
    if (relativeImportRegex.test(content)) {
      content = content.replace(relativeImportRegex, "import { Button } from '../ui/button'");
      modified = true;
    }
    
    // Arreglar imports relativos con mayúscula (un solo nivel)
    const singleRelativeImportRegex = /import\s+\{\s*Button\s*\}\s+from\s+['"]\.\/ui\/Button['"]/g;
    if (singleRelativeImportRegex.test(content)) {
      content = content.replace(singleRelativeImportRegex, "import { Button } from './ui/button'");
      modified = true;
    }
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Arreglado: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error procesando ${filePath}:`, error.message);
  }
}

// Procesar el directorio src
const srcDir = path.join(__dirname, 'src');
console.log('🔧 Arreglando imports de Button...');
processDirectory(srcDir);
console.log('✅ ¡Proceso completado!'); 