import Long from "long";
import _m0 from "protobufjs/minimal";
import { DistributionStatus, DistributionRecords, DistributionType, Distribution, UserClaim } from "../../../sifnode/dispensation/v1/types";
export declare const protobufPackage = "sifnode.dispensation.v1";
export interface QueryAllDistributionsRequest {
}
export interface QueryAllDistributionsResponse {
    distributions: Distribution[];
    height: Long;
}
export interface QueryRecordsByDistributionNameRequest {
    distributionName: string;
    status: DistributionStatus;
}
export interface QueryRecordsByDistributionNameResponse {
    distributionRecords?: DistributionRecords;
    height: Long;
}
export interface QueryRecordsByRecipientAddrRequest {
    address: string;
}
export interface QueryRecordsByRecipientAddrResponse {
    distributionRecords?: DistributionRecords;
    height: Long;
}
export interface QueryClaimsByTypeRequest {
    userClaimType: DistributionType;
}
export interface QueryClaimsResponse {
    claims: UserClaim[];
    height: Long;
}
export declare const QueryAllDistributionsRequest: {
    encode(_: QueryAllDistributionsRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): QueryAllDistributionsRequest;
    fromJSON(_: any): QueryAllDistributionsRequest;
    toJSON(_: QueryAllDistributionsRequest): unknown;
    fromPartial(_: DeepPartial<QueryAllDistributionsRequest>): QueryAllDistributionsRequest;
};
export declare const QueryAllDistributionsResponse: {
    encode(message: QueryAllDistributionsResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): QueryAllDistributionsResponse;
    fromJSON(object: any): QueryAllDistributionsResponse;
    toJSON(message: QueryAllDistributionsResponse): unknown;
    fromPartial(object: DeepPartial<QueryAllDistributionsResponse>): QueryAllDistributionsResponse;
};
export declare const QueryRecordsByDistributionNameRequest: {
    encode(message: QueryRecordsByDistributionNameRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): QueryRecordsByDistributionNameRequest;
    fromJSON(object: any): QueryRecordsByDistributionNameRequest;
    toJSON(message: QueryRecordsByDistributionNameRequest): unknown;
    fromPartial(object: DeepPartial<QueryRecordsByDistributionNameRequest>): QueryRecordsByDistributionNameRequest;
};
export declare const QueryRecordsByDistributionNameResponse: {
    encode(message: QueryRecordsByDistributionNameResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): QueryRecordsByDistributionNameResponse;
    fromJSON(object: any): QueryRecordsByDistributionNameResponse;
    toJSON(message: QueryRecordsByDistributionNameResponse): unknown;
    fromPartial(object: DeepPartial<QueryRecordsByDistributionNameResponse>): QueryRecordsByDistributionNameResponse;
};
export declare const QueryRecordsByRecipientAddrRequest: {
    encode(message: QueryRecordsByRecipientAddrRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): QueryRecordsByRecipientAddrRequest;
    fromJSON(object: any): QueryRecordsByRecipientAddrRequest;
    toJSON(message: QueryRecordsByRecipientAddrRequest): unknown;
    fromPartial(object: DeepPartial<QueryRecordsByRecipientAddrRequest>): QueryRecordsByRecipientAddrRequest;
};
export declare const QueryRecordsByRecipientAddrResponse: {
    encode(message: QueryRecordsByRecipientAddrResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): QueryRecordsByRecipientAddrResponse;
    fromJSON(object: any): QueryRecordsByRecipientAddrResponse;
    toJSON(message: QueryRecordsByRecipientAddrResponse): unknown;
    fromPartial(object: DeepPartial<QueryRecordsByRecipientAddrResponse>): QueryRecordsByRecipientAddrResponse;
};
export declare const QueryClaimsByTypeRequest: {
    encode(message: QueryClaimsByTypeRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): QueryClaimsByTypeRequest;
    fromJSON(object: any): QueryClaimsByTypeRequest;
    toJSON(message: QueryClaimsByTypeRequest): unknown;
    fromPartial(object: DeepPartial<QueryClaimsByTypeRequest>): QueryClaimsByTypeRequest;
};
export declare const QueryClaimsResponse: {
    encode(message: QueryClaimsResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): QueryClaimsResponse;
    fromJSON(object: any): QueryClaimsResponse;
    toJSON(message: QueryClaimsResponse): unknown;
    fromPartial(object: DeepPartial<QueryClaimsResponse>): QueryClaimsResponse;
};
export interface Query {
    AllDistributions(request: QueryAllDistributionsRequest): Promise<QueryAllDistributionsResponse>;
    RecordsByDistributionName(request: QueryRecordsByDistributionNameRequest): Promise<QueryRecordsByDistributionNameResponse>;
    RecordsByRecipient(request: QueryRecordsByRecipientAddrRequest): Promise<QueryRecordsByRecipientAddrResponse>;
    ClaimsByType(request: QueryClaimsByTypeRequest): Promise<QueryClaimsResponse>;
}
export declare class QueryClientImpl implements Query {
    private readonly rpc;
    constructor(rpc: Rpc);
    AllDistributions(request: QueryAllDistributionsRequest): Promise<QueryAllDistributionsResponse>;
    RecordsByDistributionName(request: QueryRecordsByDistributionNameRequest): Promise<QueryRecordsByDistributionNameResponse>;
    RecordsByRecipient(request: QueryRecordsByRecipientAddrRequest): Promise<QueryRecordsByRecipientAddrResponse>;
    ClaimsByType(request: QueryClaimsByTypeRequest): Promise<QueryClaimsResponse>;
}
interface Rpc {
    request(service: string, method: string, data: Uint8Array): Promise<Uint8Array>;
}
declare type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined | Long;
export declare type DeepPartial<T> = T extends Builtin ? T : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : T extends {} ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : Partial<T>;
export {};
