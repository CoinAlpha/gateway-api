import Long from "long";
import _m0 from "protobufjs/minimal";
import { Params } from "../../../sifnode/clp/v1/params";
import { Pool, LiquidityProvider } from "../../../sifnode/clp/v1/types";
export declare const protobufPackage = "sifnode.clp.v1";
/**
 * GenesisState - all clp state that must be provided at genesis
 * TODO: Add parameters to Genesis state ,such as minimum liquidity required to
 * create a pool
 */
export interface GenesisState {
    params?: Params;
    addressWhitelist: string[];
    poolList: Pool[];
    liquidityProviders: LiquidityProvider[];
}
export declare const GenesisState: {
    encode(message: GenesisState, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): GenesisState;
    fromJSON(object: any): GenesisState;
    toJSON(message: GenesisState): unknown;
    fromPartial(object: DeepPartial<GenesisState>): GenesisState;
};
declare type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined | Long;
export declare type DeepPartial<T> = T extends Builtin ? T : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : T extends {} ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : Partial<T>;
export {};
