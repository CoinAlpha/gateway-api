import { StargateClient } from "@cosmjs/stargate";
import Long from "long";
export declare const getTransferTimeoutData: (receivingStargateClient: StargateClient, desiredTimeoutMinutes: number) => Promise<{
    revisionNumber: Long.Long;
    revisionHeight: Long.Long;
}>;
