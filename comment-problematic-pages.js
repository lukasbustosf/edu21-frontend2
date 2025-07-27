const fs = require('fs');
const path = require('path');

// Páginas problemáticas que necesitan ser comentadas
const problematicPages = [
  'src/app/admin/access-policies/page.tsx',
  'src/app/admin/ai-budgets/page.tsx',
  'src/app/admin/ai-config/page.tsx',
  'src/app/admin/ai-costs/page.tsx',
  'src/app/admin/ai-monitoring/page.tsx'
];

function commentFile(filePath) {
  try {
    const fullPath = path.join(__dirname, filePath);
    
    if (!fs.existsSync(fullPath)) {
      console.log(`❌ Archivo no encontrado: ${filePath}`);
      return;
    }

    const content = fs.readFileSync(fullPath, 'utf8');
    
    // Comentar todo el contenido
    const commentedContent = `// TEMPORARILY DISABLED - WILL BE ENABLED IN FUTURE VERSION
// ${filePath}
/*
${content}
*/
`;

    // Crear backup
    const backupPath = fullPath + '.backup';
    fs.writeFileSync(backupPath, content);
    console.log(`✅ Backup creado: ${backupPath}`);

    // Escribir contenido comentado
    fs.writeFileSync(fullPath, commentedContent);
    console.log(`✅ Comentado: ${filePath}`);

  } catch (error) {
    console.error(`❌ Error procesando ${filePath}:`, error.message);
  }
}

console.log('🚀 Comentando páginas problemáticas...\n');

problematicPages.forEach(page => {
  commentFile(page);
});

console.log('\n✅ ¡Proceso completado!');
console.log('📝 Las páginas han sido comentadas y se pueden restaurar desde los archivos .backup'); 