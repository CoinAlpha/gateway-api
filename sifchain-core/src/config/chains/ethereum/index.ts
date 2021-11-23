import { NetworkEnv } from "../../getEnv";
import { NetEnvChainConfigLookup } from "../NetEnvChainConfigLookup";
import { ETHEREUM_TESTNET } from "./ethereum-testnet";
import { ETHEREUM_MAINNET } from "./ethereum-mainnet";

export default <NetEnvChainConfigLookup>{
  [NetworkEnv.TESTNET_042_IBC]: ETHEREUM_TESTNET,
  [NetworkEnv.DEVNET_042]: ETHEREUM_TESTNET,
  [NetworkEnv.DEVNET]: ETHEREUM_TESTNET,
  [NetworkEnv.TESTNET]: ETHEREUM_TESTNET,
  [NetworkEnv.MAINNET]: ETHEREUM_MAINNET,
};
