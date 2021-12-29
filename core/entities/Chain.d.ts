import { IAsset } from "../";
import { Network } from "./Network";
import { ChainsService } from "../services/ChainsService";
import { ChainInfo } from "@keplr-wallet/types";
export declare const getChainsService: () => ChainsService;
export declare const setChainsService: (c: ChainsService) => ChainsService;
export declare type BaseChainConfig = {
    network: Network;
    hidden?: boolean;
    chainId: string;
    displayName: string;
    blockExplorerUrl: string;
    nativeAssetSymbol: string;
    underMaintenance?: boolean;
};
export declare type EthChainConfig = BaseChainConfig & {
    chainType: "eth";
    blockExplorerApiUrl: string;
};
export declare type IBCChainConfig = BaseChainConfig & {
    chainType: "ibc";
    rpcUrl: string;
    restUrl: string;
    keplrChainInfo: ChainInfo;
};
export declare type ChainConfig = IBCChainConfig | EthChainConfig;
export declare type NetworkChainConfigLookup = Record<Network, ChainConfig>;
export interface Chain {
    chainConfig: ChainConfig;
    network: Network;
    displayName: string;
    nativeAsset: IAsset;
    assets: IAsset[];
    assetMap: Map<string, IAsset>;
    lookupAsset(symbol: string): IAsset | undefined;
    lookupAssetOrThrow(symbol: string): IAsset;
    findAssetWithLikeSymbol(symbol: string): IAsset | undefined;
    findAssetWithLikeSymbolOrThrow(symbol: string): IAsset;
    getBlockExplorerUrlForTxHash(hash: string): string;
    getBlockExplorerUrlForAddress(hash: string): string;
}
