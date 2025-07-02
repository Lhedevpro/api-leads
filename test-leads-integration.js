const leadsService = require('./leads-service');

async function testLeadsIntegration() {
  console.log('🧪 Test de l\'intégration avec le contrat Leads\n');
  
  try {
    // Test 1: Initialisation du service
    console.log('1️⃣ Test d\'initialisation du service...');
    const initResult = await leadsService.initialize();
    console.log(`   Résultat: ${initResult ? '✅ Succès' : '❌ Échec'}`);
    
    // Test 2: Statut du service
    console.log('\n2️⃣ Test du statut du service...');
    const status = leadsService.getStatus();
    console.log('   Statut:', JSON.stringify(status, null, 2));
    
    // Test 3: Récupération des prix
    console.log('\n3️⃣ Test de récupération des prix...');
    const prices = await leadsService.getPrices();
    if (prices) {
      console.log('   Prix récupérés:', JSON.stringify(prices, null, 2));
    } else {
      console.log('   ❌ Impossible de récupérer les prix');
    }
    
    // Test 4: Test avec une adresse fictive
    console.log('\n4️⃣ Test avec une adresse fictive...');
    const testAddress = '0x1234567890123456789012345678901234567890';
    const leadsCount = await leadsService.getLeadsForUser(testAddress, 1);
    console.log(`   Leads pour ${testAddress}: ${leadsCount}`);
    
    // Test 5: Test avec une adresse invalide
    console.log('\n5️⃣ Test avec une adresse invalide...');
    try {
      const invalidLeads = await leadsService.getLeadsForUser('invalid-address', 1);
      console.log(`   Résultat: ${invalidLeads} (devrait être 0)`);
    } catch (error) {
      console.log(`   ❌ Erreur attendue: ${error.message}`);
    }
    
    console.log('\n🎉 Tests terminés!');
    
  } catch (error) {
    console.error('💥 Erreur lors des tests:', error.message);
  }
}

// Exécuter les tests si le script est appelé directement
if (require.main === module) {
  testLeadsIntegration()
    .then(() => {
      console.log('\n✅ Tests terminés avec succès');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n❌ Tests échoués:', error.message);
      process.exit(1);
    });
}

module.exports = { testLeadsIntegration }; 