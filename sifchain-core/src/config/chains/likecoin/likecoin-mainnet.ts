import { Network, IBCChainConfig } from "../../../entities";

export const LIKECOIN_MAINNET: IBCChainConfig = {
  network: Network.LIKECOIN,
  chainType: "ibc",
  displayName: "LikeCoin",
  blockExplorerUrl: "https://likecoin.bigdipper.live/",
  nativeAssetSymbol: "nanolike",
  chainId: "likecoin-mainnet-2",
  rpcUrl: "https://proxies.sifchain.finance/api/likecoin-mainnet-2/rpc",
  restUrl: "https://proxies.sifchain.finance/api/likecoin-mainnet-2/rest",
  keplrChainInfo: {
    chainId: "likecoin-mainnet-2",
    chainName: "LikeCoin",
    rpc: "https://proxies.sifchain.finance/api/likecoin-mainnet-2/rpc",
    rest: "https://proxies.sifchain.finance/api/likecoin-mainnet-2/rest",
    stakeCurrency: {
      coinDenom: "LIKE",
      coinMinimalDenom: "nanolike",
      coinDecimals: 9,
      coinGeckoId: "likecoin",
    },
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
        coinDenom: "LIKE",
        coinMinimalDenom: "nanolike",
        coinDecimals: 9,
        coinGeckoId: "likecoin",
      },
    ],
    feeCurrencies: [
      {
        coinDenom: "LIKE",
        coinMinimalDenom: "nanolike",
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
