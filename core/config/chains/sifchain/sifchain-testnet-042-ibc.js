"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SIFCHAIN_TESTNET_042 = void 0;
const entities_1 = require("../../../entities");
exports.SIFCHAIN_TESTNET_042 = {
    network: entities_1.Network.SIFCHAIN,
    chainType: "ibc",
    displayName: "Sifchain",
    blockExplorerUrl: "https://www.mintscan.io/sifchain",
    nativeAssetSymbol: "rowan",
    chainId: "sifchain-testnet-042-ibc",
    rpcUrl: "https://rpc-testnet-042-ibc.sifchain.finance",
    restUrl: "https://api-testnet-042-ibc.sifchain.finance",
    keplrChainInfo: {
        chainName: "SifTest-042-IBC",
        chainId: "sifchain-testnet-042-ibc",
        rpc: "https://rpc-testnet-042-ibc.sifchain.finance",
        rest: "https://api-testnet-042-ibc.sifchain.finance",
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
            average: 8000000000000,
            high: 9000000000000,
        },
    },
};
//# sourceMappingURL=sifchain-testnet-042-ibc.js.map