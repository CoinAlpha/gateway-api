import { StargateClient } from "@cosmjs/stargate";
import { BroadcastTxParams, Tendermint34Client } from "@cosmjs/tendermint-rpc";

// Determined unneccessary as of 2021-08-11. Remove if date is past 2021-09-11.
export const overwriteStargateClientToUseCommit = () => {
  const originalBroadcast = StargateClient.prototype.broadcastTx;
  StargateClient.prototype.broadcastTx = async function (params) {
    const originalBrdcstSync = Tendermint34Client.prototype.broadcastTxSync;
    Tendermint34Client.prototype.broadcastTxSync = async function (
      params: BroadcastTxParams,
    ) {
      const commitRes = await this.broadcastTxCommit(params);
      return {
        ...(commitRes.deliverTx ?? {}),
        ...commitRes.checkTx,
        ...commitRes,
      };
    };
    const rtn = originalBroadcast.bind(this)(params);
    Tendermint34Client.prototype.broadcastTxSync = originalBrdcstSync;
    return rtn;
  };
};
