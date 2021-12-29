"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LIKECOIN_TESTNET = void 0;
const entities_1 = require("../../../entities");
exports.LIKECOIN_TESTNET = {
    network: entities_1.Network.LIKECOIN,
    chainType: "ibc",
    displayName: "LikeCoin",
    blockExplorerUrl: "https://testnet.likecoin.bigdipper.live/",
    nativeAssetSymbol: "nanoekil",
    chainId: "likecoin-public-testnet-3",
    rpcUrl: "https://proxies.sifchain.finance/api/likecoin-public-testnet-3/rpc",
    restUrl: "https://proxies.sifchain.finance/api/likecoin-public-testnet-3/rest",
    keplrChainInfo: {
        rpc: "https://proxies.sifchain.finance/api/likecoin-public-testnet-3/rpc",
        rest: "https://proxies.sifchain.finance/api/likecoin-public-testnet-3/rest",
        chainId: "likecoin-public-testnet-3",
        chainName: "LikeCoin Testnet",
        stakeCurrency: {
            coinDenom: "EKIL",
            coinMinimalDenom: "nanoekil",
            coinDecimals: 9,
            coinGeckoId: "likecoin",
        },
        walletUrl: "https://stake.like.co",
        walletUrlForStaking: "https://stake.like.co",
        bip44: {
            coinType: 118,
        },
        bech32Config: {
            bech32PrefixAccAddr: "cosmos",
            bech32PrefixAccPub: "cosmospub",
            bech32PrefixValAddr: "cosmosvaloper",
            bech32PrefixValPub: "cosmosvaloperpub",
            bech32PrefixConsAddr: "cosmosvalcons",
            bech32PrefixConsPub: "cosmosvalconspub",
        },
        currencies: [
            {
                coinDenom: "EKIL",
                coinMinimalDenom: "nanoekil",
                coinDecimals: 9,
                coinGeckoId: "likecoin",
            },
        ],
        feeCurrencies: [
            {
                coinDenom: "EKIL",
                coinMinimalDenom: "nanoekil",
                coinDecimals: 9,
                coinGeckoId: "likecoin",
            },
        ],
        coinType: 118,
        gasPriceStep: {
            low: 0.01,
            average: 1,
            high: 1000,
        },
        features: ["stargate", "ibc-transfer"],
    },
};
//# sourceMappingURL=likecoin-testnet.js.map