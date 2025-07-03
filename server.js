const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs-extra');
const leadsService = require('./leads-service');

const app = express();
const PORT = process.env.PORT || 3003;

// Middleware
app.use(cors({
  origin: 'https://front-leads.vercel.app',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-site-access', 'x-origin', 'x-user-address']
}));
app.use(express.json());

// Charger les prospects vendables
let prospects = [];
const loadProspects = async () => {
  try {
    // Chemin vers les prospects dans le dossier data local
    const dataPath = path.join(__dirname, './data/prospects_vendables.json');
    if (await fs.pathExists(dataPath)) {
      const data = await fs.readJson(dataPath);
      prospects = data.prospects || [];
      console.log(`📊 Loaded ${prospects.length} sellable prospects`);
    } else {
      console.log('⚠️ No prospects_vendables.json found, using empty array');
      prospects = [];
    }
  } catch (error) {
    console.error('Error loading prospects:', error);
    prospects = [];
  }
};

// Charger les prospects au démarrage
loadProspects();

// Initialiser le service Leads au démarrage
const initializeLeadsService = async () => {
  try {
    await leadsService.initialize();
  } catch (error) {
    console.log('⚠️ Service Leads non initialisé, utilisation du mode fallback');
  }
};

// Endpoint principal pour les prospects vendables
app.get('/api/prospects-vendables', async (req, res) => {
  try {
    const userAddress = req.headers['x-user-address'];
    console.log(`🔗 Wallet access request from: ${userAddress || 'No wallet connected'}`);
    
    // Recharger les prospects si nécessaire
    if (prospects.length === 0) {
      await loadProspects();
    }
    
    // Si pas de wallet connecté, afficher seulement les prospects gratuits
    if (!userAddress) {
      const freeProspects = prospects.slice(0, 5);
      return res.json({
        prospects: freeProspects,
        metadata: {
          total: freeProspects.length,
          message: "Connect your wallet to access premium prospects",
          accessLevel: "free",
          leadsService: leadsService.getStatus()
        }
      });
    }
    
    // Récupérer le nombre de leads achetés depuis le contrat
    let purchasedLeads = 0;
    let leadsServiceStatus = "offline";
    
    try {
      if (leadsService.isReady()) {
        purchasedLeads = await leadsService.getLeadsForUser(userAddress, 2);
        leadsServiceStatus = "online";
        console.log(`💰 Leads achetés pour ${userAddress}: ${purchasedLeads}`);
      } else {
        // Fallback: simulation basée sur l'adresse wallet
        console.log('🔄 Utilisation du mode fallback pour les leads');
        const addressHash = userAddress.split('').reduce((a, b) => {
          a = ((a << 5) - a) + b.charCodeAt(0);
          return a & a;
        }, 0);
        
        if (addressHash % 3 === 0) {
          purchasedLeads = 5;
        } else if (addressHash % 3 === 1) {
          purchasedLeads = 15;
        } else {
          purchasedLeads = 10;
        }
        leadsServiceStatus = "fallback";
      }
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des leads:', error.message);
      // En cas d'erreur, utiliser le mode fallback
      const addressHash = userAddress.split('').reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a;
      }, 0);
      purchasedLeads = addressHash % 10 + 5;
      leadsServiceStatus = "error";
    }
    
    const totalToShow = Math.min(5 + purchasedLeads, prospects.length);
    const availableProspects = prospects.slice(0, totalToShow);
    
    let message = `Welcome ${userAddress.slice(0, 6)}...${userAddress.slice(-4)}! You have access to ${totalToShow} prospects (5 free + ${purchasedLeads} purchased)`;
    
    if (totalToShow < 5 + purchasedLeads) {
      message += `. ${(5 + purchasedLeads) - totalToShow} additional leads are pending.`;
    }
    
    // Ajouter des informations sur le service Leads
    if (leadsServiceStatus === "online") {
      message += ` [Blockchain verified]`;
    } else if (leadsServiceStatus === "fallback") {
      message += ` [Fallback mode]`;
    } else {
      message += ` [Service unavailable]`;
    }
    
    res.json({
      prospects: availableProspects,
      metadata: {
        total: totalToShow,
        purchased: purchasedLeads,
        free: 5,
        message: message,
        accessLevel: "premium",
        walletAddress: userAddress,
        leadsService: {
          status: leadsServiceStatus,
          ...leadsService.getStatus()
        }
      }
    });
    
  } catch (error) {
    console.error('Error serving prospects:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Nouvel endpoint pour vérifier le statut du service Leads
app.get('/api/leads-status', async (req, res) => {
  try {
    const status = leadsService.getStatus();
    const prices = await leadsService.getPrices();
    
    res.json({
      service: status,
      prices: prices,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting leads status:', error);
    res.status(500).json({ error: 'Failed to get leads status' });
  }
});

// Endpoint pour recharger les prospects
app.post('/api/reload-prospects', async (req, res) => {
  try {
    await loadProspects();
    res.json({ 
      message: `Prospects reloaded successfully. ${prospects.length} prospects available.`,
      count: prospects.length
    });
  } catch (error) {
    console.error('Error reloading prospects:', error);
    res.status(500).json({ error: 'Failed to reload prospects' });
  }
});

// Endpoint de test
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Sales API is running!', 
    timestamp: new Date().toISOString(),
    prospectsLoaded: prospects.length,
    leadsService: leadsService.getStatus()
  });
});

// Endpoint de santé
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    service: 'web3-prospects-sales-api',
    timestamp: new Date().toISOString(),
    leadsService: leadsService.getStatus()
  });
});

// Initialiser le service Leads au démarrage
initializeLeadsService();

app.listen(PORT, () => {
  console.log(`🚀 Sales API started on port ${PORT}`);
  console.log(`📊 Endpoint: http://localhost:${PORT}/api/prospects-vendables`);
  console.log(`🔧 Test: http://localhost:${PORT}/api/test`);
  console.log(`💚 Health: http://localhost:${PORT}/health`);
  console.log(`📋 Leads Status: http://localhost:${PORT}/api/leads-status`);
});

module.exports = app; 