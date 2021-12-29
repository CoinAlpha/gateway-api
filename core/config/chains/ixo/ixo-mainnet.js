"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IXO_MAINNET = void 0;
const entities_1 = require("../../../entities");
exports.IXO_MAINNET = {
    chainType: "ibc",
    network: entities_1.Network.IXO,
    displayName: "IXO",
    blockExplorerUrl: "https://proxies.sifchain.finance/api/impacthub-3/rest",
    nativeAssetSymbol: "uixo",
    chainId: "impacthub-3",
    rpcUrl: "https://proxies.sifchain.finance/api/impacthub-3/rpc",
    restUrl: "https://proxies.sifchain.finance/api/impacthub-3/rest",
    keplrChainInfo: {
        rpc: "https://rpc-impacthub.keplr.app",
        rest: "https://lcd-impacthub.keplr.app",
        chainId: "impacthub-3",
        chainName: "ixo",
        stakeCurrency: {
            coinDenom: "IXO",
            coinMinimalDenom: "uixo",
            coinDecimals: 6,
        },
        walletUrl: process.env.NODE_ENV === "production"
            ? "https://wallet.keplr.app/#/ixo/stake"
            : "http://localhost:8081/#/ixo/stake",
        walletUrlForStaking: process.env.NODE_ENV === "production"
            ? "https://wallet.keplr.app/#/ixo/stake"
            : "http://localhost:8081/#/ixo/stake",
        bip44: {
            coinType: 118,
        },
        bech32Config: {
            bech32PrefixAccAddr: "ixo",
            bech32PrefixAccPub: "ixopub",
            bech32PrefixValAddr: "ixovaloper",
            bech32PrefixValPub: "ixovaloperpub",
            bech32PrefixConsAddr: "ixovalcons",
            bech32PrefixConsPub: "ixovalconspub",
        },
        currencies: [
            {
                coinDenom: "IXO",
                coinMinimalDenom: "uixo",
                coinDecimals: 6,
            },
        ],
        feeCurrencies: [
            {
                coinDenom: "IXO",
                coinMinimalDenom: "uixo",
                coinDecimals: 6,
            },
        ],
        // chainSymbolImageUrl: "https://dhj8dql1kzq2v.cloudfront.net/white/ixo.png",
        features: ["stargate", "ibc-transfer"],
    },
};
//# sourceMappingURL=ixo-mainnet.js.map