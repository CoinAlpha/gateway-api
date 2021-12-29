"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IRIS_MAINNET = void 0;
const entities_1 = require("../../../entities");
exports.IRIS_MAINNET = {
    network: entities_1.Network.IRIS,
    chainType: "ibc",
    displayName: "IRISnet",
    blockExplorerUrl: "https://irishub.iobscan.io/",
    nativeAssetSymbol: "uiris",
    chainId: "irishub-1",
    rpcUrl: "https://rpc-iris.keplr.app/",
    restUrl: "https://lcd-iris.keplr.app/",
    keplrChainInfo: {
        rpc: "https://rpc-iris.keplr.app/",
        rest: "https://lcd-iris.keplr.app/",
        chainId: "irishub-1",
        chainName: "IRISnet",
        stakeCurrency: {
            coinDenom: "IRIS",
            coinMinimalDenom: "uiris",
            coinDecimals: 6,
            coinGeckoId: "iris",
        },
        walletUrl: "https://wallet.keplr.app/#/iris/stake",
        walletUrlForStaking: "https://wallet.keplr.app/#/iris/stake",
        bip44: {
            coinType: 566,
        },
        bech32Config: {
            bech32PrefixAccAddr: "iaa",
            bech32PrefixAccPub: "iaapub",
            bech32PrefixValAddr: "iaavaloper",
            bech32PrefixValPub: "iaavaloperpub",
            bech32PrefixConsAddr: "iaavalcons",
            bech32PrefixConsPub: "iaavalconspub",
        },
        currencies: [
            {
                coinDenom: "IRIS",
                coinMinimalDenom: "uiris",
                coinDecimals: 6,
                coinGeckoId: "iris",
            },
        ],
        feeCurrencies: [
            {
                coinDenom: "IRIS",
                coinMinimalDenom: "uiris",
                coinDecimals: 6,
                coinGeckoId: "iris",
            },
        ],
        coinType: 556,
        features: ["stargate", "ibc-transfer"],
    },
};
//# sourceMappingURL=iris-mainnet.js.map