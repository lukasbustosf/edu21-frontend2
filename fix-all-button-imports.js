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

// Función para corregir importaciones de Button
function fixButtonImports(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Patrones de importación incorrectos
    const patterns = [
      {
        from: "from '../ui/Button'",
        to: "from '../ui/button'"
      },
      {
        from: "from '../ui/Button';",
        to: "from '../ui/button';"
      },
      {
        from: "from '@/components/ui/Button'",
        to: "from '@/components/ui/button'"
      },
      {
        from: "from '@/components/ui/Button';",
        to: "from '@/components/ui/button';"
      },
      {
        from: "from './Button'",
        to: "from './button'"
      },
      {
        from: "from './Button';",
        to: "from './button';"
      }
    ];
    
    // Aplicar todas las correcciones
    patterns.forEach(pattern => {
      if (content.includes(pattern.from)) {
        content = content.replace(new RegExp(pattern.from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), pattern.to);
        modified = true;
        console.log(`✅ Corregido en ${filePath}: ${pattern.from} → ${pattern.to}`);
      }
    });
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
    }
  } catch (error) {
    console.error(`❌ Error procesando ${filePath}:`, error.message);
  }
}

// Procesar el directorio src
const srcDir = path.join(__dirname, 'src');
console.log('🔍 Buscando archivos con importaciones incorrectas de Button...');
processDirectory(srcDir);
console.log('✅ Proceso completado!'); 