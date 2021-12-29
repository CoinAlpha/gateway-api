"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.REGEN_MAINNET = void 0;
const entities_1 = require("../../../entities");
exports.REGEN_MAINNET = {
    chainType: "ibc",
    network: entities_1.Network.REGEN,
    displayName: "Regen",
    blockExplorerUrl: "https://regen.aneka.io/",
    nativeAssetSymbol: "uregen",
    chainId: "regen-1",
    rpcUrl: "https://regen.stakesystems.io:2053",
    restUrl: "https://proxies.sifchain.finance/api/regen-1/rest",
    keplrChainInfo: {
        rpc: "https://regen.stakesystems.io:2053",
        rest: "https://proxies.sifchain.finance/api/regen-1/rest",
        chainId: "regen-1",
        chainName: "Regen",
        stakeCurrency: {
            coinDenom: "REGEN",
            coinMinimalDenom: "uregen",
            coinDecimals: 6,
            coinGeckoId: "regen",
        },
        walletUrl: "https://wallet.keplr.app/#/cosmoshub/stake",
        walletUrlForStaking: "https://wallet.keplr.app/#/cosmoshub/stake",
        bip44: {
            coinType: 118,
        },
        bech32Config: {
            bech32PrefixAccAddr: "sent",
            bech32PrefixAccPub: "sentpub",
            bech32PrefixValAddr: "sentvaloper",
            bech32PrefixValPub: "sentvaloperpub",
            bech32PrefixConsAddr: "sentvalcons",
            bech32PrefixConsPub: "sentvalconspub",
        },
        currencies: [
            {
                coinDenom: "REGEN",
                coinMinimalDenom: "uregen",
                coinDecimals: 6,
                coinGeckoId: "regen",
            },
        ],
        feeCurrencies: [
            {
                coinDenom: "REGEN",
                coinMinimalDenom: "uregen",
                coinDecimals: 6,
                coinGeckoId: "regen",
            },
        ],
        coinType: 118,
        features: ["stargate", "ibc-transfer"],
    },
};
//# sourceMappingURL=regen-mainnet.js.map