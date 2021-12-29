import Long from "long";
import _m0 from "protobufjs/minimal";
import { Pool, LiquidityProvider, Asset, LiquidityProviderData } from "../../../sifnode/clp/v1/types";
import { PageRequest, PageResponse } from "../../../cosmos/base/query/v1beta1/pagination";
export declare const protobufPackage = "sifnode.clp.v1";
export interface PoolReq {
    symbol: string;
}
export interface PoolRes {
    pool?: Pool;
    clpModuleAddress: string;
    height: Long;
}
export interface PoolsReq {
    pagination?: PageRequest;
}
export interface PoolsRes {
    pools: Pool[];
    clpModuleAddress: string;
    height: Long;
    pagination?: PageResponse;
}
export interface LiquidityProviderReq {
    symbol: string;
    lpAddress: string;
}
export interface LiquidityProviderRes {
    liquidityProvider?: LiquidityProvider;
    nativeAssetBalance: string;
    externalAssetBalance: string;
    height: Long;
}
export interface AssetListReq {
    lpAddress: string;
    pagination?: PageRequest;
}
export interface AssetListRes {
    assets: Asset[];
    height: Long;
    pagination?: PageResponse;
}
export interface LiquidityProviderDataReq {
    lpAddress: string;
    pagination?: PageRequest;
}
export interface LiquidityProviderDataRes {
    liquidityProviderData: LiquidityProviderData[];
    height: Long;
    pagination?: PageRequest;
}
export interface LiquidityProviderListReq {
    symbol: string;
    /** pagination defines an optional pagination for the request. */
    pagination?: PageRequest;
}
export interface LiquidityProviderListRes {
    liquidityProviders: LiquidityProvider[];
    height: Long;
    /** pagination defines the pagination in the response. */
    pagination?: PageResponse;
}
export interface LiquidityProvidersReq {
    pagination?: PageRequest;
}
export interface LiquidityProvidersRes {
    liquidityProviders: LiquidityProvider[];
    height: Long;
    pagination?: PageResponse;
}
export declare const PoolReq: {
    encode(message: PoolReq, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): PoolReq;
    fromJSON(object: any): PoolReq;
    toJSON(message: PoolReq): unknown;
    fromPartial(object: DeepPartial<PoolReq>): PoolReq;
};
export declare const PoolRes: {
    encode(message: PoolRes, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): PoolRes;
    fromJSON(object: any): PoolRes;
    toJSON(message: PoolRes): unknown;
    fromPartial(object: DeepPartial<PoolRes>): PoolRes;
};
export declare const PoolsReq: {
    encode(message: PoolsReq, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): PoolsReq;
    fromJSON(object: any): PoolsReq;
    toJSON(message: PoolsReq): unknown;
    fromPartial(object: DeepPartial<PoolsReq>): PoolsReq;
};
export declare const PoolsRes: {
    encode(message: PoolsRes, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): PoolsRes;
    fromJSON(object: any): PoolsRes;
    toJSON(message: PoolsRes): unknown;
    fromPartial(object: DeepPartial<PoolsRes>): PoolsRes;
};
export declare const LiquidityProviderReq: {
    encode(message: LiquidityProviderReq, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): LiquidityProviderReq;
    fromJSON(object: any): LiquidityProviderReq;
    toJSON(message: LiquidityProviderReq): unknown;
    fromPartial(object: DeepPartial<LiquidityProviderReq>): LiquidityProviderReq;
};
export declare const LiquidityProviderRes: {
    encode(message: LiquidityProviderRes, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): LiquidityProviderRes;
    fromJSON(object: any): LiquidityProviderRes;
    toJSON(message: LiquidityProviderRes): unknown;
    fromPartial(object: DeepPartial<LiquidityProviderRes>): LiquidityProviderRes;
};
export declare const AssetListReq: {
    encode(message: AssetListReq, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): AssetListReq;
    fromJSON(object: any): AssetListReq;
    toJSON(message: AssetListReq): unknown;
    fromPartial(object: DeepPartial<AssetListReq>): AssetListReq;
};
export declare const AssetListRes: {
    encode(message: AssetListRes, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): AssetListRes;
    fromJSON(object: any): AssetListRes;
    toJSON(message: AssetListRes): unknown;
    fromPartial(object: DeepPartial<AssetListRes>): AssetListRes;
};
export declare const LiquidityProviderDataReq: {
    encode(message: LiquidityProviderDataReq, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): LiquidityProviderDataReq;
    fromJSON(object: any): LiquidityProviderDataReq;
    toJSON(message: LiquidityProviderDataReq): unknown;
    fromPartial(object: DeepPartial<LiquidityProviderDataReq>): LiquidityProviderDataReq;
};
export declare const LiquidityProviderDataRes: {
    encode(message: LiquidityProviderDataRes, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): LiquidityProviderDataRes;
    fromJSON(object: any): LiquidityProviderDataRes;
    toJSON(message: LiquidityProviderDataRes): unknown;
    fromPartial(object: DeepPartial<LiquidityProviderDataRes>): LiquidityProviderDataRes;
};
export declare const LiquidityProviderListReq: {
    encode(message: LiquidityProviderListReq, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): LiquidityProviderListReq;
    fromJSON(object: any): LiquidityProviderListReq;
    toJSON(message: LiquidityProviderListReq): unknown;
    fromPartial(object: DeepPartial<LiquidityProviderListReq>): LiquidityProviderListReq;
};
export declare const LiquidityProviderListRes: {
    encode(message: LiquidityProviderListRes, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): LiquidityProviderListRes;
    fromJSON(object: any): LiquidityProviderListRes;
    toJSON(message: LiquidityProviderListRes): unknown;
    fromPartial(object: DeepPartial<LiquidityProviderListRes>): LiquidityProviderListRes;
};
export declare const LiquidityProvidersReq: {
    encode(message: LiquidityProvidersReq, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): LiquidityProvidersReq;
    fromJSON(object: any): LiquidityProvidersReq;
    toJSON(message: LiquidityProvidersReq): unknown;
    fromPartial(object: DeepPartial<LiquidityProvidersReq>): LiquidityProvidersReq;
};
export declare const LiquidityProvidersRes: {
    encode(message: LiquidityProvidersRes, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): LiquidityProvidersRes;
    fromJSON(object: any): LiquidityProvidersRes;
    toJSON(message: LiquidityProvidersRes): unknown;
    fromPartial(object: DeepPartial<LiquidityProvidersRes>): LiquidityProvidersRes;
};
export interface Query {
    GetPool(request: PoolReq): Promise<PoolRes>;
    GetPools(request: PoolsReq): Promise<PoolsRes>;
    GetLiquidityProvider(request: LiquidityProviderReq): Promise<LiquidityProviderRes>;
    GetLiquidityProviderData(request: LiquidityProviderDataReq): Promise<LiquidityProviderDataRes>;
    GetAssetList(request: AssetListReq): Promise<AssetListRes>;
    GetLiquidityProviders(request: LiquidityProvidersReq): Promise<LiquidityProvidersRes>;
    GetLiquidityProviderList(request: LiquidityProviderListReq): Promise<LiquidityProviderListRes>;
}
export declare class QueryClientImpl implements Query {
    private readonly rpc;
    constructor(rpc: Rpc);
    GetPool(request: PoolReq): Promise<PoolRes>;
    GetPools(request: PoolsReq): Promise<PoolsRes>;
    GetLiquidityProvider(request: LiquidityProviderReq): Promise<LiquidityProviderRes>;
    GetLiquidityProviderData(request: LiquidityProviderDataReq): Promise<LiquidityProviderDataRes>;
    GetAssetList(request: AssetListReq): Promise<AssetListRes>;
    GetLiquidityProviders(request: LiquidityProvidersReq): Promise<LiquidityProvidersRes>;
    GetLiquidityProviderList(request: LiquidityProviderListReq): Promise<LiquidityProviderListRes>;
}
interface Rpc {
    request(service: string, method: string, data: Uint8Array): Promise<Uint8Array>;
}
declare type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined | Long;
export declare type DeepPartial<T> = T extends Builtin ? T : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : T extends {} ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : Partial<T>;
export {};
