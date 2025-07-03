# 🚀 Web3 Prospects Sales API

API dédiée à la vente de prospects Web3 avec intégration wallet et smart contracts.

## 📋 Fonctionnalités

- 🔗 Connexion wallet avec simulation
- 💰 Gestion des niveaux d'accès premium
- 📊 Endpoints pour prospects vendables
- 🎯 Logique de smart contract simulée
- 🔄 Rechargement dynamique des prospects

## 🛠️ Installation

```bash
cd api-vendre
npm install
```

## 🚀 Démarrage

### Développement
```bash
npm run dev
```

### Production
```bash
npm start
```

## 📡 Endpoints

### GET `/api/prospects-vendables`
Récupère les prospects selon le niveau d'accès du wallet.

**Headers requis :**
- `x-user-address` : Adresse wallet (optionnel)

**Réponse :**
```json
{
  "prospects": [...],
  "metadata": {
    "total": 15,
    "purchased": 10,
    "free": 5,
    "message": "Welcome 0x1234...abcd!",
    "accessLevel": "premium"
  }
}
```

### POST `/api/reload-prospects`
Recharge les prospects depuis le fichier JSON.

### GET `/api/test`
Test de l'API.

### GET `/health`
Statut de santé de l'API.

## 🌐 Déploiement Vercel

1. **Connecter le dossier `api-vendre` à Vercel**
2. **Configurer les variables d'environnement si nécessaire**
3. **Déployer automatiquement**

Le fichier `vercel.json` est déjà configuré pour le déploiement.

## 🔧 Configuration

L'API charge automatiquement les prospects depuis `./data/prospects_vendables.json`.

## 🎯 Logique d'accès

- **Sans wallet** : 5 prospects gratuits
- **Avec wallet** : 5 gratuits + leads achetés selon l'adresse
- **Niveaux variables** : 5, 10 ou 15 leads selon l'adresse

## 📝 Auteur

Choom - Web3 Prospects Sales API 

# API Vendre - Intégration Contrat Leads

Cette API permet de vendre des prospects en utilisant le contrat blockchain `Leads` pour vérifier le nombre de leads achetés par chaque utilisateur.

## 🚀 Fonctionnalités

- **Vérification blockchain** : Utilise la fonction `getLeads` du contrat pour vérifier les leads achetés
- **Mode fallback** : Fonctionne même si le contrat n'est pas disponible
- **API REST** : Endpoints pour récupérer les prospects et le statut du service
- **Support multi-réseaux** : Localhost, Sepolia, Mainnet

## 📋 Prérequis

- Node.js (v16+)
- Hardhat (pour le réseau local)
- Compte Ethereum avec des fonds (pour les tests)

## 🛠️ Installation

1. **Installer les dépendances** :
```bash
cd api-vendre
npm install
```

2. **Démarrer Hardhat** (dans un autre terminal) :
```bash
cd ../on-chain
npx hardhat node
```

3. **Déployer le contrat Leads** :
```bash
npm run deploy
```

4. **Configurer l'environnement** :
```bash
cp env.example .env
# Éditer .env avec l'adresse du contrat déployé
```

## 🔧 Configuration

### Variables d'environnement

Créez un fichier `.env` basé sur `env.example` :

```env
# Réseau blockchain
NETWORK=localhost

# Adresse du contrat Leads (obtenue après déploiement)
LEADS_CONTRACT_ADDRESS=0x1234567890123456789012345678901234567890

# Port de l'API
PORT=3003
```

### Réseaux supportés

- **localhost** : Réseau local Hardhat (défaut)
- **sepolia** : Testnet Sepolia
- **mainnet** : Ethereum mainnet

## 🚀 Démarrage

```bash
# Mode développement
npm run dev

# Mode production
npm start
```

L'API sera disponible sur `http://localhost:3003`

## 📡 Endpoints

### 1. Prospects vendables
```
GET /api/prospects-vendables
```

**Headers requis** :
- `x-user-address` : Adresse Ethereum de l'utilisateur

**Réponse** :
```json
{
  "prospects": [...],
  "metadata": {
    "total": 15,
    "purchased": 10,
    "free": 5,
    "message": "Welcome 0x1234...5678! You have access to 15 prospects (5 free + 10 purchased) [Blockchain verified]",
    "accessLevel": "premium",
    "walletAddress": "0x1234567890123456789012345678901234567890",
    "leadsService": {
      "status": "online",
      "isInitialized": true,
      "network": "localhost",
      "contractAddress": "0x1234567890123456789012345678901234567890",
      "isReady": true
    }
  }
}
```

### 2. Statut du service Leads
```
GET /api/leads-status
```

**Réponse** :
```json
{
  "service": {
    "isInitialized": true,
    "network": "localhost",
    "contractAddress": "0x1234567890123456789012345678901234567890",
    "isReady": true
  },
  "prices": {
    "base": "0.0005",
    "medium": "0.0004",
    "high": "0.00036",
    "low": "0.0001"
  },
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### 3. Test de l'API
```
GET /api/test
```

### 4. Santé du service
```
GET /health
```

## 🔍 Fonctionnement

### Vérification des leads

1. **Avec wallet connecté** :
   - L'API appelle `getLeads(bd_id, userAddress)` sur le contrat
   - Retourne le nombre exact de leads achetés
   - Affiche `[Blockchain verified]` dans le message

2. **Sans wallet ou service indisponible** :
   - Utilise le mode fallback basé sur l'adresse
   - Affiche `[Fallback mode]` ou `[Service unavailable]`

### Logique d'accès

- **5 prospects gratuits** : Toujours disponibles
- **+ N leads achetés** : Selon le contrat blockchain
- **Total affiché** : `min(5 + leads_achetés, total_prospects)`

## 🧪 Tests

### Test manuel avec curl

```bash
# Test sans wallet
curl http://localhost:3003/api/prospects-vendables

# Test avec wallet
curl -H "x-user-address: 0x1234567890123456789012345678901234567890" \
     http://localhost:3003/api/prospects-vendables

# Vérifier le statut du service
curl http://localhost:3003/api/leads-status
```

### Test du contrat

```bash
# Déployer et tester le contrat
npm run deploy
```

## 🔧 Développement

### Structure des fichiers

```
api-vendre/
├── server.js              # Serveur principal
├── leads-service.js       # Service d'interaction avec le contrat
├── contract-config.js     # Configuration du contrat
├── deploy-leads.js        # Script de déploiement
├── env.example           # Variables d'environnement
└── data/                 # Données des prospects
    └── prospects_vendables.json
```

### Ajouter un nouveau réseau

1. Modifier `contract-config.js`
2. Ajouter la configuration dans `NETWORK_CONFIG`
3. Mettre à jour les variables d'environnement

## 🐛 Dépannage

### Erreur "Contrat non trouvé"
- Vérifier que le contrat est déployé
- Vérifier l'adresse dans `.env`
- Vérifier que Hardhat est en cours d'exécution

### Erreur "Service Leads non initialisé"
- Vérifier la connexion RPC
- Vérifier la configuration réseau
- Vérifier les logs pour plus de détails

### Mode fallback activé
- Normal si le contrat n'est pas déployé
- Vérifier la configuration si le contrat est déployé

## 📝 Logs

L'API affiche des logs détaillés :

```
🚀 Sales API started on port 3003
✅ Service Leads initialisé sur localhost
📋 Contrat: 0x1234567890123456789012345678901234567890
🔍 Leads trouvés pour 0x1234...5678 (bd_id: 1): 10
💰 Leads achetés pour 0x1234...5678: 10
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature
3. Commiter les changements
4. Pousser vers la branche
5. Ouvrir une Pull Request

## 📄 Licence

ISC - Voir le fichier LICENSE pour plus de détails. # CORS update
