import Long from "long";
import _m0 from "protobufjs/minimal";
export declare const protobufPackage = "sifnode.oracle.v1";
/** StatusText is an enum used to represent the status of the prophecy */
export declare enum StatusText {
    /** STATUS_TEXT_UNSPECIFIED - Default value */
    STATUS_TEXT_UNSPECIFIED = 0,
    /** STATUS_TEXT_PENDING - Pending status */
    STATUS_TEXT_PENDING = 1,
    /** STATUS_TEXT_SUCCESS - Success status */
    STATUS_TEXT_SUCCESS = 2,
    /** STATUS_TEXT_FAILED - Failed status */
    STATUS_TEXT_FAILED = 3,
    UNRECOGNIZED = -1
}
export declare function statusTextFromJSON(object: any): StatusText;
export declare function statusTextToJSON(object: StatusText): string;
export interface GenesisState {
    addressWhitelist: string[];
    adminAddress: string;
    prophecies: DBProphecy[];
}
/**
 * Claim contains an arbitrary claim with arbitrary content made by a given
 * validator
 */
export interface Claim {
    id: string;
    validatorAddress: string;
    content: string;
}
/**
 * DBProphecy is what the prophecy becomes when being saved to the database.
 *  Tendermint/Amino does not support maps so we must serialize those variables
 *  into bytes.
 */
export interface DBProphecy {
    id: string;
    status?: Status;
    claimValidators: Uint8Array;
    validatorClaims: Uint8Array;
}
/** Status is a struct that contains the status of a given prophecy */
export interface Status {
    text: StatusText;
    finalClaim: string;
}
export declare const GenesisState: {
    encode(message: GenesisState, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): GenesisState;
    fromJSON(object: any): GenesisState;
    toJSON(message: GenesisState): unknown;
    fromPartial(object: DeepPartial<GenesisState>): GenesisState;
};
export declare const Claim: {
    encode(message: Claim, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): Claim;
    fromJSON(object: any): Claim;
    toJSON(message: Claim): unknown;
    fromPartial(object: DeepPartial<Claim>): Claim;
};
export declare const DBProphecy: {
    encode(message: DBProphecy, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): DBProphecy;
    fromJSON(object: any): DBProphecy;
    toJSON(message: DBProphecy): unknown;
    fromPartial(object: DeepPartial<DBProphecy>): DBProphecy;
};
export declare const Status: {
    encode(message: Status, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): Status;
    fromJSON(object: any): Status;
    toJSON(message: Status): unknown;
    fromPartial(object: DeepPartial<Status>): Status;
};
declare type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined | Long;
export declare type DeepPartial<T> = T extends Builtin ? T : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : T extends {} ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : Partial<T>;
export {};
