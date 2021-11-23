import { NetworkEnv } from "../../getEnv";
import { NetEnvChainConfigLookup } from "../NetEnvChainConfigLookup";
import { SIFCHAIN_DEVNET_042 } from "./sifchain-devnet-042";
import { SIFCHAIN_TESTNET_042 } from "./sifchain-testnet-042-ibc";
import { SIFCHAIN_DEVNET } from "./sifchain-devnet";
import { SIFCHAIN_TESTNET } from "./sifchain-testnet";
import { SIFCHAIN_MAINNET } from "./sifchain-mainnet";

export default <NetEnvChainConfigLookup>{
  [NetworkEnv.LOCALNET]: SIFCHAIN_TESTNET_042,
  [NetworkEnv.TESTNET_042_IBC]: SIFCHAIN_TESTNET_042,
  [NetworkEnv.DEVNET_042]: SIFCHAIN_DEVNET_042,
  [NetworkEnv.DEVNET]: SIFCHAIN_DEVNET,
  [NetworkEnv.TESTNET]: SIFCHAIN_TESTNET,
  [NetworkEnv.MAINNET]: SIFCHAIN_MAINNET,
};
