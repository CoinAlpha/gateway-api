import Long from "long";
import _m0 from "protobufjs/minimal";
import { Coin } from "../../../cosmos/base/coin";
export declare const protobufPackage = "sifnode.dispensation.v1";
/** Distribution type enum */
export declare enum DistributionType {
    /** DISTRIBUTION_TYPE_UNSPECIFIED - Unspecified distribution type */
    DISTRIBUTION_TYPE_UNSPECIFIED = 0,
    /** DISTRIBUTION_TYPE_AIRDROP - Airdrop distribution type */
    DISTRIBUTION_TYPE_AIRDROP = 1,
    /** DISTRIBUTION_TYPE_VALIDATOR_SUBSIDY - Validator Subsidy distribution type */
    DISTRIBUTION_TYPE_VALIDATOR_SUBSIDY = 2,
    /** DISTRIBUTION_TYPE_LIQUIDITY_MINING - Liquidity mining distribution type */
    DISTRIBUTION_TYPE_LIQUIDITY_MINING = 3,
    UNRECOGNIZED = -1
}
export declare function distributionTypeFromJSON(object: any): DistributionType;
export declare function distributionTypeToJSON(object: DistributionType): string;
/** Claim status enum */
export declare enum DistributionStatus {
    /** DISTRIBUTION_STATUS_UNSPECIFIED - Unspecified */
    DISTRIBUTION_STATUS_UNSPECIFIED = 0,
    /** DISTRIBUTION_STATUS_PENDING - Pending status */
    DISTRIBUTION_STATUS_PENDING = 1,
    /** DISTRIBUTION_STATUS_COMPLETED - Completed status */
    DISTRIBUTION_STATUS_COMPLETED = 2,
    /** DISTRIBUTION_STATUS_FAILED - Failed status */
    DISTRIBUTION_STATUS_FAILED = 3,
    UNRECOGNIZED = -1
}
export declare function distributionStatusFromJSON(object: any): DistributionStatus;
export declare function distributionStatusToJSON(object: DistributionStatus): string;
export interface GenesisState {
    distributionRecords?: DistributionRecords;
    distributions?: Distributions;
    claims?: UserClaims;
}
export interface DistributionRecord {
    distributionStatus: DistributionStatus;
    distributionType: DistributionType;
    distributionName: string;
    recipientAddress: string;
    coins: Coin[];
    distributionStartHeight: Long;
    distributionCompletedHeight: Long;
    authorizedRunner: string;
}
export interface DistributionRecords {
    distributionRecords: DistributionRecord[];
}
export interface Distributions {
    distributions: Distribution[];
}
export interface Distribution {
    distributionType: DistributionType;
    distributionName: string;
    runner: string;
}
export interface UserClaim {
    userAddress: string;
    userClaimType: DistributionType;
    userClaimTime: string;
}
export interface UserClaims {
    userClaims: UserClaim[];
}
export declare const GenesisState: {
    encode(message: GenesisState, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): GenesisState;
    fromJSON(object: any): GenesisState;
    toJSON(message: GenesisState): unknown;
    fromPartial(object: DeepPartial<GenesisState>): GenesisState;
};
export declare const DistributionRecord: {
    encode(message: DistributionRecord, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): DistributionRecord;
    fromJSON(object: any): DistributionRecord;
    toJSON(message: DistributionRecord): unknown;
    fromPartial(object: DeepPartial<DistributionRecord>): DistributionRecord;
};
export declare const DistributionRecords: {
    encode(message: DistributionRecords, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): DistributionRecords;
    fromJSON(object: any): DistributionRecords;
    toJSON(message: DistributionRecords): unknown;
    fromPartial(object: DeepPartial<DistributionRecords>): DistributionRecords;
};
export declare const Distributions: {
    encode(message: Distributions, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): Distributions;
    fromJSON(object: any): Distributions;
    toJSON(message: Distributions): unknown;
    fromPartial(object: DeepPartial<Distributions>): Distributions;
};
export declare const Distribution: {
    encode(message: Distribution, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): Distribution;
    fromJSON(object: any): Distribution;
    toJSON(message: Distribution): unknown;
    fromPartial(object: DeepPartial<Distribution>): Distribution;
};
export declare const UserClaim: {
    encode(message: UserClaim, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): UserClaim;
    fromJSON(object: any): UserClaim;
    toJSON(message: UserClaim): unknown;
    fromPartial(object: DeepPartial<UserClaim>): UserClaim;
};
export declare const UserClaims: {
    encode(message: UserClaims, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): UserClaims;
    fromJSON(object: any): UserClaims;
    toJSON(message: UserClaims): unknown;
    fromPartial(object: DeepPartial<UserClaims>): UserClaims;
};
declare type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined | Long;
export declare type DeepPartial<T> = T extends Builtin ? T : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : T extends {} ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : Partial<T>;
export {};
