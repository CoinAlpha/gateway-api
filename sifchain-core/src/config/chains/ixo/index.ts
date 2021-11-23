import { NetworkEnv } from "../../getEnv";
import { NetEnvChainConfigLookup } from "../NetEnvChainConfigLookup";
import { IXO_MAINNET } from "./ixo-mainnet";

export default <NetEnvChainConfigLookup>{
  [NetworkEnv.LOCALNET]: IXO_MAINNET,
  [NetworkEnv.TESTNET_042_IBC]: IXO_MAINNET,
  [NetworkEnv.DEVNET_042]: IXO_MAINNET,
  [NetworkEnv.DEVNET_042]: IXO_MAINNET,
  [NetworkEnv.DEVNET]: IXO_MAINNET,
  [NetworkEnv.TESTNET]: IXO_MAINNET,
  [NetworkEnv.MAINNET]: IXO_MAINNET,
};
