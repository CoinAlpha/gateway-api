"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SIFCHAIN_TESTNET = void 0;
const entities_1 = require("../../../entities");
exports.SIFCHAIN_TESTNET = {
    network: entities_1.Network.SIFCHAIN,
    chainType: "ibc",
    displayName: "Sifchain",
    blockExplorerUrl: "https://www.mintscan.io/sifchain",
    nativeAssetSymbol: "rowan",
    chainId: "sifchain-testnet-1",
    rpcUrl: "https://rpc-testnet.sifchain.finance",
    restUrl: "https://api-testnet.sifchain.finance",
    keplrChainInfo: {
        chainName: "Sifchain Testnet",
        chainId: "sifchain-testnet-1",
        rpc: "https://rpc-testnet.sifchain.finance",
        rest: "https://api-testnet.sifchain.finance",
        stakeCurrency: {
            coinDenom: "ROWAN",
            coinMinimalDenom: "rowan",
            coinDecimals: 18,
        },
        bip44: {
            coinType: 118,
        },
        bech32Config: {
            bech32PrefixAccAddr: "sif",
            bech32PrefixAccPub: "sifpub",
            bech32PrefixValAddr: "sifvaloper",
            bech32PrefixValPub: "sifvaloperpub",
            bech32PrefixConsAddr: "sifvalcons",
            bech32PrefixConsPub: "sifvalconspub",
        },
        currencies: [
            {
                coinDenom: "ROWAN",
                coinMinimalDenom: "rowan",
                coinDecimals: 18,
            },
        ],
        feeCurrencies: [
            {
                coinDenom: "ROWAN",
                coinMinimalDenom: "rowan",
                coinDecimals: 18,
            },
        ],
        coinType: 118,
        gasPriceStep: {
            low: 5000000000000,
            average: 6500000000000,
            high: 8000000000000,
        },
        features: ["stargate", "ibc-transfer"],
    },
};
//# sourceMappingURL=sifchain-testnet.js.map