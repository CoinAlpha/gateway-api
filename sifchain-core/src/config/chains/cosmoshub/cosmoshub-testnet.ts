import { Network, IBCChainConfig } from "../../../entities";

export const COSMOSHUB_TESTNET: IBCChainConfig = {
  network: Network.COSMOSHUB,
  chainType: "ibc",
  displayName: "Cosmoshub",
  blockExplorerUrl: "https://mintscan.io/cosmos",
  nativeAssetSymbol: "uphoton",
  chainId: "cosmoshub-testnet",
  rpcUrl: "https://proxies.sifchain.finance/api/cosmoshub-testnet/rpc",
  restUrl: "https://proxies.sifchain.finance/api/cosmoshub-testnet/rest",
  keplrChainInfo: {
    rpc: "https://proxies.sifchain.finance/api/cosmoshub-testnet/rpc",
    rest: "https://proxies.sifchain.finance/api/cosmoshub-testnet/rest",
    chainId: "cosmoshub-testnet",
    chainName: "Cosmos Testnet",
    stakeCurrency: {
      coinDenom: "PHOTON",
      coinMinimalDenom: "uphoton",
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
        coinDenom: "PHOTON",
        coinMinimalDenom: "uphoton",
        coinDecimals: 6,
        coinGeckoId: "cosmos",
      },
    ],
    feeCurrencies: [
      {
        coinDenom: "PHOTON",
        coinMinimalDenom: "uphoton",
        coinDecimals: 6,
        coinGeckoId: "cosmos",
      },
    ],
    coinType: 118,
    features: ["stargate", "ibc-transfer"],
  },
};
