import { NetworkEnv } from "../../getEnv";
import { NetEnvChainConfigLookup } from "../NetEnvChainConfigLookup";
import { OSMOSIS_MAINNET } from "./osmosis-mainnet";

export default <NetEnvChainConfigLookup>{
  [NetworkEnv.LOCALNET]: OSMOSIS_MAINNET,
  [NetworkEnv.TESTNET_042_IBC]: OSMOSIS_MAINNET,
  [NetworkEnv.DEVNET_042]: OSMOSIS_MAINNET,
  [NetworkEnv.DEVNET_042]: OSMOSIS_MAINNET,
  [NetworkEnv.DEVNET]: OSMOSIS_MAINNET,
  [NetworkEnv.TESTNET]: OSMOSIS_MAINNET,
  [NetworkEnv.MAINNET]: OSMOSIS_MAINNET,
};
