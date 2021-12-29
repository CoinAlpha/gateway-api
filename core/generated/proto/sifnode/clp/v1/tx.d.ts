import Long from "long";
import _m0 from "protobufjs/minimal";
import { Asset } from "../../../sifnode/clp/v1/types";
export declare const protobufPackage = "sifnode.clp.v1";
export interface MsgRemoveLiquidity {
    signer: string;
    externalAsset?: Asset;
    wBasisPoints: string;
    asymmetry: string;
}
export interface MsgRemoveLiquidityResponse {
}
export interface MsgCreatePool {
    signer: string;
    externalAsset?: Asset;
    nativeAssetAmount: string;
    externalAssetAmount: string;
}
export interface MsgCreatePoolResponse {
}
export interface MsgAddLiquidity {
    signer: string;
    externalAsset?: Asset;
    nativeAssetAmount: string;
    externalAssetAmount: string;
}
export interface MsgAddLiquidityResponse {
}
export interface MsgSwap {
    signer: string;
    sentAsset?: Asset;
    receivedAsset?: Asset;
    sentAmount: string;
    minReceivingAmount: string;
}
export interface MsgSwapResponse {
}
export interface MsgDecommissionPool {
    signer: string;
    symbol: string;
}
export interface MsgDecommissionPoolResponse {
}
export declare const MsgRemoveLiquidity: {
    encode(message: MsgRemoveLiquidity, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): MsgRemoveLiquidity;
    fromJSON(object: any): MsgRemoveLiquidity;
    toJSON(message: MsgRemoveLiquidity): unknown;
    fromPartial(object: DeepPartial<MsgRemoveLiquidity>): MsgRemoveLiquidity;
};
export declare const MsgRemoveLiquidityResponse: {
    encode(_: MsgRemoveLiquidityResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): MsgRemoveLiquidityResponse;
    fromJSON(_: any): MsgRemoveLiquidityResponse;
    toJSON(_: MsgRemoveLiquidityResponse): unknown;
    fromPartial(_: DeepPartial<MsgRemoveLiquidityResponse>): MsgRemoveLiquidityResponse;
};
export declare const MsgCreatePool: {
    encode(message: MsgCreatePool, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): MsgCreatePool;
    fromJSON(object: any): MsgCreatePool;
    toJSON(message: MsgCreatePool): unknown;
    fromPartial(object: DeepPartial<MsgCreatePool>): MsgCreatePool;
};
export declare const MsgCreatePoolResponse: {
    encode(_: MsgCreatePoolResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): MsgCreatePoolResponse;
    fromJSON(_: any): MsgCreatePoolResponse;
    toJSON(_: MsgCreatePoolResponse): unknown;
    fromPartial(_: DeepPartial<MsgCreatePoolResponse>): MsgCreatePoolResponse;
};
export declare const MsgAddLiquidity: {
    encode(message: MsgAddLiquidity, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): MsgAddLiquidity;
    fromJSON(object: any): MsgAddLiquidity;
    toJSON(message: MsgAddLiquidity): unknown;
    fromPartial(object: DeepPartial<MsgAddLiquidity>): MsgAddLiquidity;
};
export declare const MsgAddLiquidityResponse: {
    encode(_: MsgAddLiquidityResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): MsgAddLiquidityResponse;
    fromJSON(_: any): MsgAddLiquidityResponse;
    toJSON(_: MsgAddLiquidityResponse): unknown;
    fromPartial(_: DeepPartial<MsgAddLiquidityResponse>): MsgAddLiquidityResponse;
};
export declare const MsgSwap: {
    encode(message: MsgSwap, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): MsgSwap;
    fromJSON(object: any): MsgSwap;
    toJSON(message: MsgSwap): unknown;
    fromPartial(object: DeepPartial<MsgSwap>): MsgSwap;
};
export declare const MsgSwapResponse: {
    encode(_: MsgSwapResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): MsgSwapResponse;
    fromJSON(_: any): MsgSwapResponse;
    toJSON(_: MsgSwapResponse): unknown;
    fromPartial(_: DeepPartial<MsgSwapResponse>): MsgSwapResponse;
};
export declare const MsgDecommissionPool: {
    encode(message: MsgDecommissionPool, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): MsgDecommissionPool;
    fromJSON(object: any): MsgDecommissionPool;
    toJSON(message: MsgDecommissionPool): unknown;
    fromPartial(object: DeepPartial<MsgDecommissionPool>): MsgDecommissionPool;
};
export declare const MsgDecommissionPoolResponse: {
    encode(_: MsgDecommissionPoolResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): MsgDecommissionPoolResponse;
    fromJSON(_: any): MsgDecommissionPoolResponse;
    toJSON(_: MsgDecommissionPoolResponse): unknown;
    fromPartial(_: DeepPartial<MsgDecommissionPoolResponse>): MsgDecommissionPoolResponse;
};
export interface Msg {
    RemoveLiquidity(request: MsgRemoveLiquidity): Promise<MsgRemoveLiquidityResponse>;
    CreatePool(request: MsgCreatePool): Promise<MsgCreatePoolResponse>;
    AddLiquidity(request: MsgAddLiquidity): Promise<MsgAddLiquidityResponse>;
    Swap(request: MsgSwap): Promise<MsgSwapResponse>;
    DecommissionPool(request: MsgDecommissionPool): Promise<MsgDecommissionPoolResponse>;
}
export declare class MsgClientImpl implements Msg {
    private readonly rpc;
    constructor(rpc: Rpc);
    RemoveLiquidity(request: MsgRemoveLiquidity): Promise<MsgRemoveLiquidityResponse>;
    CreatePool(request: MsgCreatePool): Promise<MsgCreatePoolResponse>;
    AddLiquidity(request: MsgAddLiquidity): Promise<MsgAddLiquidityResponse>;
    Swap(request: MsgSwap): Promise<MsgSwapResponse>;
    DecommissionPool(request: MsgDecommissionPool): Promise<MsgDecommissionPoolResponse>;
}
interface Rpc {
    request(service: string, method: string, data: Uint8Array): Promise<Uint8Array>;
}
declare type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined | Long;
export declare type DeepPartial<T> = T extends Builtin ? T : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : T extends {} ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : Partial<T>;
export {};
