export type CryptoeconomicsUserData = null | {
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

    tickets: [
      {
        timestamp: string;
        mul: number;
      },
    ];
  };
};

export type CryptoeconomicsServiceContext = {
  cryptoeconomicsUrl: string;
};

export type CryptoeconomicsRewardType = "vs" | "lm" | "lm_harvest";

export interface FetchDataProps {
  rewardType?: CryptoeconomicsRewardType;
  rewardProgram?: "harvest";
  address: string;
  key?: string;
  timestamp?: string;
  snapShotSource?: string;
  devnet: boolean;
}

export type CryptoeconomicsTimeseriesItem = {
  timestamp: number;
  userClaimableReward: number;
};

export default function createCryptoeconomicsService(
  config: CryptoeconomicsServiceContext,
) {
  async function fetchData(
    props: FetchDataProps,
  ): Promise<CryptoeconomicsUserData> {
    const params = new URLSearchParams();
    params.set("address", props.address);
    params.set("key", props.key || "userData");
    params.set("timestamp", props.timestamp || "now");
    if (props.rewardProgram) {
      params.set("program", props.rewardProgram);
    }
    props.snapShotSource
      ? params.set("snapshot-source", props.snapShotSource)
      : null;
    const res = await fetch(
      `https://api-cryptoeconomics${
        props.devnet ? "-devnet" : ""
      }.sifchain.finance/api/${props.rewardType}?${params.toString()}`,
    );
    if (!res.ok) {
      throw new Error("Failed to fetch cryptoeconomics data");
    } else {
      const json = await res.json();
      if (json.user?.maturityDateISO) {
        json.user.maturityDate = new Date(json.user.maturityDateISO);
      }
      return json;
    }
  }

  return {
    fetchData,
    getAddressLink: (
      address: string,
      rewardType: CryptoeconomicsRewardType,
    ) => {
      return `https://cryptoeconomics.sifchain.finance/#${address}&type=${rewardType}`;
    },
    async fetchSummaryAPY({
      rewardProgram,
      devnet = false,
    }: {
      rewardProgram?: "harvest";
      devnet?: boolean;
    }) {
      const summaryAPY: number = await fetch(
        `https://api-cryptoeconomics${
          devnet ? "-devnet" : ""
        }.sifchain.finance/api/lm?key=apy-summary&program=${
          rewardProgram || ""
        }`,
      )
        .then((r) => r.json())
        .then((r) => r.summaryAPY);
      return summaryAPY;
    },
    fetchVsData: (options: FetchDataProps) =>
      fetchData({
        ...options,
        rewardType: "vs",
      }),
    fetchLmData: (options: FetchDataProps) =>
      fetchData({
        ...options,
        rewardType: "lm",
      }),
    fetchTimeseriesData: async (props: {
      address: string;
      devnet: boolean;
    }) => {
      const data = await fetchData({
        address: props.address,
        rewardType: "lm",
        key: "userTimeSeriesData",
        devnet: props.devnet,
      });
      return (data as unknown) as CryptoeconomicsTimeseriesItem[];
    },
  };
}
