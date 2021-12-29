"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AKASH_TESTNET = void 0;
const entities_1 = require("../../../entities");
exports.AKASH_TESTNET = {
    network: entities_1.Network.AKASH,
    chainType: "ibc",
    displayName: "Akash",
    blockExplorerUrl: "https://testnet.akash.aneka.io",
    nativeAssetSymbol: "uakt",
    chainId: "akash-testnet-6",
    rpcUrl: "https://proxies.sifchain.finance/api/akash-testnet-6/rpc",
    restUrl: "https://proxies.sifchain.finance/api/akash-testnet-6/rest",
    keplrChainInfo: {
        rpc: "https://proxies.sifchain.finance/api/akash-testnet-6/rpc",
        rest: "https://proxies.sifchain.finance/api/akash-testnet-6/rest",
        chainId: "akash-testnet-6",
        chainName: "Akash Testnet",
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
//# sourceMappingURL=akash-testnet.js.map