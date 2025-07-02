const { ethers } = require('ethers');
const { LEADS_CONTRACT_ADDRESS, NETWORK_CONFIG } = require('./contract-config');

async function testGetLeads() {
  console.log('🔍 Test de la fonction getLeads\n');
  
  try {
    const provider = new ethers.JsonRpcProvider(NETWORK_CONFIG.base.rpc);
    const testAddress = '0x1234567890123456789012345678901234567890';
    
    // Test 1: Appel direct avec les paramètres
    console.log('1️⃣ Test d\'appel direct...');
    
    // Encoder les paramètres pour getLeads(1, testAddress)
    const iface = new ethers.Interface([
      "function getLeads(uint256 bd_id, address user) view returns (uint256)"
    ]);
    
    const data1 = iface.encodeFunctionData("getLeads", [1, testAddress]);
    const data2 = iface.encodeFunctionData("getLeads", [2, testAddress]);
    
    console.log(`   Data pour getLeads(1, ${testAddress}): ${data1}`);
    console.log(`   Data pour getLeads(2, ${testAddress}): ${data2}`);
    
    // Test 2: Appel direct via provider
    console.log('\n2️⃣ Test d\'appel direct via provider...');
    
    try {
      const result1 = await provider.call({
        to: LEADS_CONTRACT_ADDRESS,
        data: data1
      });
      console.log(`   Résultat getLeads(1): ${result1}`);
      if (result1 !== '0x') {
        const decoded = iface.decodeFunctionResult("getLeads", result1);
        console.log(`   Décodé: ${decoded[0].toString()}`);
      }
    } catch (error) {
      console.log(`   ❌ Erreur getLeads(1): ${error.message}`);
    }
    
    try {
      const result2 = await provider.call({
        to: LEADS_CONTRACT_ADDRESS,
        data: data2
      });
      console.log(`   Résultat getLeads(2): ${result2}`);
      if (result2 !== '0x') {
        const decoded = iface.decodeFunctionResult("getLeads", result2);
        console.log(`   Décodé: ${decoded[0].toString()}`);
      }
    } catch (error) {
      console.log(`   ❌ Erreur getLeads(2): ${error.message}`);
    }
    
    // Test 3: Test avec une adresse réelle (owner)
    console.log('\n3️⃣ Test avec l\'adresse owner...');
    
    const ownerData = iface.encodeFunctionData("getLeads", [1, "0x606d81e936642f69ca8CB49f9b52e1e2e3d90ecF"]);
    
    try {
      const ownerResult = await provider.call({
        to: LEADS_CONTRACT_ADDRESS,
        data: ownerData
      });
      console.log(`   Résultat getLeads(1, owner): ${ownerResult}`);
      if (ownerResult !== '0x') {
        const decoded = iface.decodeFunctionResult("getLeads", ownerResult);
        console.log(`   Décodé: ${decoded[0].toString()}`);
      }
    } catch (error) {
      console.log(`   ❌ Erreur getLeads(1, owner): ${error.message}`);
    }
    
    console.log('\n🎉 Tests terminés!');
    
  } catch (error) {
    console.error('💥 Erreur lors des tests:', error.message);
  }
}

// Exécuter les tests si le script est appelé directement
if (require.main === module) {
  testGetLeads()
    .then(() => {
      console.log('\n✅ Tests terminés avec succès');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n❌ Tests échoués:', error.message);
      process.exit(1);
    });
}

module.exports = { testGetLeads }; 