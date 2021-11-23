import { Chain, IAssetAmount } from "../../entities";
import { urlJoin } from "url-join-ts";
import { BaseChain } from "./_BaseChain";

export class IxoChain extends BaseChain implements Chain {
  getBlockExplorerUrlForTxHash(hash: string) {
    return urlJoin(
      this.chainConfig.blockExplorerUrl,
      "/cosmos/tx/v1beta1/txs/",
      hash,
    );
  }
  getBlockExplorerUrlForAddress(address: string) {
    return urlJoin(
      this.chainConfig.blockExplorerUrl,
      "/cosmos/bank/v1beta1/balances/",
      address,
    );
  }
}
