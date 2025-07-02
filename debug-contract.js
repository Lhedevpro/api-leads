const { ethers } = require('ethers');
const { LEADS_ABI, LEADS_CONTRACT_ADDRESS, NETWORK_CONFIG } = require('./contract-config');

async function debugContract() {
  console.log('🔍 Debug du contrat Leads\n');
  
  try {
    const provider = new ethers.JsonRpcProvider(NETWORK_CONFIG.base.rpc);
    const contract = new ethers.Contract(LEADS_CONTRACT_ADDRESS, LEADS_ABI, provider);
    
    console.log('1️⃣ Test des fonctions de base...');
    
    // Test des fonctions de prix une par une
    console.log('\n2️⃣ Test des fonctions de prix:');
    
    try {
      const priceBase = await contract.price_base();
      console.log(`   price_base(): ${ethers.formatEther(priceBase)} ETH`);
    } catch (error) {
      console.log(`   ❌ price_base(): ${error.message}`);
    }
    
    try {
      const priceMedium = await contract.price_medium();
      console.log(`   price_medium(): ${ethers.formatEther(priceMedium)} ETH`);
    } catch (error) {
      console.log(`   ❌ price_medium(): ${error.message}`);
    }
    
    try {
      const priceHigh = await contract.price_high();
      console.log(`   price_high(): ${ethers.formatEther(priceHigh)} ETH`);
    } catch (error) {
      console.log(`   ❌ price_high(): ${error.message}`);
    }
    
    try {
      const priceLow = await contract.price_low();
      console.log(`   price_low(): ${ethers.formatEther(priceLow)} ETH`);
    } catch (error) {
      console.log(`   ❌ price_low(): ${error.message}`);
    }
    
    console.log('\n3️⃣ Test des autres fonctions:');
    
    try {
      const owner = await contract.owner();
      console.log(`   owner(): ${owner}`);
    } catch (error) {
      console.log(`   ❌ owner(): ${error.message}`);
    }
    
    try {
      const target = await contract.target();
      console.log(`   target(): ${target}`);
    } catch (error) {
      console.log(`   ❌ target(): ${error.message}`);
    }
    
    console.log('\n4️⃣ Test de getLeads avec différents paramètres:');
    
    const testAddress = '0x1234567890123456789012345678901234567890';
    
    try {
      const leads1 = await contract.getLeads(1, testAddress);
      console.log(`   getLeads(1, ${testAddress}): ${leads1.toString()}`);
    } catch (error) {
      console.log(`   ❌ getLeads(1, ${testAddress}): ${error.message}`);
    }
    
    try {
      const leads2 = await contract.getLeads(2, testAddress);
      console.log(`   getLeads(2, ${testAddress}): ${leads2.toString()}`);
    } catch (error) {
      console.log(`   ❌ getLeads(2, ${testAddress}): ${error.message}`);
    }
    
    console.log('\n5️⃣ Vérification du code du contrat:');
    const code = await provider.getCode(LEADS_CONTRACT_ADDRESS);
    console.log(`   Code length: ${code.length} characters`);
    console.log(`   Code starts with: ${code.substring(0, 10)}...`);
    
    console.log('\n🎉 Debug terminé!');
    
  } catch (error) {
    console.error('💥 Erreur lors du debug:', error.message);
  }
}

// Exécuter le debug si le script est appelé directement
if (require.main === module) {
  debugContract()
    .then(() => {
      console.log('\n✅ Debug terminé avec succès');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n❌ Debug échoué:', error.message);
      process.exit(1);
    });
}

module.exports = { debugContract }; 