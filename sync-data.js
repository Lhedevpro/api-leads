const fs = require('fs-extra');
const path = require('path');

const syncProspectsData = async () => {
  try {
    const sourcePath = path.join(__dirname, '../src/data/prospects_vendables.json');
    const targetPath = path.join(__dirname, './data/prospects_vendables.json');
    
    if (await fs.pathExists(sourcePath)) {
      await fs.copy(sourcePath, targetPath);
      console.log('✅ Prospects data synchronized successfully');
      
      // Lire et afficher les stats
      const data = await fs.readJson(targetPath);
      console.log(`📊 ${data.prospects?.length || 0} prospects available in sales API`);
    } else {
      console.log('⚠️ Source prospects file not found');
    }
  } catch (error) {
    console.error('❌ Error syncing prospects data:', error);
  }
};

// Exécuter la synchronisation
syncProspectsData(); 