import { NetworkEnv } from "../../getEnv";
import { NetEnvChainConfigLookup } from "../NetEnvChainConfigLookup";
import { REGEN_MAINNET } from "./regen-mainnet";

export default <NetEnvChainConfigLookup>{
  [NetworkEnv.LOCALNET]: REGEN_MAINNET,
  [NetworkEnv.TESTNET_042_IBC]: REGEN_MAINNET,
  [NetworkEnv.DEVNET_042]: REGEN_MAINNET,
  [NetworkEnv.DEVNET_042]: REGEN_MAINNET,
  [NetworkEnv.DEVNET]: REGEN_MAINNET,
  [NetworkEnv.TESTNET]: REGEN_MAINNET,
  [NetworkEnv.MAINNET]: REGEN_MAINNET,
};
