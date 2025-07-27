const fs = require('fs');
const path = require('path');

// Todas las páginas de admin que están causando problemas
const problematicPages = [
  'src/app/admin/access-policies/page.tsx',
  'src/app/admin/ai-budgets/page.tsx',
  'src/app/admin/ai-config/page.tsx',
  'src/app/admin/ai-costs/page.tsx',
  'src/app/admin/ai-monitoring/page.tsx',
  'src/app/admin/alerts/page.tsx',
  'src/app/admin/api-management/page.tsx',
  'src/app/admin/audit-logs/page.tsx',
  'src/app/admin/backups/page.tsx',
  'src/app/admin/benchmarking/page.tsx',
  'src/app/admin/bulk-exports/page.tsx',
  'src/app/admin/compliance/page.tsx',
  'src/app/admin/executive-dashboard/page.tsx',
  'src/app/admin/financial/page.tsx',
  'src/app/admin/licenses/page.tsx',
  'src/app/admin/maintenance/page.tsx',
  'src/app/admin/mfa-management/page.tsx',
  'src/app/admin/mfa-policies/page.tsx',
  'src/app/admin/oa-reports/page.tsx',
  'src/app/admin/onboarding/page.tsx',
  'src/app/admin/p1-compliance/page.tsx',
  'src/app/admin/performance/page.tsx',
  'src/app/admin/reports/page.tsx',
  'src/app/admin/schools/page.tsx',
  'src/app/admin/security/page.tsx',
  'src/app/admin/settings/page.tsx',
  'src/app/admin/support/page.tsx',
  'src/app/admin/system-health/page.tsx',
  'src/app/admin/usage-reports/page.tsx',
  'src/app/admin/users/page.tsx'
];

function disablePage(filePath) {
  try {
    const fullPath = path.join(__dirname, filePath);
    
    if (!fs.existsSync(fullPath)) {
      console.log(`❌ Archivo no encontrado: ${filePath}`);
      return;
    }

    // Crear backup
    const backupPath = fullPath + '.backup';
    const originalContent = fs.readFileSync(fullPath, 'utf8');
    fs.writeFileSync(backupPath, originalContent);
    console.log(`✅ Backup creado: ${backupPath}`);

    // Crear contenido temporal
    const tempContent = `// TEMPORARILY DISABLED - WILL BE ENABLED IN FUTURE VERSION
// ${filePath}
export default function ${getComponentName(filePath)}() {
  return (
    <div className="p-8 text-center">
      <h1 className="text-2xl font-bold text-gray-600 mb-4">
        🚧 Página en Desarrollo
      </h1>
      <p className="text-gray-500">
        Esta funcionalidad estará disponible en una versión futura.
      </p>
    </div>
  )
}
`;

    // Escribir contenido temporal
    fs.writeFileSync(fullPath, tempContent);
    console.log(`✅ Deshabilitado: ${filePath}`);

  } catch (error) {
    console.error(`❌ Error procesando ${filePath}:`, error.message);
  }
}

function getComponentName(filePath) {
  const parts = filePath.split('/');
  const pageName = parts[parts.length - 2]; // Obtener el nombre del directorio
  return pageName.charAt(0).toUpperCase() + pageName.slice(1) + 'Page';
}

console.log('🚀 Deshabilitando todas las páginas de admin problemáticas...\n');

problematicPages.forEach(page => {
  disablePage(page);
});

console.log('\n✅ ¡Proceso completado!');
console.log('📝 Todas las páginas de admin han sido deshabilitadas temporalmente');
console.log('🔄 Se pueden restaurar desde los archivos .backup cuando sea necesario'); 