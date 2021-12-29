import Long from "long";
import _m0 from "protobufjs/minimal";
import { RegistryEntry, Registry } from "../../../sifnode/tokenregistry/v1/types";
export declare const protobufPackage = "sifnode.tokenregistry.v1";
export interface MsgRegister {
    from: string;
    entry?: RegistryEntry;
}
export interface MsgRegisterResponse {
}
export interface MsgSetRegistry {
    from: string;
    registry?: Registry;
}
export interface MsgSetRegistryResponse {
}
export interface MsgDeregister {
    from: string;
    denom: string;
}
export interface MsgDeregisterResponse {
}
export declare const MsgRegister: {
    encode(message: MsgRegister, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): MsgRegister;
    fromJSON(object: any): MsgRegister;
    toJSON(message: MsgRegister): unknown;
    fromPartial(object: DeepPartial<MsgRegister>): MsgRegister;
};
export declare const MsgRegisterResponse: {
    encode(_: MsgRegisterResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): MsgRegisterResponse;
    fromJSON(_: any): MsgRegisterResponse;
    toJSON(_: MsgRegisterResponse): unknown;
    fromPartial(_: DeepPartial<MsgRegisterResponse>): MsgRegisterResponse;
};
export declare const MsgSetRegistry: {
    encode(message: MsgSetRegistry, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): MsgSetRegistry;
    fromJSON(object: any): MsgSetRegistry;
    toJSON(message: MsgSetRegistry): unknown;
    fromPartial(object: DeepPartial<MsgSetRegistry>): MsgSetRegistry;
};
export declare const MsgSetRegistryResponse: {
    encode(_: MsgSetRegistryResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): MsgSetRegistryResponse;
    fromJSON(_: any): MsgSetRegistryResponse;
    toJSON(_: MsgSetRegistryResponse): unknown;
    fromPartial(_: DeepPartial<MsgSetRegistryResponse>): MsgSetRegistryResponse;
};
export declare const MsgDeregister: {
    encode(message: MsgDeregister, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): MsgDeregister;
    fromJSON(object: any): MsgDeregister;
    toJSON(message: MsgDeregister): unknown;
    fromPartial(object: DeepPartial<MsgDeregister>): MsgDeregister;
};
export declare const MsgDeregisterResponse: {
    encode(_: MsgDeregisterResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): MsgDeregisterResponse;
    fromJSON(_: any): MsgDeregisterResponse;
    toJSON(_: MsgDeregisterResponse): unknown;
    fromPartial(_: DeepPartial<MsgDeregisterResponse>): MsgDeregisterResponse;
};
export interface Msg {
    Register(request: MsgRegister): Promise<MsgRegisterResponse>;
    Deregister(request: MsgDeregister): Promise<MsgDeregisterResponse>;
    SetRegistry(request: MsgSetRegistry): Promise<MsgSetRegistryResponse>;
}
export declare class MsgClientImpl implements Msg {
    private readonly rpc;
    constructor(rpc: Rpc);
    Register(request: MsgRegister): Promise<MsgRegisterResponse>;
    Deregister(request: MsgDeregister): Promise<MsgDeregisterResponse>;
    SetRegistry(request: MsgSetRegistry): Promise<MsgSetRegistryResponse>;
}
interface Rpc {
    request(service: string, method: string, data: Uint8Array): Promise<Uint8Array>;
}
declare type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined | Long;
export declare type DeepPartial<T> = T extends Builtin ? T : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : T extends {} ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : Partial<T>;
export {};
