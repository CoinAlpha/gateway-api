import { Network, IBCChainConfig } from "../../../entities";

export const OSMOSIS_MAINNET: IBCChainConfig = {
  chainType: "ibc",
  network: Network.OSMOSIS,
  displayName: "Osmosis",
  blockExplorerUrl: "https://www.mintscan.io/osmosis",
  nativeAssetSymbol: "uosmo",
  chainId: "osmosis-1",
  rpcUrl: "https://rpc-osmosis.keplr.app",
  restUrl: "https://lcd-osmosis.keplr.app",
  keplrChainInfo: {
    rpc: "https://rpc-osmosis.keplr.app",
    rest: "https://lcd-osmosis.keplr.app",
    chainId: "osmosis-1",
    chainName: "Osmosis",
    stakeCurrency: {
      coinDenom: "OSMO",
      coinMinimalDenom: "uosmo",
      coinDecimals: 6,
      coinGeckoId: "osmosis",
    },
    walletUrl: "https://wallet.keplr.app/#/osmosis/stake",
    walletUrlForStaking: "https://wallet.keplr.app/#/cosmoshub/stake",
    bip44: {
      coinType: 118,
    },
    bech32Config: {
      bech32PrefixAccAddr: "osmo",
      bech32PrefixAccPub: "osmopub",
      bech32PrefixValAddr: "osmovaloper",
      bech32PrefixValPub: "osmovaloperpub",
      bech32PrefixConsAddr: "osmovalcons",
      bech32PrefixConsPub: "osmovalconspub",
    },
    currencies: [
      {
        coinDenom: "OSMO",
        coinMinimalDenom: "uosmo",
        coinDecimals: 6,
        coinGeckoId: "osmosis",
      },
    ],
    feeCurrencies: [
      {
        coinDenom: "OSMO",
        coinMinimalDenom: "uosmo",
        coinDecimals: 6,
        coinGeckoId: "osmosis",
      },
    ],
    coinType: 118,
    features: ["stargate", "ibc-transfer"],
  },
};
