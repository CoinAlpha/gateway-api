import {
  IAsset,
  Chain,
  Network,
  setChainsService,
  NetworkChainConfigLookup,
} from "../../entities";
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
  EmoneyChain,
} from "../../clients/chains";

export * from "../../clients/chains";

export type ChainsServiceContext = {
  assets: IAsset[];
  chainConfigsByNetwork: NetworkChainConfigLookup;
};

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
  [Network.EMONEY]: EmoneyChain,
};

export class ChainsService {
  private _list: Chain[] = [];
  private map: Map<Network, Chain> = new Map();

  addChain(chain: Chain) {
    this._list.push(chain);
    this.map.set(chain.network, chain);
  }

  findChainAssetMatch(match: Partial<IAsset>) {
    const matchKeys = Object.keys(match) as Array<keyof IAsset>;
    let chain, asset: IAsset;
    for (chain of this.list()) {
      for (asset of chain.assets) {
        const isMatch = matchKeys.every((key) => asset[key] === match[key]);
        if (isMatch) return { asset, chain };
      }
    }
  }
  findChainAssetMatchOrThrow(
    match: Partial<IAsset>,
  ): {
    chain: Chain;
    asset: IAsset;
  } {
    const result = this.findChainAssetMatch(match);
    if (!result) {
      throw new Error(
        `No matching chain + asset found for ${JSON.stringify(match)}`,
      );
    }
    return result;
  }

  constructor(private context: ChainsServiceContext) {
    Object.keys(networkChainCtorLookup).forEach((network) => {
      const n = network as Network;
      this.addChain(
        new networkChainCtorLookup[n]({
          assets: this.context.assets,
          chainConfig: this.context.chainConfigsByNetwork[n],
        }),
      );
    });
    setChainsService(this);
  }

  // returns array of chains
  list() {
    return this._list;
  }
  get(network: Network): Chain {
    const chain = this.map.get(network);
    if (!chain) throw new Error("Chain not found for " + network);
    return chain;
  }

  get nativeChain() {
    return this.get(Network.SIFCHAIN);
  }
}

export default function createChainsService(c: ChainsServiceContext) {
  return new ChainsService(c);
}
