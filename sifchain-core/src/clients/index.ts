import {
  SifchainChain,
  EthereumChain,
  CosmoshubChain,
  AkashChain,
  IrisChain,
  SentinelChain,
  CryptoOrgChain,
  PersistenceChain,
  RegenChain,
  OsmosisChain,
  TerraChain,
  JunoChain,
  IxoChain,
  BandChain,
  LikecoinChain,
} from "@sifchain/sdk/clients/chains";
import {Network} from "..";

export const networkChainCtorLookup = {
  [Network.SIFCHAIN]: SifchainChain,
  [Network.ETHEREUM]: EthereumChain,
  [Network.COSMOSHUB]: CosmoshubChain,
  [Network.IRIS]: IrisChain,
  [Network.AKASH]: AkashChain,
  [Network.SENTINEL]: SentinelChain,
  [Network.CRYPTO_ORG]: CryptoOrgChain,
  [Network.PERSISTENCE]: PersistenceChain,
  [Network.REGEN]: RegenChain,
  [Network.OSMOSIS]: OsmosisChain,
  [Network.TERRA]: TerraChain,
  [Network.JUNO]: JunoChain,
  [Network.IXO]: IxoChain,
  [Network.BAND]: BandChain,
  [Network.LIKECOIN]: LikecoinChain,
};

export * from "./chains";
export * from "./native";
