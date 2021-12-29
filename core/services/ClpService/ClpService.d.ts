import { Asset, IAsset, IAssetAmount, LiquidityProvider, Pool } from "../../entities";
import { SifUnSignedClient } from "../utils/SifClient";
import { PoolsRes } from "../../generated/proto/sifnode/clp/v1/querier";
import { LiquidityProviderData } from "../../generated/proto/sifnode/clp/v1/types";
export declare type ClpServiceContext = {
    nativeAsset: IAsset;
    sifApiUrl: string;
    sifRpcUrl: string;
    sifWsUrl: string;
    sifChainId: string;
    sifUnsignedClient?: SifUnSignedClient;
};
declare type IClpService = {
    getRawPools: () => Promise<PoolsRes>;
    getAccountLiquidityProviderData: (params: {
        lpAddress: string;
    }) => Promise<LiquidityProviderData[]>;
    getPools: () => Promise<Pool[]>;
    getPoolSymbolsByLiquidityProvider: (address: string) => Promise<string[]>;
    swap: (params: {
        fromAddress: string;
        sentAmount: IAssetAmount;
        receivedAsset: Asset;
        minimumReceived: IAssetAmount;
    }) => any;
    addLiquidity: (params: {
        fromAddress: string;
        nativeAssetAmount: IAssetAmount;
        externalAssetAmount: IAssetAmount;
    }) => any;
    createPool: (params: {
        fromAddress: string;
        nativeAssetAmount: IAssetAmount;
        externalAssetAmount: IAssetAmount;
    }) => any;
    getLiquidityProvider: (params: {
        asset: IAsset;
        lpAddress: string;
    }) => Promise<LiquidityProvider | null>;
    removeLiquidity: (params: {
        wBasisPoints: string;
        asymmetry: string;
        asset: IAsset;
        fromAddress: string;
    }) => any;
};
export default function createClpService({ sifApiUrl, nativeAsset, sifChainId, sifWsUrl, sifRpcUrl, sifUnsignedClient, }: ClpServiceContext): IClpService;
export {};
