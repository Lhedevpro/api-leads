const { ethers } = require('ethers');
const { LEADS_ABI, LEADS_CONTRACT_ADDRESS, NETWORK_CONFIG, DEFAULT_NETWORK } = require('./contract-config');

async function testBaseConfiguration() {
  console.log('🧪 Test de la configuration Base\n');
  
  try {
    // Test 1: Vérification de la configuration
    console.log('1️⃣ Vérification de la configuration...');
    console.log(`   Réseau par défaut: ${DEFAULT_NETWORK}`);
    console.log(`   Adresse du contrat: ${LEADS_CONTRACT_ADDRESS}`);
    console.log(`   Configuration Base:`, JSON.stringify(NETWORK_CONFIG.base, null, 2));
    
    // Test 2: Test de connexion au réseau Base
    console.log('\n2️⃣ Test de connexion au réseau Base...');
    const provider = new ethers.JsonRpcProvider(NETWORK_CONFIG.base.rpc);
    
    // Vérifier la connexion
    const blockNumber = await provider.getBlockNumber();
    console.log(`   Block actuel sur Base: ${blockNumber}`);
    
    // Test 3: Vérification du contrat
    console.log('\n3️⃣ Vérification du contrat...');
    const code = await provider.getCode(LEADS_CONTRACT_ADDRESS);
    if (code !== '0x') {
      console.log('   ✅ Contrat trouvé sur Base');
      
      // Créer une instance du contrat
      const contract = new ethers.Contract(LEADS_CONTRACT_ADDRESS, LEADS_ABI, provider);
      
      // Test 4: Récupération des prix
      console.log('\n4️⃣ Test de récupération des prix...');
      try {
        const [priceBase, priceMedium, priceHigh, priceLow] = await Promise.all([
          contract.price_base(),
          contract.price_medium(),
          contract.price_high(),
          contract.price_low()
        ]);
        
        console.log('   Prix récupérés:');
        console.log(`     Base: ${ethers.formatEther(priceBase)} ETH`);
        console.log(`     Medium: ${ethers.formatEther(priceMedium)} ETH`);
        console.log(`     High: ${ethers.formatEther(priceHigh)} ETH`);
        console.log(`     Low: ${ethers.formatEther(priceLow)} ETH`);
      } catch (error) {
        console.log(`   ❌ Erreur lors de la récupération des prix: ${error.message}`);
      }
      
      // Test 5: Test avec une adresse fictive
      console.log('\n5️⃣ Test avec une adresse fictive...');
      const testAddress = '0x1234567890123456789012345678901234567890';
      try {
        const leadsCount = await contract.getLeads(2, testAddress);
        console.log(`   Leads pour ${testAddress}: ${leadsCount.toString()}`);
      } catch (error) {
        console.log(`   ❌ Erreur lors de la récupération des leads: ${error.message}`);
      }
      
    } else {
      console.log('   ❌ Contrat non trouvé sur Base');
    }
    
    console.log('\n🎉 Tests de configuration Base terminés!');
    
  } catch (error) {
    console.error('💥 Erreur lors des tests:', error.message);
  }
}

// Exécuter les tests si le script est appelé directement
if (require.main === module) {
  testBaseConfiguration()
    .then(() => {
      console.log('\n✅ Tests de configuration Base terminés avec succès');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n❌ Tests de configuration Base échoués:', error.message);
      process.exit(1);
    });
}

module.exports = { testBaseConfiguration }; 