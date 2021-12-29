import { UsecaseContext } from "..";
import { CryptoeconomicsRewardType } from "../../services/CryptoeconomicsService";
import { Services } from "services";
export declare const BLOCK_TIME_MS: number;
export declare const VS_STORAGE_KEY = "NOTIFIED_VS_STORAGE";
export declare const LM_STORAGE_KEY = "NOTIFIED_LM_STORAGE";
export default function rewardActions({ services, store, }: UsecaseContext<keyof Services, "wallet">): {
    subscribeToRewardData(rewardType: CryptoeconomicsRewardType): () => void;
    notifyLmMaturity(): () => void;
    notifyVsMaturity(): () => void;
    claim: ({ rewardProgramName, ...params }: {
        claimType: import("../../generated/proto/sifnode/dispensation/v1/types").DistributionType;
        fromAddress: string;
        rewardProgramName: "harvest" | "COSMOS_IBC_REWARDS_V1";
    }) => Promise<import("../../entities").TransactionStatus>;
};
