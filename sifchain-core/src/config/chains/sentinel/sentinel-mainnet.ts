import { Network, IBCChainConfig } from "../../../entities";

export const SENTINEL_MAINNET: IBCChainConfig = {
  chainType: "ibc",
  network: Network.SENTINEL,
  displayName: "Sentinel",
  blockExplorerUrl: "https://explorer.sentinel.co/",
  nativeAssetSymbol: "udvpn",
  chainId: "sentinelhub-2",
  rpcUrl: "https://proxies.sifchain.finance/api/sentinelhub-2/rpc",
  restUrl: "https://proxies.sifchain.finance/api/sentinelhub-2/rest",
  keplrChainInfo: {
    rpc: "https://proxies.sifchain.finance/api/sentinelhub-2/rpc",
    rest: "https://proxies.sifchain.finance/api/sentinelhub-2/rest",
    chainId: "sentinelhub-2",
    chainName: "Sentinel",
    stakeCurrency: {
      coinDenom: "udvpn",
      coinMinimalDenom: "udvpn",
      coinDecimals: 18,
      coinGeckoId: "sentinel",
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
        coinDenom: "udvpn",
        coinMinimalDenom: "udvpn",
        coinDecimals: 18,
        coinGeckoId: "sentinel",
      },
    ],
    feeCurrencies: [
      {
        coinDenom: "udvpn",
        coinMinimalDenom: "udvpn",
        coinDecimals: 18,
        coinGeckoId: "sentinel",
      },
    ],
    coinType: 118,
    features: ["stargate", "ibc-transfer"],
  },
};
