import { Network, IBCChainConfig } from "../../../entities";

export const EMONEY_MAINNET: IBCChainConfig = {
  chainType: "ibc",
  network: Network.EMONEY,
  displayName: "e-Money",
  blockExplorerUrl: "https://emoney.bigdipper.live",
  nativeAssetSymbol: "ungm",
  chainId: "emoney-3",
  rpcUrl: "https://proxies.sifchain.finance/api/emoney-3/rpc",
  restUrl: "https://proxies.sifchain.finance/api/emoney-3/rest",
  keplrChainInfo: {
    rpc: "https://proxies.sifchain.finance/api/emoney-3/rpc",
    rest: "https://proxies.sifchain.finance/api/emoney-3/rest",
    chainId: "emoney-3",
    chainName: "e-Money",
    stakeCurrency: {
      coinDenom: "NGM",
      coinMinimalDenom: "ungm",
      coinDecimals: 6,
      coinGeckoId: "e-money",
    },
    walletUrl: "https://wallet.keplr.app/#/emoney/stake",
    walletUrlForStaking: "https://wallet.keplr.app/#/emoney/stake",
    bip44: {
      coinType: 118,
    },
    bech32Config: {
      bech32PrefixAccAddr: "emoney",
      bech32PrefixAccPub: "emoneypub",
      bech32PrefixValAddr: "emoneyvaloper",
      bech32PrefixValPub: "emoneyvaloperpub",
      bech32PrefixConsAddr: "emoneyvalcons",
      bech32PrefixConsPub: "emoneyvalconspub",
    },
    currencies: [
      {
        coinDenom: "NGM",
        coinMinimalDenom: "ungm",
        coinDecimals: 6,
        coinGeckoId: "e-money",
      },
    ],
    feeCurrencies: [
      {
        coinDenom: "NGM",
        coinMinimalDenom: "ungm",
        coinDecimals: 6,
        coinGeckoId: "e-money",
      },
    ],
    coinType: 118,
    features: ["stargate", "ibc-transfer"],
  },
};
