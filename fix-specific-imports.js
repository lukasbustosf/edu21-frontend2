const fs = require('fs');
const path = require('path');

// Buscar y corregir imports específicos con mayúsculas
function fixSpecificImports() {
  const srcPath = path.join(__dirname, 'src');
  let fixedFiles = 0;
  
  function processDirectory(dirPath) {
    const items = fs.readdirSync(dirPath);
    
    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        processDirectory(fullPath);
      } else if (stat.isFile() && item.endsWith('.tsx')) {
        let content = fs.readFileSync(fullPath, 'utf8');
        let hasChanges = false;
        
        // Corregir imports específicos con mayúsculas
        const replacements = [
          { from: "from '../ui/Button'", to: "from '../ui/button'" },
          { from: "from '../ui/Input'", to: "from '../ui/input'" },
          { from: "from '../ui/Textarea'", to: "from '../ui/textarea'" },
          { from: "from '../ui/Select'", to: "from '../ui/select'" },
          { from: "from '../ui/LoadingSpinner'", to: "from '../ui/loading-spinner'" },
          { from: "from '../ui/NotificationBell'", to: "from '../ui/notification-bell'" },
          { from: "from '../ui/TTSControls'", to: "from '../ui/tts-controls'" },
          { from: "from '../ui/OASelector'", to: "from '../ui/oa-selector'" },
          { from: "from '../ui/StatsGrid'", to: "from '../ui/stats-grid'" },
          { from: "from '../ui/ResponsiveTable'", to: "from '../ui/responsive-table'" },
          { from: "from '../ui/ResponsiveModal'", to: "from '../ui/responsive-modal'" },
          { from: "from '../ui/ConfirmationModal'", to: "from '../ui/confirmation-modal'" },
          { from: "from '../../../components/ui/Button'", to: "from '../../../components/ui/button'" },
          { from: "from '../../../components/ui/Input'", to: "from '../../../components/ui/input'" },
          { from: "from '../../../components/ui/Textarea'", to: "from '../../../components/ui/textarea'" },
          { from: "from '../../../components/ui/Select'", to: "from '../../../components/ui/select'" },
          { from: "from '../../../components/ui/LoadingSpinner'", to: "from '../../../components/ui/loading-spinner'" },
          { from: "from '../../../components/ui/NotificationBell'", to: "from '../../../components/ui/notification-bell'" },
          { from: "from '../../../components/ui/TTSControls'", to: "from '../../../components/ui/tts-controls'" },
          { from: "from '../../../components/ui/OASelector'", to: "from '../../../components/ui/oa-selector'" },
          { from: "from '../../../components/ui/StatsGrid'", to: "from '../../../components/ui/stats-grid'" },
          { from: "from '../../../components/ui/ResponsiveTable'", to: "from '../../../components/ui/responsive-table'" },
          { from: "from '../../../components/ui/ResponsiveModal'", to: "from '../../../components/ui/responsive-modal'" },
          { from: "from '../../../components/ui/ConfirmationModal'", to: "from '../../../components/ui/confirmation-modal'" }
        ];
        
        for (const replacement of replacements) {
          if (content.includes(replacement.from)) {
            content = content.replace(new RegExp(replacement.from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), replacement.to);
            hasChanges = true;
            console.log(`✅ Fixed in ${fullPath}: ${replacement.from} → ${replacement.to}`);
          }
        }
        
        if (hasChanges) {
          fs.writeFileSync(fullPath, content, 'utf8');
          fixedFiles++;
        }
      }
    }
  }
  
  processDirectory(srcPath);
  return fixedFiles;
}

console.log('🔧 Corrigiendo imports específicos con mayúsculas...\n');
const fixedFiles = fixSpecificImports();
console.log(`\n✅ ¡Se corrigieron ${fixedFiles} archivos!`);
console.log('💡 Ahora puedes ejecutar: npm run build'); 