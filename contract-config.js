// Configuration du contrat Leads
const LEADS_ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "bd_id",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "lead_amount",
        "type": "uint256"
      }
    ],
    "name": "LeadsBought",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "lead_amount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "bd_id",
        "type": "uint256"
      }
    ],
    "name": "buyLead",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "bd_id",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "getLeads",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "price_base",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "price_high",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "price_low",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "price_medium",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "new_price_base",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "new_price_medium",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "new_price_high",
        "type": "uint256"
      }
    ],
    "name": "setPrice",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "new_target",
        "type": "address"
      }
    ],
    "name": "setTarget",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "target",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

// Configuration réseau (à adapter selon ton déploiement)
const NETWORK_CONFIG = {
  // Pour testnet local (Hardhat)
  localhost: {
    rpc: "http://127.0.0.1:8545",
    chainId: 31337
  },
  // Pour Sepolia testnet
  sepolia: {
    rpc: "https://sepolia.infura.io/v3/YOUR_INFURA_KEY",
    chainId: 11155111
  },
  // Pour Ethereum mainnet
  mainnet: {
    rpc: "https://mainnet.infura.io/v3/YOUR_INFURA_KEY",
    chainId: 1
  },
  // Pour Base mainnet
  base: {
    rpc: "https://mainnet.base.org",
    chainId: 8453
  }
};

// Adresse du contrat Leads (déployé sur Base)
const LEADS_CONTRACT_ADDRESS = process.env.LEADS_CONTRACT_ADDRESS || "0xA55cD301A354Fdffcfa494eFD8A218440bbf227E";

// Configuration par défaut
const DEFAULT_NETWORK = process.env.NETWORK || "base";

module.exports = {
  LEADS_ABI,
  LEADS_CONTRACT_ADDRESS,
  NETWORK_CONFIG,
  DEFAULT_NETWORK
}; 