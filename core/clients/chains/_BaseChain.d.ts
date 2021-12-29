import { Chain, IAsset, Network, ChainConfig } from "../../entities";
export declare type ChainContext = {
    assets: IAsset[];
    chainConfig: ChainConfig;
};
export declare class BaseChain implements Chain {
    context: ChainContext;
    get network(): Network;
    get displayName(): string;
    chainConfig: ChainConfig;
    assets: IAsset[];
    assetMap: Map<string, IAsset>;
    nativeAsset: IAsset;
    constructor(context: ChainContext);
    lookupAsset(symbol: string): IAsset | undefined;
    lookupAssetOrThrow(symbol: string): IAsset;
    findAssetWithLikeSymbol(symbol: string): IAsset | undefined;
    findAssetWithLikeSymbolOrThrow(symbol: string): IAsset;
    getBlockExplorerUrlForTxHash(hash: string): string;
    getBlockExplorerUrlForAddress(address: string): string;
}
