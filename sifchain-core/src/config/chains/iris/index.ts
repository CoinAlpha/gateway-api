import { NetworkEnv } from "../../getEnv";
import { IRIS_TESTNET } from "./iris-testnet";
import { NetEnvChainConfigLookup } from "../NetEnvChainConfigLookup";
import { IRIS_MAINNET } from "./iris-mainnet";

export default <NetEnvChainConfigLookup>{
  [NetworkEnv.LOCALNET]: IRIS_TESTNET,
  [NetworkEnv.TESTNET_042_IBC]: IRIS_TESTNET,
  [NetworkEnv.DEVNET_042]: IRIS_TESTNET,
  [NetworkEnv.DEVNET]: IRIS_TESTNET,
  [NetworkEnv.TESTNET]: IRIS_TESTNET,
  [NetworkEnv.MAINNET]: IRIS_MAINNET,
};
