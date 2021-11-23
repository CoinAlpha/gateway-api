import { Network, IBCChainConfig } from "../../../entities";

export const BAND_TESTNET: IBCChainConfig = {
  chainType: "ibc",
  displayName: "Band Protocol",
  blockExplorerUrl: "https://cosmoscan.io/",
  nativeAssetSymbol: "uband",
  network: Network.BAND,
  chainId: "band-laozi-testnet4",
  rpcUrl: "https://proxies.sifchain.finance/api/band-laozi-testnet4/rpc",
  restUrl: "https://proxies.sifchain.finance/api/band-laozi-testnet4/rest",
  keplrChainInfo: {
    rpc: "https://proxies.sifchain.finance/api/band-laozi-testnet4/rpc",
    rest: "https://proxies.sifchain.finance/api/band-laozi-testnet4/rest",
    chainId: "band-laozi-testnet4",
    chainName: "Band Protocol Testnet",
    stakeCurrency: {
      coinDenom: "UBAND",
      coinMinimalDenom: "uband",
      coinDecimals: 6,
      coinGeckoId: "band-protocol",
    },
    walletUrl: "https://wallet.keplr.app/#/band/stake",
    walletUrlForStaking: "https://wallet.keplr.app/#/band/stake",
    bip44: {
      coinType: 118,
    },
    bech32Config: {
      bech32PrefixAccAddr: "band",
      bech32PrefixAccPub: "bandpub",
      bech32PrefixValAddr: "bandvaloper",
      bech32PrefixValPub: "bandvaloperpub",
      bech32PrefixConsAddr: "bandvalcons",
      bech32PrefixConsPub: "bandvalconspub",
    },
    currencies: [
      {
        coinDenom: "UBAND",
        coinMinimalDenom: "uband",
        coinDecimals: 6,
        coinGeckoId: "band-protocol",
      },
    ],
    feeCurrencies: [
      {
        coinDenom: "UBAND",
        coinMinimalDenom: "uband",
        coinDecimals: 6,
        coinGeckoId: "band-protocol",
      },
    ],
    coinType: 118,
    features: ["stargate", "ibc-transfer"],
  },
};
