import Long from "long";
import _m0 from "protobufjs/minimal";
export declare const protobufPackage = "sifnode.tokenregistry.v1";
export declare enum Permission {
    UNSPECIFIED = 0,
    CLP = 1,
    IBCEXPORT = 2,
    IBCIMPORT = 3,
    UNRECOGNIZED = -1
}
export declare function permissionFromJSON(object: any): Permission;
export declare function permissionToJSON(object: Permission): string;
export interface GenesisState {
    adminAccount: string;
    registry?: Registry;
}
export interface Registry {
    entries: RegistryEntry[];
}
export interface RegistryEntry {
    decimals: Long;
    denom: string;
    baseDenom: string;
    path: string;
    ibcChannelId: string;
    ibcCounterpartyChannelId: string;
    displayName: string;
    displaySymbol: string;
    network: string;
    address: string;
    externalSymbol: string;
    transferLimit: string;
    permissions: Permission[];
    /**
     * The name of denomination unit of this token that is the smallest unit
     * stored. IBC imports of this RegistryEntry convert and store funds as
     * unit_denom. Several different denom units of a token may be imported into
     * this same unit denom, they should all be stored under the same unit_denom
     * if they are the same token. When exporting a RegistryEntry where unit_denom
     * != denom, then unit_denom can, in future, be used to indicate the source of
     * funds for a denom unit that does not actually exist on chain, enabling
     * other chains to overcome the uint64 limit on the packet level and import
     * large amounts of high precision tokens easily. ie. microrowan -> rowan i.e
     * rowan -> rowan
     */
    unitDenom: string;
    /**
     * The name of denomination unit of this token that should appear on
     * counterparty chain when this unit is exported. If empty, the denom is
     * exported as is. Generally this will only be used to map a high precision
     * (unit_denom) to a lower precision, to overcome the current uint64 limit on
     * the packet level. i.e rowan -> microrowan i.e microrowan -> microrowan
     */
    ibcCounterpartyDenom: string;
    ibcCounterpartyChainId: string;
}
export declare const GenesisState: {
    encode(message: GenesisState, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): GenesisState;
    fromJSON(object: any): GenesisState;
    toJSON(message: GenesisState): unknown;
    fromPartial(object: DeepPartial<GenesisState>): GenesisState;
};
export declare const Registry: {
    encode(message: Registry, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): Registry;
    fromJSON(object: any): Registry;
    toJSON(message: Registry): unknown;
    fromPartial(object: DeepPartial<Registry>): Registry;
};
export declare const RegistryEntry: {
    encode(message: RegistryEntry, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): RegistryEntry;
    fromJSON(object: any): RegistryEntry;
    toJSON(message: RegistryEntry): unknown;
    fromPartial(object: DeepPartial<RegistryEntry>): RegistryEntry;
};
declare type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined | Long;
export declare type DeepPartial<T> = T extends Builtin ? T : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : T extends {} ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : Partial<T>;
export {};
