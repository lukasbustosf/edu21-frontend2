const fs = require('fs');
const path = require('path');

// Lista de páginas problemáticas identificadas por el diagnóstico
const PROBLEMATIC_PAGES = [
  'src/app/admin/lab/activities/edit/[id]/page.tsx',
  'src/app/admin/lab/activities/new/page.tsx',
  'src/app/admin/lab/activities/page.tsx',
  'src/app/admin/lab-management/materials/edit/[id]/page.tsx',
  'src/app/admin/lab-management/page.tsx',
  'src/app/admin/onboarding/page.tsx',
  'src/app/admin/schools/page.tsx',
  'src/app/admin/usage-reports/page.tsx',
  'src/app/bienestar/interventions/page.tsx',
  'src/app/bienestar/pai-cases/page.tsx',
  'src/app/guardian/academic-history/page.tsx',
  'src/app/guardian/attendance/page.tsx',
  'src/app/guardian/bienestar-contact/page.tsx',
  'src/app/guardian/digital-records/page.tsx',
  'src/app/guardian/emergency-contact/page.tsx',
  'src/app/guardian/grades/page.tsx',
  'src/app/guardian/notifications/page.tsx',
  'src/app/guardian/pai-documents/page.tsx',
  'src/app/guardian/support-cases/page.tsx',
  'src/app/school/dashboard/page.tsx',
  'src/app/sostenedor/academic-performance/page.tsx',
  'src/app/sostenedor/bloom-analytics/page.tsx',
  'src/app/student/dashboard/page.tsx',
  'src/app/teacher/analytics/page.tsx',
  'src/app/teacher/labs/activities/create/page.tsx',
  'src/app/teacher/labs/activities/page.tsx',
  'src/app/teacher/labs/activity/[slug]/page.tsx',
  'src/app/teacher/labs/page.tsx'
];

// Componente temporal para páginas deshabilitadas
const TEMPORARY_COMPONENT = `// TEMPORARILY DISABLED - WILL BE ENABLED IN FUTURE VERSION
export default function UnderDevelopmentPage() {
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

function disablePage(filePath) {
  try {
    // Verificar si el archivo existe
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  Archivo no encontrado: ${filePath}`);
      return false;
    }

    // Leer el contenido actual
    const currentContent = fs.readFileSync(filePath, 'utf8');
    
    // Verificar si ya está deshabilitado
    if (currentContent.includes('TEMPORARILY DISABLED')) {
      console.log(`✅ Ya deshabilitado: ${filePath}`);
      return false;
    }

    // Crear backup del archivo original
    const backupPath = filePath + '.backup';
    fs.writeFileSync(backupPath, currentContent, 'utf8');
    console.log(`💾 Backup creado: ${backupPath}`);

    // Reemplazar con componente temporal
    fs.writeFileSync(filePath, TEMPORARY_COMPONENT, 'utf8');
    console.log(`✅ Deshabilitado: ${filePath}`);
    return true;
  } catch (error) {
    console.error(`❌ Error deshabilitando ${filePath}:`, error.message);
    return false;
  }
}

function main() {
  console.log('🚧 Deshabilitando páginas problemáticas...\n');
  
  let disabledCount = 0;
  let totalCount = PROBLEMATIC_PAGES.length;
  
  PROBLEMATIC_PAGES.forEach(pagePath => {
    const fullPath = path.join(__dirname, pagePath);
    if (disablePage(fullPath)) {
      disabledCount++;
    }
  });
  
  console.log(`\n📊 Resumen:`);
  console.log(`   • Páginas procesadas: ${totalCount}`);
  console.log(`   • Páginas deshabilitadas: ${disabledCount}`);
  console.log(`   • Páginas ya deshabilitadas: ${totalCount - disabledCount}`);
  
  if (disabledCount > 0) {
    console.log(`\n💡 Los archivos originales se guardaron como .backup`);
    console.log(`🔄 Para restaurar: renombrar .backup a .tsx`);
  }
  
  console.log('\n✅ ¡Proceso completado!');
}

main(); 