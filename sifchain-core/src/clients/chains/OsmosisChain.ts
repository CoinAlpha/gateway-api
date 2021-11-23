import { Chain, IAssetAmount } from "../../entities";
import { urlJoin } from "url-join-ts";
import { BaseChain } from "./_BaseChain";

export class OsmosisChain extends BaseChain implements Chain {
  getBlockExplorerUrlForTxHash(hash: string) {
    return urlJoin(this.chainConfig.blockExplorerUrl, "txs", hash);
  }
  getBlockExplorerUrlForAddress(hash: string) {
    return urlJoin(this.chainConfig.blockExplorerUrl, "account", hash);
  }
}
