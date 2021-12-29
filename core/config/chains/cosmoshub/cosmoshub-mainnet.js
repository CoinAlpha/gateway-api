"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.COSMOSHUB_MAINNET = void 0;
const entities_1 = require("../../../entities");
exports.COSMOSHUB_MAINNET = {
    network: entities_1.Network.COSMOSHUB,
    chainType: "ibc",
    displayName: "Cosmoshub",
    blockExplorerUrl: "https://mintscan.io/cosmos",
    nativeAssetSymbol: "uatom",
    chainId: "cosmoshub-4",
    rpcUrl: "https://proxies.sifchain.finance/api/cosmoshub-4/rpc",
    restUrl: "https://proxies.sifchain.finance/api/cosmoshub-4/rest",
    keplrChainInfo: {
        rpc: "https://proxies.sifchain.finance/api/cosmoshub-4/rpc",
        rest: "https://proxies.sifchain.finance/api/cosmoshub-4/rest",
        chainId: "cosmoshub-4",
        chainName: "Cosmos",
        stakeCurrency: {
            coinDenom: "ATOM",
            coinMinimalDenom: "uatom",
            coinDecimals: 6,
            coinGeckoId: "cosmos",
        },
        walletUrl: "https://wallet.keplr.app/#/cosmoshub/stake",
        walletUrlForStaking: "https://wallet.keplr.app/#/cosmoshub/stake",
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
                coinDenom: "ATOM",
                coinMinimalDenom: "uatom",
                coinDecimals: 6,
                coinGeckoId: "cosmos",
            },
        ],
        feeCurrencies: [
            {
                coinDenom: "ATOM",
                coinMinimalDenom: "uatom",
                coinDecimals: 6,
                coinGeckoId: "cosmos",
            },
        ],
        coinType: 118,
        features: ["stargate", "ibc-transfer"],
    },
};
//# sourceMappingURL=cosmoshub-mainnet.js.map