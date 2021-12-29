import { IAsset, Chain, Network, NetworkChainConfigLookup } from "../../entities";
import { SifchainChain, EthereumChain, CosmoshubChain, AkashChain, IrisChain, SentinelChain, CryptoOrgChain, PersistenceChain, RegenChain, OsmosisChain, TerraChain, JunoChain, IxoChain, BandChain, LikecoinChain, EmoneyChain } from "../../clients/chains";
export * from "../../clients/chains";
export declare type ChainsServiceContext = {
    assets: IAsset[];
    chainConfigsByNetwork: NetworkChainConfigLookup;
};
export declare const networkChainCtorLookup: {
    sifchain: typeof SifchainChain;
    ethereum: typeof EthereumChain;
    cosmoshub: typeof CosmoshubChain;
    iris: typeof IrisChain;
    akash: typeof AkashChain;
    sentinel: typeof SentinelChain;
    "crypto-org": typeof CryptoOrgChain;
    persistence: typeof PersistenceChain;
    regen: typeof RegenChain;
    osmosis: typeof OsmosisChain;
    terra: typeof TerraChain;
    juno: typeof JunoChain;
    ixo: typeof IxoChain;
    band: typeof BandChain;
    likecoin: typeof LikecoinChain;
    emoney: typeof EmoneyChain;
};
export declare class ChainsService {
    private context;
    private _list;
    private map;
    addChain(chain: Chain): void;
    findChainAssetMatch(match: Partial<IAsset>): {
        asset: IAsset;
        chain: Chain;
    } | undefined;
    findChainAssetMatchOrThrow(match: Partial<IAsset>): {
        chain: Chain;
        asset: IAsset;
    };
    constructor(context: ChainsServiceContext);
    list(): Chain[];
    get(network: Network): Chain;
    get nativeChain(): Chain;
}
export default function createChainsService(c: ChainsServiceContext): ChainsService;
