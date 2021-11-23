import { StargateClient } from "@cosmjs/stargate";
import Long from "long";
import { ChainIdHelper } from "../../wallets/cosmos/ChainIdHelper";

export const getTransferTimeoutData = async (
  receivingStargateClient: StargateClient,
  desiredTimeoutMinutes: number,
) => {
  const blockTimeMinutes = 7.25 / 60;

  const timeoutBlockDelta = desiredTimeoutMinutes / blockTimeMinutes;

  return {
    revisionNumber: Long.fromNumber(
      +ChainIdHelper.parse(
        await receivingStargateClient.getChainId(),
      ).version.toString() || 0,
    ),
    // Set the timeout height as the current height + 150.
    revisionHeight: Long.fromNumber(
      (await receivingStargateClient.getHeight()) + timeoutBlockDelta,
    ),
  };
};
