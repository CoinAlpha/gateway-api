import { Network, IBCChainConfig } from "../../../entities";

export const IXO_MAINNET: IBCChainConfig = {
  chainType: "ibc",
  network: Network.IXO,
  displayName: "IXO",
  blockExplorerUrl: "https://proxies.sifchain.finance/api/impacthub-3/rest",
  nativeAssetSymbol: "uixo",
  chainId: "impacthub-3",
  rpcUrl: "https://proxies.sifchain.finance/api/impacthub-3/rpc",
  restUrl: "https://proxies.sifchain.finance/api/impacthub-3/rest",
  keplrChainInfo: {
    rpc: "https://rpc-impacthub.keplr.app",
    rest: "https://lcd-impacthub.keplr.app",
    chainId: "impacthub-3",
    chainName: "ixo",
    stakeCurrency: {
      coinDenom: "IXO",
      coinMinimalDenom: "uixo",
      coinDecimals: 6,
      // coinImageUrl: "https://dhj8dql1kzq2v.cloudfront.net/white/ixo.png",
    },
    walletUrl:
      process.env.NODE_ENV === "production"
        ? "https://wallet.keplr.app/#/ixo/stake"
        : "http://localhost:8081/#/ixo/stake",
    walletUrlForStaking:
      process.env.NODE_ENV === "production"
        ? "https://wallet.keplr.app/#/ixo/stake"
        : "http://localhost:8081/#/ixo/stake",
    bip44: {
      coinType: 118,
    },
    bech32Config: {
      bech32PrefixAccAddr: "ixo",
      bech32PrefixAccPub: "ixopub",
      bech32PrefixValAddr: "ixovaloper",
      bech32PrefixValPub: "ixovaloperpub",
      bech32PrefixConsAddr: "ixovalcons",
      bech32PrefixConsPub: "ixovalconspub",
    },
    currencies: [
      {
        coinDenom: "IXO",
        coinMinimalDenom: "uixo",
        coinDecimals: 6,
        // coinImageUrl: "https://dhj8dql1kzq2v.cloudfront.net/white/ixo.png",
      },
    ],
    feeCurrencies: [
      {
        coinDenom: "IXO",
        coinMinimalDenom: "uixo",
        coinDecimals: 6,
        // coinImageUrl: "https://dhj8dql1kzq2v.cloudfront.net/white/ixo.png",
      },
    ],
    // chainSymbolImageUrl: "https://dhj8dql1kzq2v.cloudfront.net/white/ixo.png",
    features: ["stargate", "ibc-transfer"],
  },
};
