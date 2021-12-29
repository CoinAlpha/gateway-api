"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PERSISTENCE_MAINNET = void 0;
const entities_1 = require("../../../entities");
exports.PERSISTENCE_MAINNET = {
    network: entities_1.Network.PERSISTENCE,
    chainType: "ibc",
    displayName: "Persistence",
    blockExplorerUrl: "https://explorer.persistence.one/",
    nativeAssetSymbol: "uxprt",
    chainId: "core-1",
    rpcUrl: "https://rpc-persistence.keplr.app/",
    restUrl: "https://lcd-persistence.keplr.app/",
    keplrChainInfo: {
        rpc: "https://rpc-persistence.keplr.app/",
        rest: "https://lcd-persistence.keplr.app/",
        chainId: "core-1",
        chainName: "Persistence",
        stakeCurrency: {
            coinDenom: "XPRT",
            coinMinimalDenom: "uxprt",
            coinDecimals: 6,
            coinGeckoId: "persistence",
        },
        walletUrl: "https://wallet.keplr.app/#/persistence/stake",
        walletUrlForStaking: "https://wallet.keplr.app/#/persistence/stake",
        bip44: {
            coinType: 566,
        },
        bech32Config: {
            bech32PrefixAccAddr: "persistence",
            bech32PrefixAccPub: "persistencepub",
            bech32PrefixValAddr: "persistencevaloper",
            bech32PrefixValPub: "persistencevaloperpub",
            bech32PrefixConsAddr: "persistencevalcons",
            bech32PrefixConsPub: "persistencevalconspub",
        },
        currencies: [
            {
                coinDenom: "XPRT",
                coinMinimalDenom: "uxprt",
                coinDecimals: 6,
                coinGeckoId: "persistence",
            },
        ],
        feeCurrencies: [
            {
                coinDenom: "XPRT",
                coinMinimalDenom: "uxprt",
                coinDecimals: 6,
                coinGeckoId: "persistence",
            },
        ],
        coinType: 556,
        features: ["stargate", "ibc-transfer"],
    },
};
//# sourceMappingURL=persistence-mainnet.js.map