import { StargateClient } from "@cosmjs/stargate";
import Long from "long";
export declare class ChainIdHelper {
    static readonly VersionFormatRegExp: RegExp;
    static parse(chainId: string): {
        identifier: string;
        version: number;
    };
    static hasChainVersion(chainId: string): boolean;
}
export declare const getTransferTimeoutData: (receivingStargateClient: StargateClient, desiredTimeoutMinutes: number) => Promise<{
    revisionNumber: Long.Long;
    revisionHeight: Long.Long;
}>;
