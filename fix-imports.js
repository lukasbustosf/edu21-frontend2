const fs = require('fs');
const path = require('path');

// Mapeo de imports incorrectos a correctos
const importMappings = {
  '@/components/ui/Card': '@/components/ui/card',
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
  '@/components/ui/ConfirmationModal': '@/components/ui/confirmation-modal'
};

// Función para procesar un archivo
function fixImportsInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let hasChanges = false;
    
    // Aplicar cada mapeo
    for (const [incorrect, correct] of Object.entries(importMappings)) {
      if (content.includes(incorrect)) {
        content = content.replace(new RegExp(incorrect.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), correct);
        hasChanges = true;
        console.log(`✅ Fixed: ${incorrect} -> ${correct} in ${filePath}`);
      }
    }
    
    if (hasChanges) {
      fs.writeFileSync(filePath, content, 'utf8');
    }
    
    return hasChanges;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Función para procesar directorio recursivamente
function processDirectory(dirPath) {
  const items = fs.readdirSync(dirPath);
  let totalFixed = 0;
  
  for (const item of items) {
    const fullPath = path.join(dirPath, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
      totalFixed += processDirectory(fullPath);
    } else if (stat.isFile() && item.endsWith('.tsx')) {
      if (fixImportsInFile(fullPath)) {
        totalFixed++;
      }
    }
  }
  
  return totalFixed;
}

// Ejecutar el script
console.log('🔧 Fixing import paths...');
const srcPath = path.join(__dirname, 'src');
const fixedFiles = processDirectory(srcPath);
console.log(`\n✅ Fixed ${fixedFiles} files!`); 