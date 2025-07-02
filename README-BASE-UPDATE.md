# Mise à jour vers Base Mainnet

## 🎯 Changements effectués

### API (`api-vendre/`)

1. **Configuration réseau mise à jour** (`contract-config.js`)
   - Ajout de la configuration Base mainnet
   - Adresse du contrat mise à jour: `0xA55cD301A354Fdffcfa494eFD8A218440bbf227E`
   - Réseau par défaut changé vers `base`
   - RPC Base: `https://mainnet.base.org`
   - Chain ID: `8453`

2. **Fichier d'exemple mis à jour** (`env.example`)
   - Configuration Base par défaut
   - Adresse du contrat mise à jour

3. **Script de test ajouté** (`test-base-config.js`)
   - Test de connexion au réseau Base
   - Vérification du contrat déployé
   - Test de récupération des prix

### Frontend (`frontend_vendre/`)

1. **Service Web3 mis à jour** (`src/services/web3Service.js`)
   - Adresse du contrat mise à jour
   - Configuration Base mainnet
   - Support automatique du réseau Base dans MetaMask
   - Variables d'environnement pour la configuration

2. **App.js mis à jour**
   - URL de l'API configurable via variable d'environnement
   - Support des variables d'environnement React

## 🚀 Démarrage

### API

1. **Créer le fichier `.env`** (basé sur `env.example`):
```bash
NETWORK=base
LEADS_CONTRACT_ADDRESS=0xA55cD301A354Fdffcfa494eFD8A218440bbf227E
PORT=3003
```

2. **Installer les dépendances**:
```bash
cd api-vendre
npm install
```

3. **Tester la configuration Base**:
```bash
node test-base-config.js
```

4. **Démarrer l'API**:
```bash
npm start
```

### Frontend

1. **Créer le fichier `.env`** (optionnel):
```bash
REACT_APP_API_BASE_URL=http://localhost:3003/api
REACT_APP_NETWORK=base
REACT_APP_CONTRACT_ADDRESS=0xA55cD301A354Fdffcfa494eFD8A218440bbf227E
REACT_APP_NETWORK_RPC=https://mainnet.base.org
REACT_APP_NETWORK_CHAIN_ID=8453
```

2. **Installer les dépendances**:
```bash
cd frontend_vendre
npm install
```

3. **Démarrer le frontend**:
```bash
npm start
```

## 🔗 Liens utiles

- **Contrat sur BaseScan**: https://basescan.org/address/0xA55cD301A354Fdffcfa494eFD8A218440bbf227E
- **RPC Base**: https://mainnet.base.org
- **Documentation Base**: https://docs.base.org

## ✅ Vérifications

1. **API fonctionne**: `http://localhost:3003/health`
2. **Service Leads**: `http://localhost:3003/api/leads-status`
3. **Frontend connecte au bon réseau**: Base mainnet (Chain ID: 8453)
4. **Contrat accessible**: Vérification via BaseScan

## 🐛 Dépannage

### Problème de connexion au réseau Base
- Vérifier que MetaMask supporte Base
- Ajouter manuellement le réseau Base si nécessaire
- Vérifier la configuration RPC

### Contrat non trouvé
- Vérifier l'adresse du contrat sur BaseScan
- S'assurer que le contrat est bien déployé sur Base mainnet
- Vérifier la configuration du réseau

### Erreurs de prix
- Vérifier que le contrat a les bonnes fonctions de prix
- Tester avec le script `test-base-config.js` 