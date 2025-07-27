const fs = require('fs');
const path = require('path');

// Lista de páginas admin problemáticas
const adminPagesToDisable = [
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
  'src/app/admin/dashboard/page.tsx',
  'src/app/admin/executive-dashboard/page.tsx',
  'src/app/admin/financial/page.tsx',
  'src/app/admin/licenses/page.tsx',
  'src/app/admin/maintenance/page.tsx',
  'src/app/admin/mfa-management/page.tsx',
  'src/app/admin/mfa-policies/page.tsx',
  'src/app/admin/oa-reports/page.tsx',
  'src/app/admin/lab-management/materials/new/page.tsx',
  'src/app/admin/lab-management/materials/edit/[id]/page.tsx',
  'src/app/admin/lab-management/page.tsx',
  'src/app/admin/lab/activities/edit/[id]/page.tsx',
  'src/app/admin/lab/activities/new/page.tsx',
  'src/app/admin/lab/activities/page.tsx',
  'src/app/admin/onboarding/page.tsx',
  'src/app/admin/schools/page.tsx',
  'src/app/admin/usage-reports/page.tsx'
];

// Componente temporal simple
const tempComponent = `// TEMPORARILY DISABLED - WILL BE ENABLED IN FUTURE VERSION
import React from 'react';

export default function UnderDevelopmentPage() {
  return (
    <div style={{ padding: '20px', textAlign: 'center', fontSize: '24px', color: '#555' }}>
      <h1>Página en Desarrollo 🚧</h1>
      <p>Esta funcionalidad estará disponible en una futura actualización.</p>
    </div>
  );
}`;

console.log('🔧 Deshabilitando páginas admin problemáticas...\n');

let disabledCount = 0;

adminPagesToDisable.forEach(pagePath => {
  const fullPath = path.join(__dirname, pagePath);
  
  try {
    // Verificar si el archivo existe
    if (fs.existsSync(fullPath)) {
      // Crear backup del archivo original
      const backupPath = fullPath + '.backup';
      if (!fs.existsSync(backupPath)) {
        fs.copyFileSync(fullPath, backupPath);
        console.log(`📦 Backup creado: ${pagePath}`);
      }
      
      // Reemplazar con componente temporal
      fs.writeFileSync(fullPath, tempComponent, 'utf8');
      console.log(`✅ Deshabilitada: ${pagePath}`);
      disabledCount++;
    } else {
      console.log(`⚠️ No encontrada: ${pagePath}`);
    }
  } catch (error) {
    console.error(`❌ Error procesando ${pagePath}:`, error.message);
  }
});

console.log(`\n🎉 ¡Completado! ${disabledCount} páginas deshabilitadas.`);
console.log('📝 Los archivos originales se guardaron como .backup');
console.log('\n🚀 Ahora puedes hacer commit y push para probar en Vercel!'); 