import { Chain } from "../../entities";
import { BaseChain } from "./_BaseChain";
import { urlJoin } from "url-join-ts";

export class EmoneyChain extends BaseChain implements Chain {
  getBlockExplorerUrlForTxHash(hash: string) {
    return urlJoin(this.chainConfig.blockExplorerUrl, "txs", hash);
  }
  getBlockExplorerUrlForAddress(hash: string) {
    return urlJoin(this.chainConfig.blockExplorerUrl, "account", hash);
  }
}
