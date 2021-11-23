import { NetworkEnv } from "../../getEnv";
import { NetEnvChainConfigLookup } from "../NetEnvChainConfigLookup";
import { JUNO_MAINNET } from "./juno-mainnet";

export default <NetEnvChainConfigLookup>{
  [NetworkEnv.LOCALNET]: JUNO_MAINNET,
  [NetworkEnv.TESTNET_042_IBC]: JUNO_MAINNET,
  [NetworkEnv.DEVNET_042]: JUNO_MAINNET,
  [NetworkEnv.DEVNET_042]: JUNO_MAINNET,
  [NetworkEnv.DEVNET]: JUNO_MAINNET,
  [NetworkEnv.TESTNET]: JUNO_MAINNET,
  [NetworkEnv.MAINNET]: JUNO_MAINNET,
};
