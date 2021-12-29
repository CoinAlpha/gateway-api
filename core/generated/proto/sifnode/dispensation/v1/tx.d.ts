import Long from "long";
import _m0 from "protobufjs/minimal";
import { DistributionType } from "../../../sifnode/dispensation/v1/types";
export declare const protobufPackage = "sifnode.dispensation.v1";
export interface MsgCreateDistribution {
    distributor: string;
    authorizedRunner: string;
    distributionType: DistributionType;
    output: string[];
}
export interface MsgCreateDistributionResponse {
}
export interface MsgCreateClaimResponse {
}
export interface MsgRunDistributionResponse {
}
export interface MsgCreateUserClaim {
    userClaimAddress: string;
    userClaimType: DistributionType;
}
export interface MsgRunDistribution {
    authorizedRunner: string;
    distributionName: string;
    distributionType: DistributionType;
}
export declare const MsgCreateDistribution: {
    encode(message: MsgCreateDistribution, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): MsgCreateDistribution;
    fromJSON(object: any): MsgCreateDistribution;
    toJSON(message: MsgCreateDistribution): unknown;
    fromPartial(object: DeepPartial<MsgCreateDistribution>): MsgCreateDistribution;
};
export declare const MsgCreateDistributionResponse: {
    encode(_: MsgCreateDistributionResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): MsgCreateDistributionResponse;
    fromJSON(_: any): MsgCreateDistributionResponse;
    toJSON(_: MsgCreateDistributionResponse): unknown;
    fromPartial(_: DeepPartial<MsgCreateDistributionResponse>): MsgCreateDistributionResponse;
};
export declare const MsgCreateClaimResponse: {
    encode(_: MsgCreateClaimResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): MsgCreateClaimResponse;
    fromJSON(_: any): MsgCreateClaimResponse;
    toJSON(_: MsgCreateClaimResponse): unknown;
    fromPartial(_: DeepPartial<MsgCreateClaimResponse>): MsgCreateClaimResponse;
};
export declare const MsgRunDistributionResponse: {
    encode(_: MsgRunDistributionResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): MsgRunDistributionResponse;
    fromJSON(_: any): MsgRunDistributionResponse;
    toJSON(_: MsgRunDistributionResponse): unknown;
    fromPartial(_: DeepPartial<MsgRunDistributionResponse>): MsgRunDistributionResponse;
};
export declare const MsgCreateUserClaim: {
    encode(message: MsgCreateUserClaim, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): MsgCreateUserClaim;
    fromJSON(object: any): MsgCreateUserClaim;
    toJSON(message: MsgCreateUserClaim): unknown;
    fromPartial(object: DeepPartial<MsgCreateUserClaim>): MsgCreateUserClaim;
};
export declare const MsgRunDistribution: {
    encode(message: MsgRunDistribution, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): MsgRunDistribution;
    fromJSON(object: any): MsgRunDistribution;
    toJSON(message: MsgRunDistribution): unknown;
    fromPartial(object: DeepPartial<MsgRunDistribution>): MsgRunDistribution;
};
export interface Msg {
    CreateDistribution(request: MsgCreateDistribution): Promise<MsgCreateDistributionResponse>;
    CreateUserClaim(request: MsgCreateUserClaim): Promise<MsgCreateClaimResponse>;
    RunDistribution(request: MsgRunDistribution): Promise<MsgRunDistributionResponse>;
}
export declare class MsgClientImpl implements Msg {
    private readonly rpc;
    constructor(rpc: Rpc);
    CreateDistribution(request: MsgCreateDistribution): Promise<MsgCreateDistributionResponse>;
    CreateUserClaim(request: MsgCreateUserClaim): Promise<MsgCreateClaimResponse>;
    RunDistribution(request: MsgRunDistribution): Promise<MsgRunDistributionResponse>;
}
interface Rpc {
    request(service: string, method: string, data: Uint8Array): Promise<Uint8Array>;
}
declare type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined | Long;
export declare type DeepPartial<T> = T extends Builtin ? T : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : T extends {} ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : Partial<T>;
export {};
