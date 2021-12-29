import Long from "long";
import _m0 from "protobufjs/minimal";
import { Status } from "../../../sifnode/oracle/v1/types";
import { EthBridgeClaim } from "../../../sifnode/ethbridge/v1/types";
export declare const protobufPackage = "sifnode.ethbridge.v1";
/** QueryEthProphecyRequest payload for EthProphecy rpc query */
export interface QueryEthProphecyRequest {
    ethereumChainId: Long;
    /** bridge_contract_address is an EthereumAddress */
    bridgeContractAddress: string;
    nonce: Long;
    symbol: string;
    /** token_contract_address is an EthereumAddress */
    tokenContractAddress: string;
    /** ethereum_sender is an EthereumAddress */
    ethereumSender: string;
}
/** QueryEthProphecyResponse payload for EthProphecy rpc query */
export interface QueryEthProphecyResponse {
    id: string;
    status?: Status;
    claims: EthBridgeClaim[];
}
export declare const QueryEthProphecyRequest: {
    encode(message: QueryEthProphecyRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): QueryEthProphecyRequest;
    fromJSON(object: any): QueryEthProphecyRequest;
    toJSON(message: QueryEthProphecyRequest): unknown;
    fromPartial(object: DeepPartial<QueryEthProphecyRequest>): QueryEthProphecyRequest;
};
export declare const QueryEthProphecyResponse: {
    encode(message: QueryEthProphecyResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): QueryEthProphecyResponse;
    fromJSON(object: any): QueryEthProphecyResponse;
    toJSON(message: QueryEthProphecyResponse): unknown;
    fromPartial(object: DeepPartial<QueryEthProphecyResponse>): QueryEthProphecyResponse;
};
/** Query service for queries */
export interface Query {
    /** EthProphecy queries an EthProphecy */
    EthProphecy(request: QueryEthProphecyRequest): Promise<QueryEthProphecyResponse>;
}
export declare class QueryClientImpl implements Query {
    private readonly rpc;
    constructor(rpc: Rpc);
    EthProphecy(request: QueryEthProphecyRequest): Promise<QueryEthProphecyResponse>;
}
interface Rpc {
    request(service: string, method: string, data: Uint8Array): Promise<Uint8Array>;
}
declare type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined | Long;
export declare type DeepPartial<T> = T extends Builtin ? T : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : T extends {} ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : Partial<T>;
export {};
