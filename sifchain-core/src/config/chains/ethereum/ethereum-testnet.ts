import { EthChainConfig, Network } from "../../../entities";

export const ETHEREUM_TESTNET: EthChainConfig = {
  chainType: "eth",
  chainId: "0x3", // Ropsten
  network: Network.ETHEREUM,
  displayName: "Ethereum",
  blockExplorerUrl: "https://ropsten.etherscan.io",
  blockExplorerApiUrl: "https://api-ropsten.etherscan.io",
  nativeAssetSymbol: "eth",
};
