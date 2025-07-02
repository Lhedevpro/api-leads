const { ethers } = require('ethers');
const { LEADS_ABI, LEADS_CONTRACT_ADDRESS, NETWORK_CONFIG, DEFAULT_NETWORK } = require('./contract-config');

class LeadsService {
  constructor() {
    this.provider = null;
    this.contract = null;
    this.isInitialized = false;
    this.initializationAttempted = false;
  }

  // Initialiser la connexion au contrat
  async initialize() {
    // Éviter les initialisations multiples
    if (this.initializationAttempted) {
      return this.isInitialized;
    }
    
    this.initializationAttempted = true;
    
    try {
      const networkConfig = NETWORK_CONFIG[DEFAULT_NETWORK];
      if (!networkConfig) {
        throw new Error(`Configuration réseau non trouvée pour: ${DEFAULT_NETWORK}`);
      }

      // Créer le provider avec un timeout
      this.provider = new ethers.JsonRpcProvider(networkConfig.rpc, undefined, {
        timeout: 5000 // 5 secondes de timeout
      });
      
      // Créer l'instance du contrat
      this.contract = new ethers.Contract(
        LEADS_CONTRACT_ADDRESS,
        LEADS_ABI,
        this.provider
      );

      // Vérifier que le contrat existe seulement si l'adresse n'est pas la valeur par défaut
      if (LEADS_CONTRACT_ADDRESS !== "0x0000000000000000000000000000000000000000") {
        const code = await this.provider.getCode(LEADS_CONTRACT_ADDRESS);
        if (code === '0x') {
          throw new Error(`Contrat non trouvé à l'adresse: ${LEADS_CONTRACT_ADDRESS}`);
        }
      }

      this.isInitialized = true;
      console.log(`✅ Service Leads initialisé sur ${DEFAULT_NETWORK}`);
      console.log(`📋 Contrat: ${LEADS_CONTRACT_ADDRESS}`);
      
      return true;
    } catch (error) {
      console.error('❌ Erreur lors de l\'initialisation du service Leads:', error.message);
      this.isInitialized = false;
      return false;
    }
  }

  // Récupérer le nombre de leads achetés pour un utilisateur
  async getLeadsForUser(userAddress, bdId = 1) {
    try {
      // Si le service n'est pas initialisé et qu'on n'a pas encore essayé, essayer une fois
      if (!this.isInitialized && !this.initializationAttempted) {
        await this.initialize();
      }

      if (!ethers.isAddress(userAddress)) {
        throw new Error('Adresse utilisateur invalide');
      }

      // Si le service n'est toujours pas initialisé, retourner 0
      if (!this.isInitialized) {
        console.log('⚠️ Service Leads non disponible, retour de 0 leads');
        return 0;
      }

      // Utiliser l'interface pour encoder l'appel
      const iface = new ethers.Interface([
        "function getLeads(uint256 bd_id, address user) view returns (uint256)"
      ]);
      
      const data = iface.encodeFunctionData("getLeads", [bdId, userAddress]);
      
      // Appeler directement via le provider
      const result = await this.provider.call({
        to: LEADS_CONTRACT_ADDRESS,
        data: data
      });
      
      if (result === '0x') {
        console.log(`🔍 Aucun lead trouvé pour ${userAddress} (bd_id: ${bdId})`);
        return 0;
      }
      
      const decoded = iface.decodeFunctionResult("getLeads", result);
      const leadsCount = parseInt(decoded[0].toString());
      
      console.log(`🔍 Leads trouvés pour ${userAddress} (bd_id: ${bdId}): ${leadsCount}`);
      
      return leadsCount;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des leads:', error.message);
      
      // En cas d'erreur, retourner 0 leads (accès gratuit uniquement)
      return 0;
    }
  }

  // Récupérer les prix actuels du contrat
  async getPrices() {
    try {
      // Si le service n'est pas initialisé et qu'on n'a pas encore essayé, essayer une fois
      if (!this.isInitialized && !this.initializationAttempted) {
        await this.initialize();
      }

      // Si le service n'est toujours pas initialisé, retourner null
      if (!this.isInitialized) {
        return null;
      }

      // Utiliser l'interface pour encoder les appels
      const iface = new ethers.Interface([
        "function price_base() view returns (uint256)",
        "function price_medium() view returns (uint256)",
        "function price_high() view returns (uint256)",
        "function price_low() view returns (uint256)"
      ]);

      const [priceBaseData, priceMediumData, priceHighData, priceLowData] = [
        iface.encodeFunctionData("price_base"),
        iface.encodeFunctionData("price_medium"),
        iface.encodeFunctionData("price_high"),
        iface.encodeFunctionData("price_low")
      ];

      const [priceBaseResult, priceMediumResult, priceHighResult, priceLowResult] = await Promise.all([
        this.provider.call({ to: LEADS_CONTRACT_ADDRESS, data: priceBaseData }),
        this.provider.call({ to: LEADS_CONTRACT_ADDRESS, data: priceMediumData }),
        this.provider.call({ to: LEADS_CONTRACT_ADDRESS, data: priceHighData }),
        this.provider.call({ to: LEADS_CONTRACT_ADDRESS, data: priceLowData })
      ]);

      const [priceBase, priceMedium, priceHigh, priceLow] = [
        iface.decodeFunctionResult("price_base", priceBaseResult)[0],
        iface.decodeFunctionResult("price_medium", priceMediumResult)[0],
        iface.decodeFunctionResult("price_high", priceHighResult)[0],
        iface.decodeFunctionResult("price_low", priceLowResult)[0]
      ];

      return {
        base: ethers.formatEther(priceBase),
        medium: ethers.formatEther(priceMedium),
        high: ethers.formatEther(priceHigh),
        low: ethers.formatEther(priceLow)
      };
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des prix:', error.message);
      return null;
    }
  }

  // Vérifier si le service est opérationnel
  isReady() {
    return this.isInitialized && this.contract !== null;
  }

  // Obtenir le statut du service
  getStatus() {
    return {
      isInitialized: this.isInitialized,
      initializationAttempted: this.initializationAttempted,
      network: DEFAULT_NETWORK,
      contractAddress: LEADS_CONTRACT_ADDRESS,
      isReady: this.isReady()
    };
  }
}

// Créer une instance singleton
const leadsService = new LeadsService();

module.exports = leadsService; 