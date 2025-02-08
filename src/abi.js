const BrokerABI = [
	{
		"inputs": [],
		"name": "createServer",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint32",
				"name": "index",
				"type": "uint32"
			}
		],
		"name": "deleteServer",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getAllServers",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "model",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "tokenCost",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "serverContract",
						"type": "address"
					}
				],
				"internalType": "struct LLMBroker.Server[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "market",
		"outputs": [
			{
				"internalType": "string",
				"name": "model",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "tokenCost",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "serverContract",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint32",
				"name": "index",
				"type": "uint32"
			}
		],
		"name": "updateServerDetails",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint32",
				"name": "index",
				"type": "uint32"
			},
			{
				"internalType": "string",
				"name": "_model",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_tokenCost",
				"type": "uint256"
			}
		],
		"name": "updateServerDetails",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];
const ServerABI = [
	{
		"inputs": [
			{
				"internalType": "address payable",
				"name": "_serverOwner",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_brokerAddress",
				"type": "address"
			},
			{
				"internalType": "uint32",
				"name": "_brokerIndex",
				"type": "uint32"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "agreements",
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
		"inputs": [
			{
				"internalType": "uint64",
				"name": "pubKey",
				"type": "uint64"
			}
		],
		"name": "createAgreement",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "currentAgreements",
		"outputs": [
			{
				"internalType": "uint16",
				"name": "",
				"type": "uint16"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "destroySelf",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "endAgreement",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "model",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_tokenCost",
				"type": "uint256"
			}
		],
		"name": "setTokenCost",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint16",
				"name": "_maxConcurrentAgreements",
				"type": "uint16"
			}
		],
		"name": "setmaxConcurrentAgreements",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_endpoint",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_model",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_tokenCost",
				"type": "uint256"
			}
		],
		"name": "setupModel",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "tokenCost",
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
				"internalType": "uint32",
				"name": "newIndex",
				"type": "uint32"
			}
		],
		"name": "updateIndex",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];

const AgreementABI = [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "initialTokens",
				"type": "uint256"
			},
			{
				"internalType": "address payable",
				"name": "_serverOwner",
				"type": "address"
			},
			{
				"internalType": "address payable",
				"name": "_client",
				"type": "address"
			},
			{
				"internalType": "uint64",
				"name": "_userPubKey",
				"type": "uint64"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "uint32",
				"name": "numTokens",
				"type": "uint32"
			}
		],
		"name": "notifyResponse",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "refund",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "satisfied",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "serverAddress",
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
		"inputs": [
			{
				"internalType": "int256",
				"name": "",
				"type": "int256"
			}
		],
		"name": "unsatisfied",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];

export { BrokerABI, ServerABI, AgreementABI };