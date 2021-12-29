"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PERSISTENCE_TESTNET = void 0;
const entities_1 = require("../../../entities");
exports.PERSISTENCE_TESTNET = {
    network: entities_1.Network.PERSISTENCE,
    chainType: "ibc",
    displayName: "Persistence",
    blockExplorerUrl: "https://test-core-1.explorer.persistence.one/",
    nativeAssetSymbol: "uxprt",
    chainId: "test-core-1",
    rpcUrl: "https://persistence.testnet.rpc.audit.one/",
    restUrl: "https://persistence.testnet.rest.audit.one/",
    keplrChainInfo: {
        rpc: "https://persistence.testnet.rpc.audit.one/",
        rest: "https://persistence.testnet.rest.audit.one/",
        chainId: "test-core-1",
        chainName: "Persistence Testnet",
        stakeCurrency: {
            coinDenom: "XPRT",
            coinMinimalDenom: "uxprt",
            coinDecimals: 6,
            coinGeckoId: "persistence",
        },
        walletUrl: "https://wallet.keplr.app/#/persistence/stake",
        walletUrlForStaking: "https://wallet.keplr.app/#/persistence/stake",
        bip44: {
            coinType: 118,
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
        coinType: 118,
        features: ["stargate", "ibc-transfer"],
    },
};
//# sourceMappingURL=persistence-testnet.js.map