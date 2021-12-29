import { DistributionType } from "../../generated/proto/sifnode/dispensation/v1/types";
import { Services } from "../../services";
import { TransactionStatus } from "../../entities/Transaction";
declare type PickDispensation = Pick<Services["dispensation"], "claim">;
declare type PickSif = Services["sif"];
export declare type ClaimArgs = {
    dispensation: PickDispensation;
    sif: PickSif;
    chains: Services["chains"];
    wallet: Services["wallet"];
};
declare type RewardProgramName = "COSMOS_IBC_REWARDS_V1" | "harvest";
export declare function Claim({ dispensation, wallet, sif, chains }: ClaimArgs): ({ rewardProgramName, ...params }: {
    claimType: DistributionType;
    fromAddress: string;
    rewardProgramName: RewardProgramName;
}) => Promise<TransactionStatus>;
export {};
