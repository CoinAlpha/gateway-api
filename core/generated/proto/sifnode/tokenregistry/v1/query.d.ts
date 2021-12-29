import Long from "long";
import _m0 from "protobufjs/minimal";
import { Registry } from "../../../sifnode/tokenregistry/v1/types";
export declare const protobufPackage = "sifnode.tokenregistry.v1";
export interface QueryEntriesResponse {
    registry?: Registry;
}
export interface QueryEntriesRequest {
}
export declare const QueryEntriesResponse: {
    encode(message: QueryEntriesResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): QueryEntriesResponse;
    fromJSON(object: any): QueryEntriesResponse;
    toJSON(message: QueryEntriesResponse): unknown;
    fromPartial(object: DeepPartial<QueryEntriesResponse>): QueryEntriesResponse;
};
export declare const QueryEntriesRequest: {
    encode(_: QueryEntriesRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): QueryEntriesRequest;
    fromJSON(_: any): QueryEntriesRequest;
    toJSON(_: QueryEntriesRequest): unknown;
    fromPartial(_: DeepPartial<QueryEntriesRequest>): QueryEntriesRequest;
};
/** Query defines the gRPC querier service. */
export interface Query {
    Entries(request: QueryEntriesRequest): Promise<QueryEntriesResponse>;
}
export declare class QueryClientImpl implements Query {
    private readonly rpc;
    constructor(rpc: Rpc);
    Entries(request: QueryEntriesRequest): Promise<QueryEntriesResponse>;
}
interface Rpc {
    request(service: string, method: string, data: Uint8Array): Promise<Uint8Array>;
}
declare type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined | Long;
export declare type DeepPartial<T> = T extends Builtin ? T : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : T extends {} ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : Partial<T>;
export {};
