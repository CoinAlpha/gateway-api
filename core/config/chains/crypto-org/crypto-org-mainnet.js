"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CRYPTO_ORG_MAINNET = void 0;
const entities_1 = require("../../../entities");
exports.CRYPTO_ORG_MAINNET = {
    chainType: "ibc",
    network: entities_1.Network.CRYPTO_ORG,
    displayName: "Crypto.org",
    blockExplorerUrl: "https://crypto.org/explorer/",
    nativeAssetSymbol: "basecro",
    chainId: "crypto-org-chain-mainnet-1",
    rpcUrl: "https://proxies.sifchain.finance/api/crypto-org-chain-mainnet-1/rpc",
    restUrl: "https://proxies.sifchain.finance/api/crypto-org-chain-mainnet-1/rest",
    keplrChainInfo: {
        rpc: "https://proxies.sifchain.finance/api/crypto-org-chain-mainnet-1/rpc",
        rest: "https://proxies.sifchain.finance/api/crypto-org-chain-mainnet-1/rest",
        chainId: "crypto-org-chain-mainnet-1",
        chainName: "Sentinel",
        stakeCurrency: {
            coinDenom: "basecro",
            coinMinimalDenom: "basecro",
            coinDecimals: 8,
            coinGeckoId: "crypto-com-coin",
        },
        walletUrl: "https://wallet.keplr.app/#/crytpo-org/stake",
        walletUrlForStaking: "https://wallet.keplr.app/#/crypto-org/stake",
        bip44: {
            coinType: 118,
        },
        bech32Config: {
            bech32PrefixAccAddr: "cro",
            bech32PrefixAccPub: "cropub",
            bech32PrefixValAddr: "crovaloper",
            bech32PrefixValPub: "crovaloperpub",
            bech32PrefixConsAddr: "crovalcons",
            bech32PrefixConsPub: "crovalconspub",
        },
        currencies: [
            {
                coinDenom: "basecro",
                coinMinimalDenom: "basecro",
                coinDecimals: 8,
                coinGeckoId: "crypto-com-coin",
            },
        ],
        feeCurrencies: [
            {
                coinDenom: "basecro",
                coinMinimalDenom: "basecro",
                coinDecimals: 8,
                coinGeckoId: "crypto-com-coin",
            },
        ],
        coinType: 118,
        features: ["stargate", "ibc-transfer"],
    },
};
//# sourceMappingURL=crypto-org-mainnet.js.map