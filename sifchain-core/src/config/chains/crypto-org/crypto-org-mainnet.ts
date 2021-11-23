import { Network, IBCChainConfig } from "../../../entities";

export const CRYPTO_ORG_MAINNET: IBCChainConfig = {
  chainType: "ibc",
  network: Network.CRYPTO_ORG,
  displayName: "Crypto.org",
  blockExplorerUrl: "https://crypto.org/explorer/",
  nativeAssetSymbol: "basecro",
  chainId: "crypto-org-chain-mainnet-1",
  rpcUrl: "https://rpc-crypto-org.keplr.app/",
  restUrl: "https://lcd-crypto-org.keplr.app/",
  keplrChainInfo: {
    rpc: "https://rpc-crypto-org.keplr.app/",
    rest: "https://lcd-crypto-org.keplr.app/",
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
