import Long from "long";
import _m0 from "protobufjs/minimal";
export declare const protobufPackage = "sifnode.clp.v1";
export interface Asset {
    symbol: string;
}
export interface Pool {
    externalAsset?: Asset;
    nativeAssetBalance: string;
    externalAssetBalance: string;
    poolUnits: string;
}
export interface LiquidityProvider {
    asset?: Asset;
    liquidityProviderUnits: string;
    liquidityProviderAddress: string;
}
export interface WhiteList {
    validatorList: string[];
}
export interface LiquidityProviderData {
    liquidityProvider?: LiquidityProvider;
    nativeAssetBalance: string;
    externalAssetBalance: string;
}
export declare const Asset: {
    encode(message: Asset, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): Asset;
    fromJSON(object: any): Asset;
    toJSON(message: Asset): unknown;
    fromPartial(object: DeepPartial<Asset>): Asset;
};
export declare const Pool: {
    encode(message: Pool, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): Pool;
    fromJSON(object: any): Pool;
    toJSON(message: Pool): unknown;
    fromPartial(object: DeepPartial<Pool>): Pool;
};
export declare const LiquidityProvider: {
    encode(message: LiquidityProvider, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): LiquidityProvider;
    fromJSON(object: any): LiquidityProvider;
    toJSON(message: LiquidityProvider): unknown;
    fromPartial(object: DeepPartial<LiquidityProvider>): LiquidityProvider;
};
export declare const WhiteList: {
    encode(message: WhiteList, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): WhiteList;
    fromJSON(object: any): WhiteList;
    toJSON(message: WhiteList): unknown;
    fromPartial(object: DeepPartial<WhiteList>): WhiteList;
};
export declare const LiquidityProviderData: {
    encode(message: LiquidityProviderData, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): LiquidityProviderData;
    fromJSON(object: any): LiquidityProviderData;
    toJSON(message: LiquidityProviderData): unknown;
    fromPartial(object: DeepPartial<LiquidityProviderData>): LiquidityProviderData;
};
declare type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined | Long;
export declare type DeepPartial<T> = T extends Builtin ? T : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : T extends {} ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : Partial<T>;
export {};
