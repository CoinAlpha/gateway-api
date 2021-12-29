"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AKASH_MAINNET = void 0;
const entities_1 = require("../../../entities");
exports.AKASH_MAINNET = {
    network: entities_1.Network.AKASH,
    chainType: "ibc",
    displayName: "Akash",
    blockExplorerUrl: "https://akash.aneka.io",
    nativeAssetSymbol: "uakt",
    chainId: "akashnet-2",
    rpcUrl: "https://rpc-akash.keplr.app",
    restUrl: "https://lcd-akash.keplr.app",
    keplrChainInfo: {
        rpc: "https://rpc-akash.keplr.app",
        rest: "https://lcd-akash.keplr.app",
        chainId: "akashnet-2",
        chainName: "Akash",
        stakeCurrency: {
            coinDenom: "AKT",
            coinMinimalDenom: "uakt",
            coinDecimals: 6,
            coinGeckoId: "akash-network",
        },
        walletUrl: "https://wallet.keplr.app/#/akash/stake",
        walletUrlForStaking: "https://wallet.keplr.app/#/akash/stake",
        bip44: {
            coinType: 118,
        },
        bech32Config: {
            bech32PrefixAccAddr: "akash",
            bech32PrefixAccPub: "akashpub",
            bech32PrefixValAddr: "akashvaloper",
            bech32PrefixValPub: "akashvaloperpub",
            bech32PrefixConsAddr: "akashvalcons",
            bech32PrefixConsPub: "akashvalconspub",
        },
        currencies: [
            {
                coinDenom: "AKT",
                coinMinimalDenom: "uakt",
                coinDecimals: 6,
                coinGeckoId: "akash-network",
            },
        ],
        feeCurrencies: [
            {
                coinDenom: "AKT",
                coinMinimalDenom: "uakt",
                coinDecimals: 6,
                coinGeckoId: "akash-network",
            },
        ],
        coinType: 118,
        features: ["stargate", "ibc-transfer"],
    },
};
//# sourceMappingURL=akash-mainnet.js.map