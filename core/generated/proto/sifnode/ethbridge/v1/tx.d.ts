import Long from "long";
import _m0 from "protobufjs/minimal";
import { EthBridgeClaim } from "../../../sifnode/ethbridge/v1/types";
export declare const protobufPackage = "sifnode.ethbridge.v1";
/** MsgLock defines a message for locking coins and triggering a related event */
export interface MsgLock {
    cosmosSender: string;
    amount: string;
    symbol: string;
    ethereumChainId: Long;
    ethereumReceiver: string;
    cethAmount: string;
}
export interface MsgLockResponse {
}
/** MsgBurn defines a message for burning coins and triggering a related event */
export interface MsgBurn {
    cosmosSender: string;
    amount: string;
    symbol: string;
    ethereumChainId: Long;
    ethereumReceiver: string;
    cethAmount: string;
}
export interface MsgBurnResponse {
}
export interface MsgCreateEthBridgeClaim {
    ethBridgeClaim?: EthBridgeClaim;
}
export interface MsgCreateEthBridgeClaimResponse {
}
/** MsgUpdateWhiteListValidator add or remove validator from whitelist */
export interface MsgUpdateWhiteListValidator {
    cosmosSender: string;
    validator: string;
    operationType: string;
}
export interface MsgUpdateWhiteListValidatorResponse {
}
export interface MsgUpdateCethReceiverAccount {
    cosmosSender: string;
    cethReceiverAccount: string;
}
export interface MsgUpdateCethReceiverAccountResponse {
}
export interface MsgRescueCeth {
    cosmosSender: string;
    cosmosReceiver: string;
    cethAmount: string;
}
export interface MsgRescueCethResponse {
}
export declare const MsgLock: {
    encode(message: MsgLock, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): MsgLock;
    fromJSON(object: any): MsgLock;
    toJSON(message: MsgLock): unknown;
    fromPartial(object: DeepPartial<MsgLock>): MsgLock;
};
export declare const MsgLockResponse: {
    encode(_: MsgLockResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): MsgLockResponse;
    fromJSON(_: any): MsgLockResponse;
    toJSON(_: MsgLockResponse): unknown;
    fromPartial(_: DeepPartial<MsgLockResponse>): MsgLockResponse;
};
export declare const MsgBurn: {
    encode(message: MsgBurn, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): MsgBurn;
    fromJSON(object: any): MsgBurn;
    toJSON(message: MsgBurn): unknown;
    fromPartial(object: DeepPartial<MsgBurn>): MsgBurn;
};
export declare const MsgBurnResponse: {
    encode(_: MsgBurnResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): MsgBurnResponse;
    fromJSON(_: any): MsgBurnResponse;
    toJSON(_: MsgBurnResponse): unknown;
    fromPartial(_: DeepPartial<MsgBurnResponse>): MsgBurnResponse;
};
export declare const MsgCreateEthBridgeClaim: {
    encode(message: MsgCreateEthBridgeClaim, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): MsgCreateEthBridgeClaim;
    fromJSON(object: any): MsgCreateEthBridgeClaim;
    toJSON(message: MsgCreateEthBridgeClaim): unknown;
    fromPartial(object: DeepPartial<MsgCreateEthBridgeClaim>): MsgCreateEthBridgeClaim;
};
export declare const MsgCreateEthBridgeClaimResponse: {
    encode(_: MsgCreateEthBridgeClaimResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): MsgCreateEthBridgeClaimResponse;
    fromJSON(_: any): MsgCreateEthBridgeClaimResponse;
    toJSON(_: MsgCreateEthBridgeClaimResponse): unknown;
    fromPartial(_: DeepPartial<MsgCreateEthBridgeClaimResponse>): MsgCreateEthBridgeClaimResponse;
};
export declare const MsgUpdateWhiteListValidator: {
    encode(message: MsgUpdateWhiteListValidator, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): MsgUpdateWhiteListValidator;
    fromJSON(object: any): MsgUpdateWhiteListValidator;
    toJSON(message: MsgUpdateWhiteListValidator): unknown;
    fromPartial(object: DeepPartial<MsgUpdateWhiteListValidator>): MsgUpdateWhiteListValidator;
};
export declare const MsgUpdateWhiteListValidatorResponse: {
    encode(_: MsgUpdateWhiteListValidatorResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): MsgUpdateWhiteListValidatorResponse;
    fromJSON(_: any): MsgUpdateWhiteListValidatorResponse;
    toJSON(_: MsgUpdateWhiteListValidatorResponse): unknown;
    fromPartial(_: DeepPartial<MsgUpdateWhiteListValidatorResponse>): MsgUpdateWhiteListValidatorResponse;
};
export declare const MsgUpdateCethReceiverAccount: {
    encode(message: MsgUpdateCethReceiverAccount, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): MsgUpdateCethReceiverAccount;
    fromJSON(object: any): MsgUpdateCethReceiverAccount;
    toJSON(message: MsgUpdateCethReceiverAccount): unknown;
    fromPartial(object: DeepPartial<MsgUpdateCethReceiverAccount>): MsgUpdateCethReceiverAccount;
};
export declare const MsgUpdateCethReceiverAccountResponse: {
    encode(_: MsgUpdateCethReceiverAccountResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): MsgUpdateCethReceiverAccountResponse;
    fromJSON(_: any): MsgUpdateCethReceiverAccountResponse;
    toJSON(_: MsgUpdateCethReceiverAccountResponse): unknown;
    fromPartial(_: DeepPartial<MsgUpdateCethReceiverAccountResponse>): MsgUpdateCethReceiverAccountResponse;
};
export declare const MsgRescueCeth: {
    encode(message: MsgRescueCeth, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): MsgRescueCeth;
    fromJSON(object: any): MsgRescueCeth;
    toJSON(message: MsgRescueCeth): unknown;
    fromPartial(object: DeepPartial<MsgRescueCeth>): MsgRescueCeth;
};
export declare const MsgRescueCethResponse: {
    encode(_: MsgRescueCethResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): MsgRescueCethResponse;
    fromJSON(_: any): MsgRescueCethResponse;
    toJSON(_: MsgRescueCethResponse): unknown;
    fromPartial(_: DeepPartial<MsgRescueCethResponse>): MsgRescueCethResponse;
};
/** Msg service for messages */
export interface Msg {
    Lock(request: MsgLock): Promise<MsgLockResponse>;
    Burn(request: MsgBurn): Promise<MsgBurnResponse>;
    CreateEthBridgeClaim(request: MsgCreateEthBridgeClaim): Promise<MsgCreateEthBridgeClaimResponse>;
    UpdateWhiteListValidator(request: MsgUpdateWhiteListValidator): Promise<MsgUpdateWhiteListValidatorResponse>;
    UpdateCethReceiverAccount(request: MsgUpdateCethReceiverAccount): Promise<MsgUpdateCethReceiverAccountResponse>;
    RescueCeth(request: MsgRescueCeth): Promise<MsgRescueCethResponse>;
}
export declare class MsgClientImpl implements Msg {
    private readonly rpc;
    constructor(rpc: Rpc);
    Lock(request: MsgLock): Promise<MsgLockResponse>;
    Burn(request: MsgBurn): Promise<MsgBurnResponse>;
    CreateEthBridgeClaim(request: MsgCreateEthBridgeClaim): Promise<MsgCreateEthBridgeClaimResponse>;
    UpdateWhiteListValidator(request: MsgUpdateWhiteListValidator): Promise<MsgUpdateWhiteListValidatorResponse>;
    UpdateCethReceiverAccount(request: MsgUpdateCethReceiverAccount): Promise<MsgUpdateCethReceiverAccountResponse>;
    RescueCeth(request: MsgRescueCeth): Promise<MsgRescueCethResponse>;
}
interface Rpc {
    request(service: string, method: string, data: Uint8Array): Promise<Uint8Array>;
}
declare type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined | Long;
export declare type DeepPartial<T> = T extends Builtin ? T : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : T extends {} ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : Partial<T>;
export {};
