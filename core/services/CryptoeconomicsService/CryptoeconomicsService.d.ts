export declare type CryptoeconomicsUserData = null | {
    timestamp: number;
    user?: {
        maturityDate: Date;
        dispensed: number;
        claimedCommissionsAndRewardsAwaitingDispensation: number;
        currentTotalCommissionsOnClaimableDelegatorRewards: number;
        nextRewardProjectedAPYOnTickets: number;
        totalClaimableCommissionsAndClaimableRewards: number;
        totalCommissionsAndRewardsAtMaturity: number;
        claimableReward: number;
        totalRewardAtMaturity: number;
        currentAPYOnTickets: number;
        totalDepositedAmount: number;
        yearsToMaturity: number;
        tickets: [{
            timestamp: string;
            mul: number;
        }];
    };
};
export declare type CryptoeconomicsServiceContext = {
    cryptoeconomicsUrl: string;
};
export declare type CryptoeconomicsRewardType = "vs" | "lm" | "lm_harvest";
export interface FetchDataProps {
    rewardType?: CryptoeconomicsRewardType;
    rewardProgram?: "harvest";
    address: string;
    key?: string;
    timestamp?: string;
    snapShotSource?: string;
    devnet: boolean;
}
export declare type CryptoeconomicsTimeseriesItem = {
    timestamp: number;
    userClaimableReward: number;
};
export default function createCryptoeconomicsService(config: CryptoeconomicsServiceContext): {
    fetchData: (props: FetchDataProps) => Promise<CryptoeconomicsUserData>;
    getAddressLink: (address: string, rewardType: CryptoeconomicsRewardType) => string;
    fetchSummaryAPY({ rewardProgram, devnet, }: {
        rewardProgram?: "harvest" | undefined;
        devnet?: boolean | undefined;
    }): Promise<number>;
    fetchVsData: (options: FetchDataProps) => Promise<CryptoeconomicsUserData>;
    fetchLmData: (options: FetchDataProps) => Promise<CryptoeconomicsUserData>;
    fetchTimeseriesData: (props: {
        address: string;
        devnet: boolean;
    }) => Promise<CryptoeconomicsTimeseriesItem[]>;
};
