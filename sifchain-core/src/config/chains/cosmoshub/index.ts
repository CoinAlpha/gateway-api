import { NetworkEnv } from "../../getEnv";
import { COSMOSHUB_TESTNET } from "./cosmoshub-testnet";
import { NetEnvChainConfigLookup } from "../NetEnvChainConfigLookup";
import { COSMOSHUB_MAINNET } from "./cosmoshub-mainnet";

export default <NetEnvChainConfigLookup>{
  [NetworkEnv.LOCALNET]: COSMOSHUB_TESTNET,
  [NetworkEnv.TESTNET_042_IBC]: COSMOSHUB_TESTNET,
  [NetworkEnv.DEVNET_042]: COSMOSHUB_TESTNET,
  [NetworkEnv.DEVNET]: COSMOSHUB_TESTNET,
  [NetworkEnv.TESTNET]: COSMOSHUB_TESTNET,
  [NetworkEnv.MAINNET]: COSMOSHUB_MAINNET,
};
