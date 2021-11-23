import { Network, IBCChainConfig } from "../../../entities";

export const TERRA_MAINNET: IBCChainConfig = {
  network: Network.TERRA,
  chainType: "ibc",
  displayName: "Terra",
  underMaintenance: true,
  blockExplorerUrl: "https://terra.stake.id/",
  nativeAssetSymbol: "uluna",
  chainId: "columbus-5",
  rpcUrl: "https://proxies.sifchain.finance/api/columbus-5/rpc",
  restUrl: "https://proxies.sifchain.finance/api/columbus-5/rest",
  keplrChainInfo: {
    rpc: "https://proxies.sifchain.finance/api/columbus-5/rpc",
    rest: "https://proxies.sifchain.finance/api/columbus-5/rest",
    chainId: "columbus-5",
    chainName: "Terra Network",
    stakeCurrency: {
      coinDenom: "LUNA",
      coinMinimalDenom: "uluna",
      coinDecimals: 6,
      coinGeckoId: "terra-luna",
    },
    walletUrl: "https://wallet.keplr.app/#/terra/stake",
    walletUrlForStaking: "https://wallet.keplr.app/#/terra/stake",
    bip44: {
      coinType: 118,
    },
    bech32Config: {
      bech32PrefixAccAddr: "terra",
      bech32PrefixAccPub: "terrapub",
      bech32PrefixValAddr: "terravaloper",
      bech32PrefixValPub: "terravaloperpub",
      bech32PrefixConsAddr: "terravalcons",
      bech32PrefixConsPub: "terravalconspub",
    },
    currencies: [
      {
        coinDenom: "LUNA",
        coinMinimalDenom: "uluna",
        coinDecimals: 6,
        coinGeckoId: "terra-luna",
      },
    ],
    feeCurrencies: [
      {
        coinDenom: "LUNA",
        coinMinimalDenom: "uluna",
        coinDecimals: 6,
        coinGeckoId: "terra-luna",
      },
    ],
    coinType: 118,
    features: ["stargate", "ibc-transfer"],
  },
};
