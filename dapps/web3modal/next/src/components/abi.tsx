export default [
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "client",
                type: "address",
            },
            {
                indexed: false,
                internalType: "string",
                name: "telegramHandle",
                type: "string",
            },
        ],
        name: "ClientRegistered",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "client",
                type: "address",
            },
            {
                indexed: false,
                internalType: "string",
                name: "telegramHandle",
                type: "string",
            },
        ],
        name: "ClientUpdated",
        type: "event",
    },
    {
        inputs: [
            {
                internalType: "string",
                name: "_title",
                type: "string",
            },
            {
                internalType: "string",
                name: "_description",
                type: "string",
            },
            {
                internalType: "uint256",
                name: "_price",
                type: "uint256",
            },
        ],
        name: "createOffering",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "developer",
                type: "address",
            },
            {
                indexed: false,
                internalType: "string",
                name: "name",
                type: "string",
            },
            {
                indexed: false,
                internalType: "string",
                name: "bio",
                type: "string",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "builderScore",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "string",
                name: "telegramHandle",
                type: "string",
            },
        ],
        name: "DeveloperRegistered",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "developer",
                type: "address",
            },
            {
                indexed: false,
                internalType: "string",
                name: "name",
                type: "string",
            },
            {
                indexed: false,
                internalType: "string",
                name: "bio",
                type: "string",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "builderScore",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "string",
                name: "telegramHandle",
                type: "string",
            },
        ],
        name: "DeveloperUpdated",
        type: "event",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "_id",
                type: "uint256",
            },
        ],
        name: "markOfferingCompleted",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "uint256",
                name: "id",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "address",
                name: "developer",
                type: "address",
            },
            {
                indexed: false,
                internalType: "address",
                name: "client",
                type: "address",
            },
        ],
        name: "OfferingCompleted",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "uint256",
                name: "id",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "address payable",
                name: "developer",
                type: "address",
            },
            {
                indexed: false,
                internalType: "string",
                name: "title",
                type: "string",
            },
            {
                indexed: false,
                internalType: "string",
                name: "description",
                type: "string",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "price",
                type: "uint256",
            },
        ],
        name: "OfferingCreated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "uint256",
                name: "id",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "address",
                name: "developer",
                type: "address",
            },
            {
                indexed: false,
                internalType: "address",
                name: "client",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "price",
                type: "uint256",
            },
        ],
        name: "OfferingPurchased",
        type: "event",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "_id",
                type: "uint256",
            },
        ],
        name: "purchaseOffering",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "string",
                name: "_telegramHandle",
                type: "string",
            },
        ],
        name: "registerClient",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "string",
                name: "_name",
                type: "string",
            },
            {
                internalType: "string",
                name: "_bio",
                type: "string",
            },
            {
                internalType: "uint8",
                name: "_builderScore",
                type: "uint8",
            },
            {
                internalType: "string",
                name: "_telegramHandle",
                type: "string",
            },
        ],
        name: "registerDeveloper",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "string",
                name: "_telegramHandle",
                type: "string",
            },
        ],
        name: "updateClientProfile",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "string",
                name: "_name",
                type: "string",
            },
            {
                internalType: "string",
                name: "_bio",
                type: "string",
            },
            {
                internalType: "uint8",
                name: "_builderScore",
                type: "uint8",
            },
            {
                internalType: "string",
                name: "_telegramHandle",
                type: "string",
            },
        ],
        name: "updateDeveloperProfile",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        name: "clientPurchases",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        name: "clients",
        outputs: [
            {
                internalType: "address",
                name: "addr",
                type: "address",
            },
            {
                internalType: "string",
                name: "telegramHandle",
                type: "string",
            },
            {
                internalType: "bool",
                name: "isRegistered",
                type: "bool",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        name: "developerOfferings",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        name: "developers",
        outputs: [
            {
                internalType: "address",
                name: "addr",
                type: "address",
            },
            {
                internalType: "string",
                name: "name",
                type: "string",
            },
            {
                internalType: "string",
                name: "bio",
                type: "string",
            },
            {
                internalType: "uint8",
                name: "builderScore",
                type: "uint8",
            },
            {
                internalType: "string",
                name: "telegramHandle",
                type: "string",
            },
            {
                internalType: "bool",
                name: "isRegistered",
                type: "bool",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getAllOfferings",
        outputs: [
            {
                components: [
                    {
                        internalType: "uint256",
                        name: "id",
                        type: "uint256",
                    },
                    {
                        internalType: "address payable",
                        name: "developer",
                        type: "address",
                    },
                    {
                        internalType: "address",
                        name: "client",
                        type: "address",
                    },
                    {
                        internalType: "string",
                        name: "title",
                        type: "string",
                    },
                    {
                        internalType: "string",
                        name: "description",
                        type: "string",
                    },
                    {
                        internalType: "uint256",
                        name: "price",
                        type: "uint256",
                    },
                    {
                        internalType: "enum DevMarketplace.OfferingStatus",
                        name: "status",
                        type: "uint8",
                    },
                ],
                internalType: "struct DevMarketplace.JobOffering[]",
                name: "",
                type: "tuple[]",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "_client",
                type: "address",
            },
        ],
        name: "getClientPurchases",
        outputs: [
            {
                internalType: "uint256[]",
                name: "",
                type: "uint256[]",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "_developer",
                type: "address",
            },
        ],
        name: "getDeveloperOfferings",
        outputs: [
            {
                internalType: "uint256[]",
                name: "",
                type: "uint256[]",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "offeringCount",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        name: "offerings",
        outputs: [
            {
                internalType: "uint256",
                name: "id",
                type: "uint256",
            },
            {
                internalType: "address payable",
                name: "developer",
                type: "address",
            },
            {
                internalType: "address",
                name: "client",
                type: "address",
            },
            {
                internalType: "string",
                name: "title",
                type: "string",
            },
            {
                internalType: "string",
                name: "description",
                type: "string",
            },
            {
                internalType: "uint256",
                name: "price",
                type: "uint256",
            },
            {
                internalType: "enum DevMarketplace.OfferingStatus",
                name: "status",
                type: "uint8",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
] as const;
